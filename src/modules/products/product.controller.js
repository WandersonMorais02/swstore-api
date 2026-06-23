import { productService } from './product.service.js'
import {
  createProductSchema,
  updateProductSchema,
  rejectProductSchema
} from './product.schema.js'

async function create(req, res) {
  const data = createProductSchema.parse(req.body)

  const product = await productService.create(data, req.user)

  return res.status(201).json(product)
}

async function publicIndex(req, res) {
  const products = await productService.findPublic(req.query)

  return res.json(products)
}

async function publicShow(req, res) {
  const product = await productService.findPublicBySlug(req.params.slug)

  return res.json(product)
}

async function adminIndex(req, res) {
  const products = await productService.findAdmin(req.query)

  return res.json(products)
}

async function mine(req, res) {
  const products = await productService.findMine(req.user.id)

  return res.json(products)
}

async function adminShow(req, res) {
  const product = await productService.findAdminById(req.params.id)

  return res.json(product)
}

async function update(req, res) {
  const data = updateProductSchema.parse(req.body)

  const product = await productService.update(req.params.id, data, req.user)

  return res.json(product)
}

async function approve(req, res) {
  const product = await productService.approve(req.params.id)

  return res.json(product)
}

async function reject(req, res) {
  const data = rejectProductSchema.parse(req.body)

  const product = await productService.reject(
    req.params.id,
    data.rejectionReason
  )

  return res.json(product)
}

async function remove(req, res) {
  const result = await productService.remove(req.params.id, req.user)

  return res.json(result)
}

export const productController = {
  create,
  publicIndex,
  publicShow,
  adminIndex,
  mine,
  adminShow,
  update,
  approve,
  reject,
  remove
}
