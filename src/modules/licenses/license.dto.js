export class LicenseDTO {
  constructor(license) {
    this.id = license._id
    this.customerId = license.customerId
    this.orderId = license.orderId
    this.productId = license.productId
    this.downloadHash = license.downloadHash
    this.planId = license.planId
    this.planName = license.planName
    this.downloadLimit = license.downloadLimit
    this.downloadsUsed = license.downloadsUsed
    this.downloadsRemaining = license.isPermanent
      ? null
      : Math.max(0, (license.downloadLimit || 0) - license.downloadsUsed)
    this.isPermanent = license.isPermanent
    this.expiresAt = license.expiresAt
    this.isActive = license.isActive
    this.createdAt = license.createdAt
    this.updatedAt = license.updatedAt
  }
}
