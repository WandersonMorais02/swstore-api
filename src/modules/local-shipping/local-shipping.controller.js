import { localShippingService } from './local-shipping.service.js'
import {
  createLocalShippingZoneSchema,
  updateLocalShippingZoneSchema,
  createLocalShippingPriceSchema,
  updateLocalShippingPriceSchema,
  quoteLocalShippingSchema
} from './local-shipping.schema.js'

async function createZone(req, res) {
  const data = createLocalShippingZoneSchema.parse(req.body)
  const zone = await localShippingService.createZone(data)

  return res.status(201).json(zone)
}

async function indexZones(req, res) {
  const zones = await localShippingService.findZones(req.query)

  return res.json(zones)
}

async function updateZone(req, res) {
  const data = updateLocalShippingZoneSchema.parse(req.body)
  const zone = await localShippingService.updateZone(req.params.id, data)

  return res.json(zone)
}

async function removeZone(req, res) {
  const result = await localShippingService.removeZone(req.params.id)

  return res.json(result)
}

async function createPrice(req, res) {
  const data = createLocalShippingPriceSchema.parse(req.body)
  const price = await localShippingService.createPrice(data)

  return res.status(201).json(price)
}

async function indexPrices(req, res) {
  const prices = await localShippingService.findPrices(req.query)

  return res.json(prices)
}

async function updatePrice(req, res) {
  const data = updateLocalShippingPriceSchema.parse(req.body)
  const price = await localShippingService.updatePrice(req.params.id, data)

  return res.json(price)
}

async function removePrice(req, res) {
  const result = await localShippingService.removePrice(req.params.id)

  return res.json(result)
}

async function quoteMine(req, res) {
  const data = quoteLocalShippingSchema.parse(req.body)
  const result = await localShippingService.quoteMine(req.user.id, data)

  return res.json(result)
}

export const localShippingController = {
  createZone,
  indexZones,
  updateZone,
  removeZone,

  createPrice,
  indexPrices,
  updatePrice,
  removePrice,

  quoteMine
}
