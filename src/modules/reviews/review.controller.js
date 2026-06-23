import { reviewService } from './review.service.js'
import {
  createReviewSchema,
  updateReviewSchema
} from './review.schema.js'

async function create(req, res) {
  const data = createReviewSchema.parse(req.body)

  const review = await reviewService.create(req.user.id, data)

  return res.status(201).json(review)
}

async function product(req, res) {
  const reviews = await reviewService.findByProduct(req.params.productId)

  return res.json(reviews)
}

async function mine(req, res) {
  const reviews = await reviewService.findMine(req.user.id)

  return res.json(reviews)
}

async function index(req, res) {
  const reviews = await reviewService.findAll(req.query)

  return res.json(reviews)
}

async function update(req, res) {
  const data = updateReviewSchema.parse(req.body)

  const review = await reviewService.update(req.params.id, req.user, data)

  return res.json(review)
}

async function remove(req, res) {
  const result = await reviewService.remove(req.params.id, req.user)

  return res.json(result)
}

export const reviewController = {
  create,
  product,
  mine,
  index,
  update,
  remove
}
