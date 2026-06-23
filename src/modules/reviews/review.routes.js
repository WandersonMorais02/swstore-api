import { Router } from 'express'

import { reviewController } from './review.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const reviewRoutes = Router()

reviewRoutes.get('/product/:productId', reviewController.product)

reviewRoutes.use(authMiddleware)

reviewRoutes.post(
  '/',
  allowRoles('CUSTOMER', 'ADMIN'),
  reviewController.create
)

reviewRoutes.get(
  '/me',
  allowRoles('CUSTOMER', 'ADMIN'),
  reviewController.mine
)

reviewRoutes.get(
  '/',
  allowRoles('ADMIN'),
  reviewController.index
)

reviewRoutes.patch(
  '/:id',
  allowRoles('CUSTOMER', 'ADMIN'),
  reviewController.update
)

reviewRoutes.delete(
  '/:id',
  allowRoles('CUSTOMER', 'ADMIN'),
  reviewController.remove
)
