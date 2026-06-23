import { paymentService } from './payment.service.js'

async function createCheckout(req, res) {
  const payment = await paymentService.createCheckout(
    req.params.orderId,
    req.user
  )

  return res.status(201).json(payment)
}

async function mine(req, res) {
  const payments = await paymentService.findMine(req.user.id)

  return res.json(payments)
}

async function index(req, res) {
  const payments = await paymentService.findAll(req.query)

  return res.json(payments)
}

async function mercadoPagoWebhook(req, res) {
  const result = await paymentService.handleMercadoPagoWebhook(
    req.body,
    req.query
  )

  return res.status(200).json(result)
}

export const paymentController = {
  createCheckout,
  mine,
  index,
  mercadoPagoWebhook
}
