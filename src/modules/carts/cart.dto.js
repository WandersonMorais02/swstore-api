export class CartDTO {
  constructor(cart) {
    this.id = cart._id
    this.customerId = cart.customerId
    this.items = cart.items
    this.createdAt = cart.createdAt
    this.updatedAt = cart.updatedAt
  }
}
