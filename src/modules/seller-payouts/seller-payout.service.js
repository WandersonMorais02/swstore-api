import { SellerPayout } from './seller-payout.model.js'
import { SellerPayoutDTO } from './seller-payout.dto.js'
import { SellerWallet } from '../seller-wallets/seller-wallet.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function findAll(filters = {}) {
  const query = {}

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.sellerId) {
    query.sellerId = filters.sellerId
  }

  const payouts = await SellerPayout.find(query)
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return payouts.map(payout => new SellerPayoutDTO(payout))
}

async function findMine(sellerId) {
  const payouts = await SellerPayout.find({ sellerId })
    .sort({ createdAt: -1 })

  return payouts.map(payout => new SellerPayoutDTO(payout))
}

async function createManual(data) {
  const wallet = await SellerWallet.findOne({ sellerId: data.sellerId })

  if (!wallet) {
    throw new AppError('Seller ainda não cadastrou dados de recebimento', 400)
  }

  const payout = await SellerPayout.create({
    sellerId: data.sellerId,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    grossAmount: data.grossAmount,
    platformFeeAmount: data.platformFeeAmount,
    netAmount: data.netAmount,
    paymentMethodSnapshot: {
      preferredMethod: wallet.preferredMethod,
      pix: wallet.pix,
      bankAccount: wallet.bankAccount
    }
  })

  return new SellerPayoutDTO(payout)
}

async function markAsPaid(id, adminNotes) {
  const payout = await SellerPayout.findById(id)

  if (!payout) {
    throw new AppError('Repasse não encontrado', 404)
  }

  if (payout.status !== 'PENDING') {
    throw new AppError('Esse repasse não está pendente', 400)
  }

  payout.status = 'PAID'
  payout.paidAt = new Date()
  payout.adminNotes = adminNotes

  await payout.save()

  return new SellerPayoutDTO(payout)
}

async function cancel(id, adminNotes) {
  const payout = await SellerPayout.findById(id)

  if (!payout) {
    throw new AppError('Repasse não encontrado', 404)
  }

  payout.status = 'CANCELED'
  payout.adminNotes = adminNotes

  await payout.save()

  return new SellerPayoutDTO(payout)
}

export const sellerPayoutService = {
  findAll,
  findMine,
  createManual,
  markAsPaid,
  cancel
}
