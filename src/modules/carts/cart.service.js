import { Cart } from './cart.model.js'
import { CartDTO } from './cart.dto.js'
import { Product } from '../products/product.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function getOrCreate(customerId) {
  let cart = await Cart.findOne({ customerId }).populate('items.productId')

  if (!cart) {
    cart = await Cart.create({
      customerId,
      items: []
    })
  }

  return cart
}

async function getMine(customerId) {
  const cart = await getOrCreate(customerId)

  await cart.populate('items.productId')

  return new CartDTO(cart)
}

async function addItem(customerId, data) {
  const product = await Product.findById(data.productId)

  if (!product || !product.isActive || product.status !== 'APPROVED') {
    throw new AppError('Produto indisponível', 400)
  }

  if (['DIGITAL', 'HYBRID'].includes(product.type)) {
    if (!data.planId) {
      throw new AppError('Selecione um plano de download', 400)
    }

    const planExists = product.downloadPlans.id(data.planId)

    if (!planExists) {
      throw new AppError('Plano de download inválido', 400)
    }
  }

  if (['PHYSICAL', 'HYBRID'].includes(product.type)) {
    if (product.stock < data.quantity) {
      throw new AppError('Estoque insuficiente', 400)
    }
  }

  const cart = await getOrCreate(customerId)

  const existingItem = cart.items.find(item => {
    return (
      item.productId.toString() === data.productId &&
      String(item.planId || '') === String(data.planId || '')
    )
  })

  if (existingItem) {
    existingItem.quantity += data.quantity
  } else {
    cart.items.push({
      productId: data.productId,
      planId: data.planId || null,
      quantity: data.quantity
    })
  }

  await cart.save()
  await cart.populate('items.productId')

  return new CartDTO(cart)
}

async function updateItem(customerId, itemId, data) {
  const cart = await getOrCreate(customerId)

  const item = cart.items.id(itemId)

  if (!item) {
    throw new AppError('Item não encontrado no carrinho', 404)
  }

  const product = await Product.findById(item.productId)

  if (['PHYSICAL', 'HYBRID'].includes(product.type) && product.stock < data.quantity) {
    throw new AppError('Estoque insuficiente', 400)
  }

  item.quantity = data.quantity

  await cart.save()
  await cart.populate('items.productId')

  return new CartDTO(cart)
}

async function removeItem(customerId, itemId) {
  const cart = await getOrCreate(customerId)

  const item = cart.items.id(itemId)

  if (!item) {
    throw new AppError('Item não encontrado no carrinho', 404)
  }

  item.deleteOne()

  await cart.save()
  await cart.populate('items.productId')

  return new CartDTO(cart)
}

async function clear(customerId) {
  const cart = await getOrCreate(customerId)

  cart.items = []

  await cart.save()

  return new CartDTO(cart)
}

export const cartService = {
  getMine,
  addItem,
  updateItem,
  removeItem,
  clear
}
