import { orderService } from './order.service.js'
import { createOrderFromCartSchema } from './order.schema.js'

async function createFromCart(req, res) {
  const data = createOrderFromCartSchema.parse(req.body)

  const order = await orderService.createFromCart(req.user.id, data)

  return res.status(201).json(order)
}

async function mine(req, res) {
  const orders = await orderService.findMine(req.user.id)

  return res.json(orders)
}

async function seller(req, res) {
  const orders = await orderService.findSellerOrders(req.user.id)

  return res.json(orders)
}

async function index(req, res) {
  const orders = await orderService.findAll(req.query)

  return res.json(orders)
}

async function show(req, res) {
  const order = await orderService.findById(req.params.id, req.user)

  return res.json(order)
}

async function markAsPaid(req, res) {
  const order = await orderService.markAsPaid(req.params.id, req.body)

  return res.json(order)
}

export const orderController = {
  createFromCart,
  mine,
  seller,
  index,
  show,
  markAsPaid
}
