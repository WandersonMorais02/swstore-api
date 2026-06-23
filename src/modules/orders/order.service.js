import { Cart } from '../carts/cart.model.js'
import { Product } from '../products/product.model.js'
import { Order } from './order.model.js'
import { OrderDTO } from './order.dto.js'
import { User } from '../users/user.model.js'
import { License } from '../licenses/license.model.js'
import { Address } from '../addresses/address.model.js'
import { settingService } from '../settings/setting.service.js'
import { couponService } from '../coupons/coupon.service.js'

import { AppError } from '../../shared/errors/AppError.js'
import { generateCode } from '../../shared/utils/generateCode.js'
import { generateHash } from '../../shared/utils/generateHash.js'
import { notificationService } from '../notifications/notification.service.js'
import { receiptService } from '../receipts/receipt.service.js'


function getProductPrice(product, planId) {
  if (['DIGITAL', 'HYBRID'].includes(product.type)) {
    const plan = product.downloadPlans.id(planId)

    if (!plan) {
      throw new AppError(`Plano inválido para o produto ${product.name}`, 400)
    }

    return { unitPrice: plan.price, plan }
  }

  return {
    unitPrice: product.promotionalPrice ?? product.price,
    plan: null
  }
}

function requiresShipping(items) {
  return items.some(item => ['PHYSICAL', 'HYBRID'].includes(item.productType))
}

function getShippableSellerIds(items) {
  return Array.from(new Set(
    items
      .filter(item => ['PHYSICAL', 'HYBRID'].includes(item.productType))
      .map(item => item.sellerId.toString())
  ))
}

function validateShippingAddress(address) {
  if (!address) {
    throw new AppError('Endereço de entrega é obrigatório para produto físico', 400)
  }

  const requiredFields = [
    'recipientName',
    'zipcode',
    'street',
    'number',
    'district',
    'city',
    'state'
  ]

  for (const field of requiredFields) {
    if (!address[field]) {
      throw new AppError(`Campo de endereço obrigatório: ${field}`, 400)
    }
  }
}

function makeShippingAddressSnapshot(address) {
  return {
    recipientName: address.recipientName,
    zipcode: address.zipcode,
    street: address.street,
    number: address.number,
    complement: address.complement,
    district: address.district,
    city: address.city,
    state: address.state
  }
}

async function resolveShippingAddress(customerId, data = {}) {
  if (data.addressId) {
    const address = await Address.findOne({
      _id: data.addressId,
      customerId,
      isActive: true
    })

    if (!address) {
      throw new AppError('Endereço selecionado não encontrado', 404)
    }

    return makeShippingAddressSnapshot(address)
  }

  if (data.shippingAddress) {
    return makeShippingAddressSnapshot(data.shippingAddress)
  }

  return null
}

function normalizeShippingGroups(shippingGroups = []) {
  return shippingGroups.map(group => ({
    sellerId: group.sellerId,
    provider: group.provider,
    quoteId: group.quoteId,
    serviceName: group.serviceName,
    amount: group.amount || 0,
    deliveryTime: group.deliveryTime,
    status: 'PENDING'
  }))
}

function validateShippingGroups(orderItems, shippingGroups = []) {
  const shippableSellerIds = getShippableSellerIds(orderItems)

  if (shippableSellerIds.length === 0) {
    return []
  }

  if (!shippingGroups || shippingGroups.length === 0) {
    throw new AppError('Frete é obrigatório para produto físico', 400)
  }

  const normalizedGroups = normalizeShippingGroups(shippingGroups)

  for (const sellerId of shippableSellerIds) {
    const group = normalizedGroups.find(item => {
      return item.sellerId.toString() === sellerId
    })

    if (!group) {
      throw new AppError(`Frete não informado para o vendedor ${sellerId}`, 400)
    }
  }

  for (const group of normalizedGroups) {
    const belongsToShippableSeller = shippableSellerIds.includes(
      group.sellerId.toString()
    )

    if (!belongsToShippableSeller) {
      throw new AppError('Frete informado para vendedor sem produto físico no pedido', 400)
    }

    if (group.provider !== 'PICKUP' && group.amount <= 0) {
      throw new AppError('Valor do frete precisa ser maior que zero', 400)
    }

    if (group.provider === 'PICKUP') {
      group.amount = 0
    }
  }

  return normalizedGroups
}

function sumShippingAmount(shippingGroups = []) {
  return shippingGroups.reduce((total, group) => {
    return total + (group.amount || 0)
  }, 0)
}

function recalculateSellerFeesWithDiscount(orderItems, discountAmount) {
  if (!discountAmount || discountAmount <= 0) {
    return orderItems
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)

  return orderItems.map(item => {
    const itemShare = item.total / subtotal
    const itemDiscount = Math.round(discountAmount * itemShare)
    const discountedItemTotal = Math.max(0, item.total - itemDiscount)

    const feePercent = item.sellerFeeSnapshot.feePercent
    const feeAmount = Math.round(discountedItemTotal * (feePercent / 100))
    const sellerNetAmount = discountedItemTotal - feeAmount

    return {
      ...item,
      sellerFeeSnapshot: {
        feePercent,
        feeAmount,
        sellerNetAmount
      }
    }
  })
}

