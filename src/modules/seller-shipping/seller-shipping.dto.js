export class SellerShippingDTO {
  constructor(sellerShipping) {
    this.id = sellerShipping._id
    this.pickupName = sellerShipping.pickupName
    this.sellerId = sellerShipping.sellerId
    this.originAddress = sellerShipping.originAddress
    this.sender = sellerShipping.sender
    this.isActive = sellerShipping.isActive
    this.createdAt = sellerShipping.createdAt
    this.updatedAt = sellerShipping.updatedAt
  }
}
