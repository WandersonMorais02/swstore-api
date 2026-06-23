import { sellerPayoutService } from './seller-payout.service.js'
import {
  createSellerPayoutSchema,
  updatePayoutStatusSchema
} from './seller-payout.schema.js'

async function index(req, res) {
  const payouts = await sellerPayoutService.findAll(req.query)

  return res.json(payouts)
}

async function mine(req, res) {
  const payouts = await sellerPayoutService.findMine(req.user.id)

  return res.json(payouts)
}

async function create(req, res) {
  const data = createSellerPayoutSchema.parse(req.body)

  const payout = await sellerPayoutService.createManual(data)

  return res.status(201).json(payout)
}

async function markAsPaid(req, res) {
  const data = updatePayoutStatusSchema.parse(req.body)

  const payout = await sellerPayoutService.markAsPaid(
    req.params.id,
    data.adminNotes
  )

  return res.json(payout)
}

async function cancel(req, res) {
  const data = updatePayoutStatusSchema.parse(req.body)

  const payout = await sellerPayoutService.cancel(
    req.params.id,
    data.adminNotes
  )

  return res.json(payout)
}

export const sellerPayoutController = {
  index,
  mine,
  create,
  markAsPaid,
  cancel
}
