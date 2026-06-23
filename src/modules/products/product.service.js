import { Product } from './product.model.js'
import { ProductDTO } from './product.dto.js'
import { ProductAdminDTO } from './product-admin.dto.js'

import { User } from '../users/user.model.js'
import { Category } from '../categories/category.model.js'

import { AppError } from '../../shared/errors/AppError.js'
import { slugify } from '../../shared/utils/slugify.js'

async function validateSeller(sellerId) {
  const seller = await User.findById(sellerId)

  if (!seller) {
    throw new AppError('Vendedor não encontrado', 404)
  }

  if (!['SELLER', 'ADMIN'].includes(seller.role)) {
    throw new AppError('Usuário não pode cadastrar produtos', 403)
  }

  if (seller.role === 'SELLER' && !seller.sellerProfile?.isApproved) {
    throw new AppError('Vendedor ainda não foi aprovado', 403)
  }

  return seller
}

async function validateCategory(categoryId) {
  const category = await Category.findById(categoryId)

  if (!category || !category.isActive) {
    throw new AppError('Categoria inválida ou inativa', 400)
  }

  return category
}

function validateProductByType(data) {
  const isDigital = ['DIGITAL', 'HYBRID'].includes(data.type)
  const isPhysical = ['PHYSICAL', 'HYBRID'].includes(data.type)

  if (isDigital) {
    if (!data.previewImages || data.previewImages.length === 0) {
      throw new AppError('Produto digital precisa de preview em baixa resolução', 400)
    }

    if (!data.digitalFiles || data.digitalFiles.length === 0) {
      throw new AppError('Produto digital precisa do arquivo original para download', 400)
    }

    if (!data.downloadPlans || data.downloadPlans.length === 0) {
      throw new AppError('Produto digital precisa de pelo menos um plano de download', 400)
    }
  }

  if (isPhysical) {
    if (!data.stock || data.stock <= 0) {
      throw new AppError('Produto físico precisa de estoque', 400)
    }

    const dimensions = data.dimensions || {}

    if (
      !dimensions.weight ||
      !dimensions.width ||
      !dimensions.height ||
      !dimensions.length
    ) {
      throw new AppError('Produto físico precisa de peso, largura, altura e comprimento', 400)
    }
  }
}

async function create(data, currentUser) {
  const sellerId = currentUser.role === 'ADMIN'
    ? data.sellerId || currentUser.id
    : currentUser.id

  await validateSeller(sellerId)
  await validateCategory(data.categoryId)

  validateProductByType(data)

  const slug = slugify(data.name)

  const exists = await Product.findOne({ slug })

  if (exists) {
    throw new AppError('Produto já cadastrado com esse nome', 409)
  }

  const product = await Product.create({
    ...data,
    sellerId,
    slug,
    status: currentUser.role === 'ADMIN'
      ? 'APPROVED'
      : data.status || 'PENDING_APPROVAL'
  })

  return new ProductAdminDTO(product)
}

async function findPublic(filters = {}) {
  const query = {
    isActive: true,
    status: 'APPROVED'
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId
  }

  if (filters.type) {
    query.type = filters.type
  }

  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { tags: new RegExp(filters.search, 'i') }
    ]
  }

  const products = await Product.find(query)
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name sellerProfile.storeName')
    .sort({ createdAt: -1 })

  return products.map(product => new ProductDTO(product))
}

async function findAdmin(filters = {}) {
  const query = {}

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.sellerId) {
    query.sellerId = filters.sellerId
  }

  if (filters.type) {
    query.type = filters.type
  }

  const products = await Product.find(query)
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name email sellerProfile')
    .sort({ createdAt: -1 })

  return products.map(product => new ProductAdminDTO(product))
}

async function findMine(sellerId) {
  const products = await Product.find({ sellerId })
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 })

  return products.map(product => new ProductAdminDTO(product))
}

async function findPublicBySlug(slug) {
  const product = await Product.findOne({
    slug,
    isActive: true,
    status: 'APPROVED'
  })
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name sellerProfile.storeName')

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  return new ProductDTO(product)
}

async function findAdminById(id) {
  const product = await Product.findById(id)
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name email sellerProfile')

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  return new ProductAdminDTO(product)
}

async function update(id, data, currentUser) {
  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  const isOwner = product.sellerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode editar esse produto', 403)
  }

  if (data.categoryId) {
    await validateCategory(data.categoryId)
  }

  const mergedData = {
    ...product.toObject(),
    ...data
  }

  validateProductByType(mergedData)

  if (data.name && data.name !== product.name) {
    const slug = slugify(data.name)

    const exists = await Product.findOne({
      slug,
      _id: { $ne: id }
    })

    if (exists) {
      throw new AppError('Produto já cadastrado com esse nome', 409)
    }

    product.slug = slug
  }

  Object.assign(product, data)

  if (!isAdmin) {
    product.status = 'PENDING_APPROVAL'
    product.rejectionReason = undefined
  }

  await product.save()

  return new ProductAdminDTO(product)
}

async function approve(id) {
  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  product.status = 'APPROVED'
  product.rejectionReason = undefined
  product.isActive = true

  await product.save()

  return new ProductAdminDTO(product)
}

async function reject(id, reason) {
  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  product.status = 'REJECTED'
  product.rejectionReason = reason

  await product.save()

  return new ProductAdminDTO(product)
}

async function remove(id, currentUser) {
  const product = await Product.findById(id)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  const isOwner = product.sellerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode remover esse produto', 403)
  }

  await product.deleteOne()

  return {
    message: 'Produto removido com sucesso'
  }
}

export const productService = {
  create,
  findPublic,
  findAdmin,
  findMine,
  findPublicBySlug,
  findAdminById,
  update,
  approve,
  reject,
  remove
}
