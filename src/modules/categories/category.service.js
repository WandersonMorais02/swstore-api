import { Category } from './category.model.js'
import { CategoryDTO } from './category.dto.js'
import { AppError } from '../../shared/errors/AppError.js'
import { slugify } from '../../shared/utils/slugify.js'

async function create(data) {
  const slug = slugify(data.name)

  const exists = await Category.findOne({ slug })

  if (exists) {
    throw new AppError('Categoria já cadastrada', 409)
  }

  const category = await Category.create({
    ...data,
    slug
  })

  return new CategoryDTO(category)
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true'
  }

  const categories = await Category.find(query).sort({ name: 1 })

  return categories.map(category => new CategoryDTO(category))
}

async function findById(id) {
  const category = await Category.findById(id)

  if (!category) {
    throw new AppError('Categoria não encontrada', 404)
  }

  return new CategoryDTO(category)
}

async function update(id, data) {
  const category = await Category.findById(id)

  if (!category) {
    throw new AppError('Categoria não encontrada', 404)
  }

  if (data.name && data.name !== category.name) {
    const slug = slugify(data.name)

    const exists = await Category.findOne({
      slug,
      _id: { $ne: id }
    })

    if (exists) {
      throw new AppError('Categoria já cadastrada', 409)
    }

    category.slug = slug
  }

  Object.assign(category, data)

  await category.save()

  return new CategoryDTO(category)
}

async function remove(id) {
  const category = await Category.findById(id)

  if (!category) {
    throw new AppError('Categoria não encontrada', 404)
  }

  await category.deleteOne()

  return {
    message: 'Categoria removida com sucesso'
  }
}

export const categoryService = {
  create,
  findAll,
  findById,
  update,
  remove
}
