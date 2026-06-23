import { Router } from 'express'

import { couponController } from './coupon.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const couponRoutes = Router()

couponRoutes.use(authMiddleware)

couponRoutes.post(
  '/validate',
  allowRoles('CUSTOMER', 'ADMIN'),
  couponController.validate
)

couponRoutes.get(
  '/',
  allowRoles('ADMIN'),
  couponController.index
)

couponRoutes.get(
  '/:id',
  allowRoles('ADMIN'),
  couponController.show
)

couponRoutes.post(
  '/',
  allowRoles('ADMIN'),
  couponController.create
)

couponRoutes.patch(
  '/:id',
  allowRoles('ADMIN'),
  couponController.update
)

couponRoutes.delete(
  '/:id',
  allowRoles('ADMIN'),
  couponController.remove
)
