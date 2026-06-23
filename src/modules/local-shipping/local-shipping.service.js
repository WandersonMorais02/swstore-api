import { LocalShippingZone } from './local-shipping-zone.model.js'
import { LocalShippingPrice } from './local-shipping-price.model.js'
import {
  LocalShippingZoneDTO,
  LocalShippingPriceDTO
} from './local-shipping.dto.js'

import { Cart } from '../carts/cart.model.js'
import { SellerShipping } from '../seller-shipping/seller-shipping.model.js'
import { AppError } from '../../shared/errors/AppError.js'

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

function isShippable(product) {
  return ['PHYSICAL', 'HYBRID'].includes(product.type)
}

function sameId(a, b) {
  return String(a) === String(b)
}

async function createZone(data) {
  const zone = await LocalShippingZone.create({
    ...data,
    state: data.state.toUpperCase(),
    zipcode: onlyNumbers(data.zipcode)
  })

  return new LocalShippingZoneDTO(zone)
}

async function findZones(filters = {}) {
  const query = {}

  if (filters.city) {
    query.city = new RegExp(filters.city, 'i')
  }

  if (filters.state) {
    query.state = String(filters.state).toUpperCase()
  }

  if (filters.zipcode) {
    query.zipcode = onlyNumbers(filters.zipcode)
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true'
  }

  const zones = await LocalShippingZone.find(query)
    .sort({ city: 1, name: 1 })

  return zones.map(zone => new LocalShippingZoneDTO(zone))
}

async function updateZone(id, data) {
  const zone = await LocalShippingZone.findById(id)

  if (!zone) {
    throw new AppError('Zona/bairro de frete local não encontrado', 404)
  }

  if (data.state) {
    data.state = data.state.toUpperCase()
  }

  if (data.zipcode) {
    data.zipcode = onlyNumbers(data.zipcode)
  }

  Object.assign(zone, data)

  await zone.save()

  return new LocalShippingZoneDTO(zone)
}

async function removeZone(id) {
  const zone = await LocalShippingZone.findById(id)

  if (!zone) {
    throw new AppError('Zona/bairro de frete local não encontrado', 404)
  }

  const hasPrices = await LocalShippingPrice.exists({
    $or: [
      { originZoneId: id },
      { destinationZoneId: id }
    ]
  })

  if (hasPrices) {
    throw new AppError(
      'Não é possível remover essa zona porque existem preços vinculados',
      400
    )
  }

  await zone.deleteOne()

  return {
    message: 'Zona/bairro removido com sucesso'
  }
}

async function createPrice(data) {
  const origin = await LocalShippingZone.findById(data.originZoneId)
  const destination = await LocalShippingZone.findById(data.destinationZoneId)

  if (!origin || !destination) {
    throw new AppError('Zona de origem ou destino inválida', 400)
  }

  if (
    origin.city !== destination.city ||
    origin.state !== destination.state ||
    origin.zipcode !== destination.zipcode
  ) {
    throw new AppError('Origem e destino precisam pertencer à mesma cidade', 400)
  }

  const price = await LocalShippingPrice.create({
    ...data,
    city: origin.city,
    state: origin.state,
    zipcode: origin.zipcode
  })

  return new LocalShippingPriceDTO(price)
}

async function findPrices(filters = {}) {
  const query = {}

  if (filters.city) {
    query.city = new RegExp(filters.city, 'i')
  }

  if (filters.state) {
    query.state = String(filters.state).toUpperCase()
  }

  if (filters.zipcode) {
    query.zipcode = onlyNumbers(filters.zipcode)
  }

  if (filters.originZoneId) {
    query.originZoneId = filters.originZoneId
  }

  if (filters.destinationZoneId) {
    query.destinationZoneId = filters.destinationZoneId
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true'
  }

  const prices = await LocalShippingPrice.find(query)
    .populate('originZoneId', 'name city state zipcode')
    .populate('destinationZoneId', 'name city state zipcode')
    .sort({ createdAt: -1 })

  return prices.map(price => new LocalShippingPriceDTO(price))
}

async function updatePrice(id, data) {
  const price = await LocalShippingPrice.findById(id)

  if (!price) {
    throw new AppError('Preço de frete local não encontrado', 404)
  }

  if (data.originZoneId || data.destinationZoneId) {
    const origin = await LocalShippingZone.findById(
      data.originZoneId || price.originZoneId
    )

    const destination = await LocalShippingZone.findById(
      data.destinationZoneId || price.destinationZoneId
    )

    if (!origin || !destination) {
      throw new AppError('Zona de origem ou destino inválida', 400)
    }

    if (
      origin.city !== destination.city ||
      origin.state !== destination.state ||
      origin.zipcode !== destination.zipcode
    ) {
      throw new AppError('Origem e destino precisam pertencer à mesma cidade', 400)
    }

    price.city = origin.city
    price.state = origin.state
    price.zipcode = origin.zipcode
  }

  Object.assign(price, data)

  await price.save()

  return new LocalShippingPriceDTO(price)
}

