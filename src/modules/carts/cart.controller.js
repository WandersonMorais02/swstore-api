import { cartService } from './cart.service.js'
import {
  addCartItemSchema,
  updateCartItemSchema
} from './cart.schema.js'

async function mine(req, res) {
  const cart = await cartService.getMine(req.user.id)

  return res.json(cart)
}

async function addItem(req, res) {
  const data = addCartItemSchema.parse(req.body)

  const cart = await cartService.addItem(req.user.id, data)

  return res.status(201).json(cart)
}

async function updateItem(req, res) {
  const data = updateCartItemSchema.parse(req.body)

  const cart = await cartService.updateItem(req.user.id, req.params.itemId, data)

  return res.json(cart)
}

async function removeItem(req, res) {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId)

  return res.json(cart)
}

async function clear(req, res) {
  const cart = await cartService.clear(req.user.id)

  return res.json(cart)
}

export const cartController = {
  mine,
  addItem,
  updateItem,
  removeItem,
  clear
}
