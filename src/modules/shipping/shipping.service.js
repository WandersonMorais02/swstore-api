import { Cart } from '../carts/cart.model.js'
import { SellerShipping } from '../seller-shipping/seller-shipping.model.js'
import { melhorEnvioRequest } from './melhor-envio.client.js'
import { AppError } from '../../shared/errors/AppError.js'

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

function centsToBRL(value) {
  return Number((value / 100).toFixed(2))
}

function gramsToKg(value) {
  return Number((value / 1000).toFixed(3))
}

function isShippable(product) {
  return ['PHYSICAL', 'HYBRID'].includes(product.type)
}

function buildProductPayload(cartItem) {
  const product = cartItem.productId
  const quantity = cartItem.quantity

  return {
    id: product._id.toString(),
    width: product.dimensions.width,
    height: product.dimensions.height,
    length: product.dimensions.length,
    weight: gramsToKg(product.dimensions.weight),
    insurance_value: centsToBRL(product.promotionalPrice ?? product.price),
    quantity
  }
}

function groupItemsBySeller(cartItems) {
  const groups = new Map()

  for (const item of cartItems) {
    const product = item.productId

    if (!isShippable(product)) {
      continue
    }

    const sellerId = product.sellerId.toString()

    if (!groups.has(sellerId)) {
      groups.set(sellerId, [])
    }

    groups.get(sellerId).push(item)
  }

  return groups
}

async function quoteMine(customerId, data) {
  const destinationZipcode = onlyNumbers(data.zipcode)

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

    const products = items.map(buildProductPayload)

    const payload = {
      from: {
        postal_code: onlyNumbers(sellerShipping.originAddress.zipcode)
      },
      to: {
        postal_code: destinationZipcode
      },
      products,
      options: {
        receipt: false,
        own_hand: false,
        collect: false
      }
    }

    const quotes = await melhorEnvioRequest('/api/v2/me/shipment/calculate', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const validQuotes = Array.isArray(quotes)
      ? quotes.filter(quote => !quote.error)
      : []

    quotesBySeller.push({
      sellerId,
      seller: sellerShipping.sellerId,
      originZipcode: onlyNumbers(sellerShipping.originAddress.zipcode),
      destinationZipcode,
      products,
      quotes: validQuotes.map(quote => ({
        id: quote.id,
        name: quote.name,
        company: quote.company,
        price: Math.round(Number(quote.custom_price || quote.price) * 100),
        deliveryTime: Number(quote.custom_delivery_time || quote.delivery_time),
        raw: quote
      }))
    })
  }

  return {
    requiresShipping: true,
    quotesBySeller
  }
}

export const shippingService = {
  quoteMine
}