function sumPlatformFee(orderItems) {
  return orderItems.reduce((sum, item) => {
    return sum + (item.sellerFeeSnapshot?.feeAmount || 0)
  }, 0)
}

function sumSellersNet(orderItems) {
  return orderItems.reduce((sum, item) => {
    return sum + (item.sellerFeeSnapshot?.sellerNetAmount || 0)
  }, 0)
}

async function resolveCoupon(data, subtotal, orderItems) {
  if (!data.couponCode) {
    return {
      discountAmount: 0,
      couponSnapshot: undefined,
      coupon: null
    }
  }

  const { coupon, discountAmount } = await couponService.validateAndCalculate(
    data.couponCode,
    subtotal,
    orderItems
  )

  return {
    discountAmount,
    coupon,
    couponSnapshot: {
      couponId: coupon._id.toString(),
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      scope: coupon.scope,
      sellerId: coupon.sellerId ? coupon.sellerId.toString() : null,
      discountAmount
    }
  }
}

async function createUniqueDownloadHash() {
  let downloadHash
  let exists = true

  while (exists) {
    downloadHash = generateHash('dl')
    exists = await License.findOne({ downloadHash })
  }

  return downloadHash
}

async function createLicensesFromPaidOrder(order) {
  const licenses = []

  for (const item of order.items) {
    if (!['DIGITAL', 'HYBRID'].includes(item.productType)) {
      continue
    }

    const existingLicense = await License.findOne({
      customerId: order.customerId,
      orderId: order._id,
      productId: item.productId,
      planId: item.planSnapshot?.planId
    })

    if (existingLicense) {
      licenses.push(existingLicense)
      continue
    }

    const license = await License.create({
      customerId: order.customerId,
      orderId: order._id,
      productId: item.productId,

      downloadHash: await createUniqueDownloadHash(),

      planId: item.planSnapshot?.planId,
      planName: item.planSnapshot?.name,

      downloadLimit: item.planSnapshot?.downloadLimit ?? null,
      downloadsUsed: 0,

      isPermanent: item.planSnapshot?.isPermanent === true,

      isActive: true
    })

    licenses.push(license)
  }

  return licenses
}

async function notifyOrderPaid(order) {
  await notificationService.create({
    userId: order.customerId,
    type: 'DOWNLOAD_AVAILABLE',
    title: 'Pedido aprovado',
    message: `Seu pedido ${order.code} foi aprovado.`,
    data: {
      orderId: order._id,
      code: order.code
    }
  })

  const sellerIds = Array.from(
    new Set(order.items.map(item => item.sellerId.toString()))
  )

  for (const sellerId of sellerIds) {
    const sellerItems = order.items.filter(item => {
      return item.sellerId.toString() === sellerId
    })

    const grossAmount = sellerItems.reduce((sum, item) => {
      return sum + item.total
    }, 0)

    const platformFeeAmount = sellerItems.reduce((sum, item) => {
      return sum + (item.sellerFeeSnapshot?.feeAmount || 0)
    }, 0)

    const netAmount = sellerItems.reduce((sum, item) => {
      return sum + (item.sellerFeeSnapshot?.sellerNetAmount || 0)
    }, 0)

    await notificationService.create({
      userId: sellerId,
      type: 'ORDER_PAID',
      title: 'Nova venda aprovada',
      message: `Você recebeu uma nova venda no pedido ${order.code}.`,
      data: {
        orderId: order._id,
        code: order.code,
        grossAmount,
        platformFeeAmount,
        netAmount
      }
    })
  }
}