async function removePrice(id) {
  const price = await LocalShippingPrice.findById(id)

  if (!price) {
    throw new AppError('Preço de frete local não encontrado', 404)
  }

  await price.deleteOne()

  return {
    message: 'Preço de frete local removido com sucesso'
  }
}

async function findPriceBetweenZones(originZoneId, destinationZoneId) {
  const prices = await LocalShippingPrice.find({
    isActive: true,
    $or: [
      {
        originZoneId,
        destinationZoneId
      },
      {
        originZoneId: destinationZoneId,
        destinationZoneId: originZoneId,
        isBidirectional: true
      }
    ]
  })
    .populate('originZoneId', 'name city state zipcode')
    .populate('destinationZoneId', 'name city state zipcode')

  return prices[0] || null
}

async function findSellerOriginZone(sellerShipping) {
  const zone = await LocalShippingZone.findOne({
    city: new RegExp(`^${sellerShipping.originAddress.city}$`, 'i'),
    state: sellerShipping.originAddress.state.toUpperCase(),
    zipcode: onlyNumbers(sellerShipping.originAddress.zipcode),
    name: new RegExp(`^${sellerShipping.originAddress.district}$`, 'i'),
    isActive: true
  })

  if (!zone) {
    throw new AppError(
      `Bairro de origem "${sellerShipping.originAddress.district}" não cadastrado no frete local`,
      400
    )
  }

  return zone
}

function groupItemsBySeller(items) {
  const groups = new Map()

  for (const item of items) {
    const sellerId = item.productId.sellerId.toString()

    if (!groups.has(sellerId)) {
      groups.set(sellerId, [])
    }

    groups.get(sellerId).push(item)
  }

  return groups
}

async function quoteMine(customerId, data) {
  const destinationZone = await LocalShippingZone.findById(data.destinationZoneId)

  if (!destinationZone || !destinationZone.isActive) {
    throw new AppError('Zona/bairro de destino inválido', 400)
  }

  if (
    destinationZone.city.toLowerCase() !== data.city.toLowerCase() ||
    destinationZone.state !== data.state.toUpperCase() ||
    destinationZone.zipcode !== onlyNumbers(data.zipcode)
  ) {
    throw new AppError('Zona/bairro de destino não pertence à cidade informada', 400)
  }

  const cart = await Cart.findOne({ customerId })
    .populate('items.productId')

  if (!cart || cart.items.length === 0) {
    throw new AppError('Carrinho vazio', 400)
  }

  const shippableItems = cart.items.filter(item => {
    return item.productId && isShippable(item.productId)
  })

  if (shippableItems.length === 0) {
    return {
      requiresShipping: false,
      quotesBySeller: []
    }
  }

  const groups = groupItemsBySeller(shippableItems)
  const quotesBySeller = []

  for (const [sellerId, items] of groups.entries()) {
    const sellerShipping = await SellerShipping.findOne({
      sellerId,
      isActive: true
    }).populate('sellerId', 'name email sellerProfile')

    if (!sellerShipping) {
      throw new AppError('Um dos vendedores não cadastrou endereço de envio', 400)
    }

    const originZone = await findSellerOriginZone(sellerShipping)

    const price = await findPriceBetweenZones(
      originZone._id,
      destinationZone._id
    )

    if (!price) {
      throw new AppError(
        `Não existe frete local cadastrado entre ${originZone.name} e ${destinationZone.name}`,
        400
      )
    }

    quotesBySeller.push({
      sellerId,
      seller: sellerShipping.sellerId,
      provider: 'LOCAL',
      originZone: {
        id: originZone._id,
        name: originZone.name
      },
      destinationZone: {
        id: destinationZone._id,
        name: destinationZone.name
      },
      items: items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity
      })),
      quotes: [
        {
          id: price._id.toString(),
          provider: 'LOCAL',
          name: 'Entrega local',
          company: {
            name: 'Entrega local'
          },
          price: price.price,
          deliveryTime: price.deliveryTime,
          raw: {
            priceId: price._id,
            originZoneId: originZone._id,
            destinationZoneId: destinationZone._id
          }
        }
      ]
    })
  }

  return {
    requiresShipping: true,
    quotesBySeller
  }
}

export const localShippingService = {
  createZone,
  findZones,
  updateZone,
  removeZone,

  createPrice,
  findPrices,
  updatePrice,
  removePrice,

  findPriceBetweenZones,
  quoteMine
}
