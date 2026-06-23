export class ShareLinkDTO {
  constructor(link) {
    this.id = link._id
    this.customerId = link.customerId
    this.licenseId = link.licenseId
    this.productId = link.productId
    this.token = link.token
    this.url = `/api/share-links/public/${link.token}`
    this.expiresAt = link.expiresAt
    this.accessLimit = link.accessLimit
    this.accessUsed = link.accessUsed
    this.allowDownload = link.allowDownload
    this.downloadConsumesLicense = link.downloadConsumesLicense
    this.isActive = link.isActive
    this.createdAt = link.createdAt
    this.updatedAt = link.updatedAt
  }
}
