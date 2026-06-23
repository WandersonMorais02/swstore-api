import { sellerShippingService } from './seller-shipping.service.js'
import { upsertSellerShippingSchema } from './seller-shipping.schema.js'

async function mine(req, res) {
  const sellerShipping = await sellerShippingService.getMine(req.user.id)

  return res.json(sellerShipping)
}

async function upsertMine(req, res) {
  const data = upsertSellerShippingSchema.parse(req.body)

  const sellerShipping = await sellerShippingService.upsertMine(req.user.id, data)

  return res.json(sellerShipping)
}

async function index(req, res) {
  const sellerShippings = await sellerShippingService.findAll(req.query)

  return res.json(sellerShippings)
}

async function activate(req, res) {
  const sellerShipping = await sellerShippingService.updateStatus(
    req.params.id,
    true
  )

  return res.json(sellerShipping)
}

async function deactivate(req, res) {
  const sellerShipping = await sellerShippingService.updateStatus(
    req.params.id,
    false
  )

  return res.json(sellerShipping)
}

export const sellerShippingController = {
  mine,
  upsertMine,
  index,
  activate,
  deactivate
}
