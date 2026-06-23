export class FavoriteDTO {
  constructor(favorite) {
    this.id = favorite._id
    this.customerId = favorite.customerId
    this.productId = favorite.productId
    this.createdAt = favorite.createdAt
    this.updatedAt = favorite.updatedAt
  }
}
