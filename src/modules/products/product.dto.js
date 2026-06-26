function sortImages(images = []) {
  return [...images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1
    if (!a.isMain && b.isMain) return 1
    return (a.order || 0) - (b.order || 0)
  })
}

export class ProductDTO {
  constructor(product) {
    this.id = product._id
    this.sellerId = product.sellerId
    this.categoryId = product.categoryId
    this.type = product.type
    this.name = product.name
    this.slug = product.slug
    this.description = product.description
    this.price = product.price
    this.promotionalPrice = product.promotionalPrice

    this.previewImages = sortImages(product.previewImages || [])

    this.digitalFiles = undefined

    this.downloadPlans = product.downloadPlans
    this.stock = product.stock
    this.dimensions = product.dimensions
    this.status = product.status
    this.rejectionReason = product.rejectionReason
    this.isActive = product.isActive
    this.tags = product.tags
    this.createdAt = product.createdAt
    this.updatedAt = product.updatedAt
  }
}
