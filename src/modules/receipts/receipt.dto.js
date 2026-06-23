export class ReceiptDTO {
  constructor(receipt) {
    this.id = receipt._id
    this.orderId = receipt.orderId
    this.customerId = receipt.customerId
    this.privateHash = receipt.privateHash
    this.publicHash = receipt.publicHash
    this.privateNumber = receipt.privateNumber
    this.publicNumber = receipt.publicNumber
    this.type = receipt.type
    this.isActive = receipt.isActive
    this.createdAt = receipt.createdAt
    this.updatedAt = receipt.updatedAt
  }
}
