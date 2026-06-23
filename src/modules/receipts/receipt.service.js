import { Receipt } from './receipt.model.js'
import { ReceiptDTO } from './receipt.dto.js'
import { Order } from '../orders/order.model.js'
import { AppError } from '../../shared/errors/AppError.js'
import { generateHash } from '../../shared/utils/generateHash.js'
import { generateCode } from '../../shared/utils/generateCode.js'
import { receiptPdfService } from './receipt-pdf.service.js'

async function createUniqueHash(prefix) {
  let hash
  let exists = true

  while (exists) {
    hash = generateHash(prefix)
    exists = await Receipt.findOne({
      $or: [
        { privateHash: hash },
        { publicHash: hash }
      ]
    })
  }

  return hash
}

async function createFromOrder(orderId) {
  const order = await Order.findById(orderId)

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  if (order.status !== 'PAID') {
    throw new AppError('Recibo só pode ser gerado para pedido pago', 400)
  }

  const existing = await Receipt.findOne({ orderId })

  if (existing) {
    return new ReceiptDTO(existing)
  }

  const receipt = await Receipt.create({
    orderId: order._id,
    customerId: order.customerId,
    privateHash: await createUniqueHash('rpriv'),
    publicHash: await createUniqueHash('rpub'),
    privateNumber: generateCode('RCP'),
    publicNumber: generateCode('PUB'),
    type: 'ORDER_RECEIPT',
    isActive: true
  })

  return new ReceiptDTO(receipt)
}

async function findPrivateByOrder(orderId, currentUser) {
  const receipt = await Receipt.findOne({
    orderId,
    isActive: true
  })

  if (!receipt) {
    throw new AppError('Recibo não encontrado', 404)
  }

  const order = await Order.findById(orderId)
    .populate('customerId', 'name email')
    .populate('items.sellerId', 'name email sellerProfile')
    .populate('shippingGroups.sellerId', 'name email sellerProfile')

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  const isCustomer = order.customerId._id.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'
  const isSeller = order.items.some(item => {
    const sellerId = item.sellerId._id
      ? item.sellerId._id.toString()
      : item.sellerId.toString()

    return sellerId === currentUser.id
  })

  if (!isCustomer && !isAdmin && !isSeller) {
    throw new AppError('Você não pode acessar esse recibo', 403)
  }

  return {
    receipt,
    order
  }
}

async function findPublicByHash(hash) {
  const receipt = await Receipt.findOne({
    publicHash: hash,
    isActive: true
  })

  if (!receipt) {
    throw new AppError('Recibo público não encontrado', 404)
  }

  const order = await Order.findById(receipt.orderId)

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  return {
    receipt,
    order
  }
}

async function generatePrivatePdf(orderId, currentUser) {
  const data = await findPrivateByOrder(orderId, currentUser)

  return receiptPdfService.generatePrivatePdf(data)
}

async function generatePublicPdf(hash) {
  const data = await findPublicByHash(hash)

  return receiptPdfService.generatePublicPdf(data)
}

export const receiptService = {
  createFromOrder,
  findPrivateByOrder,
  findPublicByHash,
  generatePrivatePdf,
  generatePublicPdf
}
