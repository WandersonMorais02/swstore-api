export class OrderDTO {
  constructor(order) {
    this.id = order._id
    this.code = order.code
    this.customerId = order.customerId
    this.items = order.items
    this.subtotal = order.subtotal
    this.shippingGroups = order.shippingGroups
    this.shippingAmount = order.shippingAmount
    this.total = order.total
    this.platformFeeTotal = order.platformFeeTotal
    this.sellersNetTotal = order.sellersNetTotal
    this.status = order.status
    this.payment = order.payment
    this.shippingAddress = order.shippingAddress
    this.createdAt = order.createdAt
    this.updatedAt = order.updatedAt
  }
}
