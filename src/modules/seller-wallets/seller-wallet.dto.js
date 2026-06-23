export class SellerWalletDTO {
  constructor(wallet) {
    this.id = wallet._id
    this.sellerId = wallet.sellerId
    this.preferredMethod = wallet.preferredMethod
    this.pix = wallet.pix
    this.bankAccount = wallet.bankAccount
    this.isVerified = wallet.isVerified
    this.createdAt = wallet.createdAt
    this.updatedAt = wallet.updatedAt
  }
}
