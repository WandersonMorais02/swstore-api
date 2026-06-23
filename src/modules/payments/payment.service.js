import { Order } from '../orders/order.model.js'
import { orderService } from '../orders/order.service.js'
import { Payment } from './payment.model.js'
import { PaymentDTO } from './payment.dto.js'

import {
  ensureMercadoPagoConfigured,
  mercadoPagoPreference,
  mercadoPagoPayment
} from './mercado-pago.client.js'

import { env } from '../../config/env.js'
import { AppError } from '../../shared/errors/AppError.js'

function toBRLFromCents(value) {
  return Number((value / 100).toFixed(2))
}

function mapMercadoPagoStatus(status) {
  const map = {
    pending: 'PENDING',
    approved: 'APPROVED',
    authorized: 'PENDING',
    in_process: 'PENDING',
    in_mediation: 'PENDING',
    rejected: 'REJECTED',
    cancelled: 'CANCELED',
    refunded: 'REFUNDED',
    charged_back: 'REFUNDED'
  }

  return map[status] || 'PENDING'
}

async function createCheckout(orderId, currentUser) {
  ensureMercadoPagoConfigured()

  const order = await Order.findById(orderId)

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  const isOwner = order.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode pagar esse pedido', 403)
  }

  if (order.status !== 'PENDING_PAYMENT') {
    throw new AppError('Esse pedido não está pendente de pagamento', 400)
  }

  const items = order.items.map(item => ({
    id: item.productId.toString(),
    title: item.name,
    quantity: item.quantity,
    unit_price: toBRLFromCents(item.unitPrice),
    currency_id: 'BRL'
  }))

  if (order.shippingAmount > 0) {
    items.push({
      id: 'shipping',
      title: 'Frete',
      quantity: 1,
      unit_price: toBRLFromCents(order.shippingAmount),
      currency_id: 'BRL'
    })
  }

  const preference = await mercadoPagoPreference.create({
    body: {
      items,

      external_reference: order._id.toString(),

      notification_url: `${env.apiUrl}/api/payments/webhook/mercado-pago`,

      back_urls: {
        success: `${env.clientUrl}/checkout/success?order=${order._id}`,
        failure: `${env.clientUrl}/checkout/failure?order=${order._id}`,
        pending: `${env.clientUrl}/checkout/pending?order=${order._id}`
      },

      auto_return: 'approved',

      metadata: {
        orderId: order._id.toString(),
        code: order.code
      }
    }
  })

  const payment = await Payment.findOneAndUpdate(
    {
      orderId: order._id,
      provider: 'MERCADO_PAGO'
    },
    {
      orderId: order._id,
      customerId: order.customerId,
      provider: 'MERCADO_PAGO',
      providerPreferenceId: preference.id,
      status: 'CREATED',
      amount: order.total,
      checkoutUrl: preference.init_point,
      sandboxCheckoutUrl: preference.sandbox_init_point,
      raw: preference
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )

  return new PaymentDTO(payment)
}

async function findMine(customerId) {
  const payments = await Payment.find({ customerId })
    .sort({ createdAt: -1 })

  return payments.map(payment => new PaymentDTO(payment))
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.orderId) {
    query.orderId = filters.orderId
  }

  const payments = await Payment.find(query)
    .populate('orderId', 'code status total')
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })

  return payments.map(payment => new PaymentDTO(payment))
}

async function processMercadoPagoPayment(providerPaymentId) {
  ensureMercadoPagoConfigured()

  const mpPayment = await mercadoPagoPayment.get({
    id: providerPaymentId
  })

  const orderId =
    mpPayment.external_reference ||
    mpPayment.metadata?.orderId ||
    mpPayment.metadata?.order_id

  if (!orderId) {
    throw new AppError('Pagamento sem referência do pedido', 400)
  }

  const order = await Order.findById(orderId)

  if (!order) {
    throw new AppError('Pedido do pagamento não encontrado', 404)
  }

  const mappedStatus = mapMercadoPagoStatus(mpPayment.status)

  const payment = await Payment.findOneAndUpdate(
    {
      orderId: order._id,
      provider: 'MERCADO_PAGO'
    },
    {
      orderId: order._id,
      customerId: order.customerId,
      provider: 'MERCADO_PAGO',
      providerPaymentId: String(mpPayment.id),
      status: mappedStatus,
      amount: order.total,
      raw: mpPayment
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )

  if (mappedStatus === 'APPROVED' && order.status === 'PENDING_PAYMENT') {
    await orderService.markAsPaid(order._id, {
      provider: 'MERCADO_PAGO',
      method: mpPayment.payment_method_id,
      externalId: String(mpPayment.id)
    })
  }

  if (mappedStatus === 'REJECTED' && order.status === 'PENDING_PAYMENT') {
    order.payment = {
      provider: 'MERCADO_PAGO',
      method: mpPayment.payment_method_id,
      externalId: String(mpPayment.id)
    }

    await order.save()
  }

  return new PaymentDTO(payment)
}

async function handleMercadoPagoWebhook(body, query = {}) {
  const type = body.type || query.type
  const action = body.action || query.action

  const paymentId =
    body.data?.id ||
    body.id ||
    query['data.id'] ||
    query.id

  if (type !== 'payment' && action && !action.startsWith('payment')) {
    return {
      received: true,
      ignored: true
    }
  }

  if (!paymentId) {
    return {
      received: true,
      ignored: true
    }
  }

  const payment = await processMercadoPagoPayment(paymentId)

  return {
    received: true,
    payment
  }
}

export const paymentService = {
  createCheckout,
  findMine,
  findAll,
  processMercadoPagoPayment,
  handleMercadoPagoWebhook
}
