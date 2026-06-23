import { Router } from 'express'

import { orderController } from './order.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const orderRoutes = Router()

orderRoutes.use(authMiddleware)

orderRoutes.post(
  '/from-cart',
  allowRoles('CUSTOMER', 'ADMIN'),
  orderController.createFromCart
)

orderRoutes.get(
  '/me',
  allowRoles('CUSTOMER', 'ADMIN'),
  orderController.mine
)

orderRoutes.get(
  '/seller',
  allowRoles('SELLER'),
  orderController.seller
)

orderRoutes.get(
  '/',
  allowRoles('ADMIN'),
  orderController.index
)

orderRoutes.get(
  '/:id',
  allowRoles('ADMIN', 'SELLER', 'CUSTOMER'),
  orderController.show
)

orderRoutes.patch(
  '/:id/pay',
  allowRoles('ADMIN'),
  orderController.markAsPaid
)
