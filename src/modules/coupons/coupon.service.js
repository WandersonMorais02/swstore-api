import { Coupon } from './coupon.model.js'
import { CouponDTO } from './coupon.dto.js'
import { User } from '../users/user.model.js'
import { AppError } from '../../shared/errors/AppError.js'

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase()
}

function isExpired(coupon) {
  const now = new Date()

  if (coupon.startsAt && coupon.startsAt > now) {
    return true
  }

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return true
  }

  return false
}

function hasUsageLimitReached(coupon) {
  if (!coupon.usageLimit) {
    return false
  }

  return coupon.usedCount >= coupon.usageLimit
}

async function validateSellerCouponData(data) {
  if (data.scope === 'SELLER') {
    if (!data.sellerId) {
      throw new AppError('Cupom de seller precisa informar sellerId', 400)
    }

    const seller = await User.findById(data.sellerId)

    if (!seller || seller.role !== 'SELLER') {
      throw new AppError('Seller inválido para cupom', 400)
    }
  }
}

async function create(data) {
  await validateSellerCouponData(data)

  const code = normalizeCode(data.code)

  const exists = await Coupon.findOne({ code })

  if (exists) {
    throw new AppError('Cupom já cadastrado', 409)
  }

  const coupon = await Coupon.create({
    ...data,
    code,
    sellerId: data.scope === 'SELLER' ? data.sellerId : null
  })

  return new CouponDTO(coupon)
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.code) {
    query.code = normalizeCode(filters.code)
  }

  if (filters.scope) {
    query.scope = filters.scope
  }

  if (filters.sellerId) {
    query.sellerId = filters.sellerId
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true'
  }

  const coupons = await Coupon.find(query)
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return coupons.map(coupon => new CouponDTO(coupon))
}

async function findById(id) {
  const coupon = await Coupon.findById(id)
    .populate('sellerId', 'name email sellerProfile')

  if (!coupon) {
    throw new AppError('Cupom não encontrado', 404)
  }

  return new CouponDTO(coupon)
}

async function update(id, data) {
  const coupon = await Coupon.findById(id)

  if (!coupon) {
    throw new AppError('Cupom não encontrado', 404)
  }

  if (data.scope || data.sellerId) {
    await validateSellerCouponData({
      scope: data.scope || coupon.scope,
      sellerId: data.sellerId ?? coupon.sellerId
    })
  }

  if (data.code) {
    const code = normalizeCode(data.code)

    const exists = await Coupon.findOne({
      code,
      _id: { $ne: id }
    })

    if (exists) {
      throw new AppError('Cupom já cadastrado', 409)
    }

    coupon.code = code
  }

  Object.assign(coupon, {
    ...data,
    sellerId: (data.scope || coupon.scope) === 'SELLER'
      ? data.sellerId ?? coupon.sellerId
      : null
  })

  await coupon.save()

  return new CouponDTO(coupon)
}

async function remove(id) {
  const coupon = await Coupon.findById(id)

  if (!coupon) {
    throw new AppError('Cupom não encontrado', 404)
  }

  await coupon.deleteOne()

  return {
    message: 'Cupom removido com sucesso'
  }
}

function calculateDiscount(coupon, subtotal, orderItems = []) {
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    throw new AppError('Pedido não atingiu o valor mínimo para esse cupom', 400)
  }

  let eligibleSubtotal = subtotal

  if (coupon.scope === 'SELLER') {
    eligibleSubtotal = orderItems
      .filter(item => item.sellerId.toString() === coupon.sellerId.toString())
      .reduce((sum, item) => sum + item.total, 0)

    if (eligibleSubtotal <= 0) {
      throw new AppError('Cupom não se aplica aos produtos do carrinho', 400)
    }
  }

  let discount = 0

  if (coupon.type === 'PERCENTAGE') {
    discount = Math.round(eligibleSubtotal * (coupon.value / 100))
  }

  if (coupon.type === 'FIXED') {
    discount = coupon.value
  }

  if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
    discount = Math.min(discount, coupon.maxDiscountAmount)
  }

  discount = Math.min(discount, eligibleSubtotal)

  return discount
}

async function validateAndCalculate(code, subtotal, orderItems = []) {
  const coupon = await Coupon.findOne({
    code: normalizeCode(code),
    isActive: true
  })

  if (!coupon) {
    throw new AppError('Cupom inválido', 404)
  }

  if (isExpired(coupon)) {
    throw new AppError('Cupom expirado ou ainda não iniciado', 400)
  }

  if (hasUsageLimitReached(coupon)) {
    throw new AppError('Limite de uso do cupom atingido', 400)
  }

  const discountAmount = calculateDiscount(coupon, subtotal, orderItems)

  return {
    coupon,
    discountAmount
  }
}

async function incrementUsage(couponId) {
  await Coupon.findByIdAndUpdate(couponId, {
    $inc: {
      usedCount: 1
    }
  })
}

export const couponService = {
  create,
  findAll,
  findById,
  update,
  remove,
  validateAndCalculate,
  incrementUsage
}
