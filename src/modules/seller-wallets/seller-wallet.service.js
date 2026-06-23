import { SellerWallet } from './seller-wallet.model.js'
import { SellerWalletDTO } from './seller-wallet.dto.js'
import { User } from '../users/user.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function getMine(sellerId) {
  const wallet = await SellerWallet.findOne({ sellerId })

  if (!wallet) {
    return null
  }

  return new SellerWalletDTO(wallet)
}

async function upsertMine(sellerId, data) {
  const seller = await User.findById(sellerId)

  if (!seller || seller.role !== 'SELLER') {
    throw new AppError('Vendedor inválido', 400)
  }

  const wallet = await SellerWallet.findOneAndUpdate(
    { sellerId },
    {
      sellerId,
      ...data,
      isVerified: false
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )

  return new SellerWalletDTO(wallet)
}

async function findAll() {
  const wallets = await SellerWallet.find()
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return wallets.map(wallet => new SellerWalletDTO(wallet))
}

async function verify(walletId) {
  const wallet = await SellerWallet.findById(walletId)

  if (!wallet) {
    throw new AppError('Carteira não encontrada', 404)
  }

  wallet.isVerified = true

  await wallet.save()

  return new SellerWalletDTO(wallet)
}

export const sellerWalletService = {
  getMine,
  upsertMine,
  findAll,
  verify
}
