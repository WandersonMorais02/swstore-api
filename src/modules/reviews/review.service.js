import { Review } from './review.model.js'
import { ReviewDTO } from './review.dto.js'
import { Order } from '../orders/order.model.js'
import { Product } from '../products/product.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function ensureCanReview(customerId, productId, orderId) {
  const order = await Order.findOne({
    _id: orderId,
    customerId,
    status: { $in: ['PAID', 'PROCESSING', 'COMPLETED'] },
    'items.productId': productId
  })

  if (!order) {
    throw new AppError('Você só pode avaliar produtos comprados e pagos', 403)
  }

  return order
}

async function updateProductRating(productId) {
  const result = await Review.aggregate([
    {
      $match: {
        productId,
        isActive: true
      }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 }
      }
    }
  ])

  const stats = result[0]

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats ? Number(stats.averageRating.toFixed(1)) : 0,
    reviewsCount: stats ? stats.reviewsCount : 0
  })
}

async function create(customerId, data) {
  await ensureCanReview(customerId, data.productId, data.orderId)

  const exists = await Review.findOne({
    customerId,
    productId: data.productId,
    orderId: data.orderId
  })

  if (exists) {
    throw new AppError('Você já avaliou esse produto neste pedido', 409)
  }

  const review = await Review.create({
    customerId,
    ...data
  })

  await updateProductRating(review.productId)

  return new ReviewDTO(review)
}

async function findByProduct(productId) {
  const reviews = await Review.find({
    productId,
    isActive: true
  })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 })

  return reviews.map(review => new ReviewDTO(review))
}

async function findMine(customerId) {
  const reviews = await Review.find({ customerId })
    .populate('productId', 'name slug previewImages')
    .sort({ createdAt: -1 })

  return reviews.map(review => new ReviewDTO(review))
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.productId) query.productId = filters.productId
  if (filters.customerId) query.customerId = filters.customerId
  if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true'

  const reviews = await Review.find(query)
    .populate('customerId', 'name email')
    .populate('productId', 'name slug')
    .sort({ createdAt: -1 })

  return reviews.map(review => new ReviewDTO(review))
}

async function update(id, currentUser, data) {
  const review = await Review.findById(id)

  if (!review) {
    throw new AppError('Avaliação não encontrada', 404)
  }

  const isOwner = review.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode editar essa avaliação', 403)
  }

  Object.assign(review, data)

  await review.save()
  await updateProductRating(review.productId)

  return new ReviewDTO(review)
}

async function remove(id, currentUser) {
  const review = await Review.findById(id)

  if (!review) {
    throw new AppError('Avaliação não encontrada', 404)
  }

  const isOwner = review.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode remover essa avaliação', 403)
  }

  review.isActive = false

  await review.save()
  await updateProductRating(review.productId)

  return {
    message: 'Avaliação removida com sucesso'
  }
}

export const reviewService = {
  create,
  findByProduct,
  findMine,
  findAll,
  update,
  remove
}
