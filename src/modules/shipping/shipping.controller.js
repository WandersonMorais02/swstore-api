import { shippingService } from './shipping.service.js'
import { shippingQuoteSchema } from './shipping.schema.js'

async function quoteMine(req, res) {
  const data = shippingQuoteSchema.parse(req.body)

  const result = await shippingService.quoteMine(req.user.id, data)

  return res.json(result)
}

export const shippingController = {
  quoteMine
}
