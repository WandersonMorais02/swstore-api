import { addressService } from './address.service.js'
import {
  createAddressSchema,
  updateAddressSchema
} from './address.schema.js'

async function create(req, res) {
  const data = createAddressSchema.parse(req.body)

  const address = await addressService.create(req.user.id, data)

  return res.status(201).json(address)
}

async function mine(req, res) {
  const addresses = await addressService.findMine(req.user.id)

  return res.json(addresses)
}

async function show(req, res) {
  const address = await addressService.findById(req.params.id, req.user)

  return res.json(address)
}

async function update(req, res) {
  const data = updateAddressSchema.parse(req.body)

  const address = await addressService.update(req.params.id, req.user, data)

  return res.json(address)
}

async function setDefault(req, res) {
  const address = await addressService.setDefault(req.params.id, req.user)

  return res.json(address)
}

async function remove(req, res) {
  const result = await addressService.remove(req.params.id, req.user)

  return res.json(result)
}

export const addressController = {
  create,
  mine,
  show,
  update,
  setDefault,
  remove
}
