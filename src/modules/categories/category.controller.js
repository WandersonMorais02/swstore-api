import { categoryService } from './category.service.js'
import {
  createCategorySchema,
  updateCategorySchema
} from './category.schema.js'

async function create(req, res) {
  const data = createCategorySchema.parse(req.body)
  const category = await categoryService.create(data)

  return res.status(201).json(category)
}

async function index(req, res) {
  const categories = await categoryService.findAll(req.query)

  return res.json(categories)
}

async function show(req, res) {
  const category = await categoryService.findById(req.params.id)

  return res.json(category)
}

async function update(req, res) {
  const data = updateCategorySchema.parse(req.body)
  const category = await categoryService.update(req.params.id, data)

  return res.json(category)
}

async function remove(req, res) {
  const result = await categoryService.remove(req.params.id)

  return res.json(result)
}

export const categoryController = {
  create,
  index,
  show,
  update,
  remove
}
