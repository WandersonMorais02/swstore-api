export class ReviewDTO {
  constructor(review) {
    this.id = review._id
    this.customerId = review.customerId
    this.productId = review.productId
    this.orderId = review.orderId
    this.rating = review.rating
    this.title = review.title
    this.comment = review.comment
    this.isActive = review.isActive
    this.createdAt = review.createdAt
    this.updatedAt = review.updatedAt
  }
}
