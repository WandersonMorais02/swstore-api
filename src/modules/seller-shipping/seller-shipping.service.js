import { SellerShipping } from './seller-shipping.model.js'
import { SellerShippingDTO } from './seller-shipping.dto.js'
import { User } from '../users/user.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function getMine(sellerId) {
  const sellerShipping = await SellerShipping.findOne({ sellerId })

  if (!sellerShipping) {
    return null
  }

  return new SellerShippingDTO(sellerShipping)
}

async function upsertMine(sellerId, data) {
  const seller = await User.findById(sellerId)

  if (!seller || seller.role !== 'SELLER') {
    throw new AppError('Vendedor inválido', 400)
  }

  const sellerShipping = await SellerShipping.findOneAndUpdate(
    { sellerId },
    {
      sellerId,
      ...data
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )

  return new SellerShippingDTO(sellerShipping)
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.sellerId) {
    query.sellerId = filters.sellerId
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true'
  }

  const sellerShippings = await SellerShipping.find(query)
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return sellerShippings.map(item => new SellerShippingDTO(item))
}

async function findBySellerId(sellerId) {
  const sellerShipping = await SellerShipping.findOne({
    sellerId,
    isActive: true
  })

  if (!sellerShipping) {
    throw new AppError('Seller não cadastrou endereço de envio', 400)
  }

  return sellerShipping
}

async function updateStatus(id, isActive) {
  const sellerShipping = await SellerShipping.findById(id)

  if (!sellerShipping) {
    throw new AppError('Configuração de envio não encontrada', 404)
  }

  sellerShipping.isActive = isActive

  await sellerShipping.save()

  return new SellerShippingDTO(sellerShipping)
}

export const sellerShippingService = {
  getMine,
  upsertMine,
  findAll,
  findBySellerId,
  updateStatus
}
