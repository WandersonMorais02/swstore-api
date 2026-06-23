export class SellerPayoutDTO {
  constructor(payout) {
    this.id = payout._id
    this.sellerId = payout.sellerId
    this.periodStart = payout.periodStart
    this.periodEnd = payout.periodEnd
    this.grossAmount = payout.grossAmount
    this.platformFeeAmount = payout.platformFeeAmount
    this.netAmount = payout.netAmount
    this.status = payout.status
    this.paymentMethodSnapshot = payout.paymentMethodSnapshot
    this.paidAt = payout.paidAt
    this.adminNotes = payout.adminNotes
    this.createdAt = payout.createdAt
    this.updatedAt = payout.updatedAt
  }
}
