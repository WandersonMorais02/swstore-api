export class PaymentDTO {
  constructor(payment) {
    this.id = payment._id
    this.orderId = payment.orderId
    this.customerId = payment.customerId
    this.provider = payment.provider
    this.providerPaymentId = payment.providerPaymentId
    this.providerPreferenceId = payment.providerPreferenceId
    this.status = payment.status
    this.amount = payment.amount
    this.checkoutUrl = payment.checkoutUrl
    this.sandboxCheckoutUrl = payment.sandboxCheckoutUrl
    this.createdAt = payment.createdAt
    this.updatedAt = payment.updatedAt
  }
}