async function createFromCart(customerId, data = {}) {
  const cart = await Cart.findOne({ customerId }).populate('items.productId')

  if (!cart || cart.items.length === 0) {
    throw new AppError('Carrinho vazio', 400)
  }

  let orderItems = []
  let subtotal = 0

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.productId._id)

    if (!product || !product.isActive || product.status !== 'APPROVED') {
      throw new AppError('Existe produto indisponível no carrinho', 400)
    }

    if (['PHYSICAL', 'HYBRID'].includes(product.type)) {
      if (product.stock < cartItem.quantity) {
        throw new AppError(`Estoque insuficiente para ${product.name}`, 400)
      }
    }

    const seller = await User.findById(product.sellerId)

    if (!seller) {
      throw new AppError('Vendedor inválido', 400)
    }

    const { unitPrice, plan } = getProductPrice(product, cartItem.planId)
    const total = unitPrice * cartItem.quantity

    const feePercent = await settingService.getPlatformFeePercentForSeller(seller)
    const feeAmount = Math.round(total * (feePercent / 100))
    const sellerNetAmount = total - feeAmount

    subtotal += total

    orderItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      productType: product.type,
      name: product.name,
      quantity: cartItem.quantity,
      unitPrice,
      total,

      planSnapshot: plan
        ? {
            planId: plan._id.toString(),
            name: plan.name,
            price: plan.price,
            downloadLimit: plan.downloadLimit,
            isPermanent: plan.isPermanent
          }
        : undefined,

      productSnapshot: {
        previewImages: product.previewImages,
        dimensions: product.dimensions
      },

      sellerFeeSnapshot: {
        feePercent,
        feeAmount,
        sellerNetAmount
      }
    })
  }

  const { discountAmount, couponSnapshot, coupon } = await resolveCoupon(
    data,
    subtotal,
    orderItems
  )

  orderItems = recalculateSellerFeesWithDiscount(orderItems, discountAmount)

  const platformFeeTotal = sumPlatformFee(orderItems)
  const sellersNetTotal = sumSellersNet(orderItems)

  const hasShipping = requiresShipping(orderItems)

  const shippingAddress = hasShipping
    ? await resolveShippingAddress(customerId, data)
    : null

  if (hasShipping) {
    validateShippingAddress(shippingAddress)
  }

  const shippingGroups = hasShipping
    ? validateShippingGroups(orderItems, data.shippingGroups)
    : []

  const shippingAmount = sumShippingAmount(shippingGroups)
  const total = Math.max(0, subtotal - discountAmount) + shippingAmount

  const order = await Order.create({
    code: generateCode('ORD'),
    customerId,
    items: orderItems,
    subtotal,
    discountAmount,
    couponSnapshot,
    shippingAmount,
    shippingGroups,
    total,
    platformFeeTotal,
    sellersNetTotal,
    shippingAddress: hasShipping ? shippingAddress : undefined
  })

  if (coupon) {
    await couponService.incrementUsage(coupon._id)
  }

  for (const item of orderItems) {
    if (['PHYSICAL', 'HYBRID'].includes(item.productType)) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity
        }
      })
    }
  }

  cart.items = []
  await cart.save()

  return new OrderDTO(order)
}

async function findMine(customerId) {
  const orders = await Order.find({ customerId })
    .sort({ createdAt: -1 })

  return orders.map(order => new OrderDTO(order))
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.status) query.status = filters.status
  if (filters.customerId) query.customerId = filters.customerId

  const orders = await Order.find(query)
    .populate('customerId', 'name email')
    .populate('items.sellerId', 'name email sellerProfile')
    .populate('shippingGroups.sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return orders.map(order => new OrderDTO(order))
}

async function findSellerOrders(sellerId) {
  const orders = await Order.find({
    'items.sellerId': sellerId
  })
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })

  return orders.map(order => {
    const sellerItems = order.items.filter(item => {
      return item.sellerId.toString() === sellerId
    })

    const sellerSubtotal = sellerItems.reduce((total, item) => {
      return total + item.total
    }, 0)

    const sellerFee = sellerItems.reduce((total, item) => {
      return total + (item.sellerFeeSnapshot?.feeAmount || 0)
    }, 0)

    const sellerNet = sellerItems.reduce((total, item) => {
      return total + (item.sellerFeeSnapshot?.sellerNetAmount || 0)
    }, 0)

    return {
      id: order._id,
      code: order.code,

      customer: order.customerId,

      status: order.status,

      items: sellerItems,

      sellerSubtotal,
      sellerFee,
      sellerNet,

      createdAt: order.createdAt
    }
  })
}

async function findById(id, currentUser) {
  const order = await Order.findById(id)
    .populate('customerId', 'name email')
    .populate('items.sellerId', 'name email sellerProfile')
    .populate('shippingGroups.sellerId', 'name email sellerProfile')

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  const customerId = order.customerId._id
    ? order.customerId._id.toString()
    : order.customerId.toString()

  const isCustomer = customerId === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  const isSeller = order.items.some(item => {
    const sellerId = item.sellerId._id
      ? item.sellerId._id.toString()
      : item.sellerId.toString()

    return sellerId === currentUser.id
  })

  if (!isCustomer && !isAdmin && !isSeller) {
    throw new AppError('Você não pode acessar esse pedido', 403)
  }

  return new OrderDTO(order)
}

async function markAsPaid(id, payment = {}) {
  const order = await Order.findById(id)

  if (!order) {
    throw new AppError('Pedido não encontrado', 404)
  }

  if (order.status !== 'PENDING_PAYMENT') {
    throw new AppError('Pedido não está pendente de pagamento', 400)
  }

  order.status = 'PAID'
  order.payment = {
    ...payment,
    paidAt: new Date()
  }

  await order.save()

  await createLicensesFromPaidOrder(order)
  await notifyOrderPaid(order)
  await receiptService.createFromOrder(order._id)

  await notificationService.create({
    userId: order.customerId,
    type: 'DOWNLOAD_AVAILABLE',
    title: 'Download liberado',
    message: `Seu pedido ${order.code} foi aprovado e seus downloads estão disponíveis.`,
    data: {
      orderId: order._id,
      code: order.code
    }
  })

  return new OrderDTO(order)
}

export const orderService = {
  createFromCart,
  findMine,
  findAll,
  findSellerOrders,
  findById,
  markAsPaid
}
