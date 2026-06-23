export class CouponDTO {
  constructor(coupon) {
    this.id = coupon._id
    this.code = coupon.code
    this.description = coupon.description
    this.type = coupon.type
    this.value = coupon.value
    this.scope = coupon.scope
    this.sellerId = coupon.sellerId
    this.minOrderAmount = coupon.minOrderAmount
    this.maxDiscountAmount = coupon.maxDiscountAmount
    this.usageLimit = coupon.usageLimit
    this.usedCount = coupon.usedCount
    this.startsAt = coupon.startsAt
    this.expiresAt = coupon.expiresAt
    this.isActive = coupon.isActive
    this.createdAt = coupon.createdAt
    this.updatedAt = coupon.updatedAt
  }
}
