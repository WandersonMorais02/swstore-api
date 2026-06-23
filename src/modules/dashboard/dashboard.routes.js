import { Router } from 'express'

import { dashboardController } from './dashboard.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const dashboardRoutes = Router()

dashboardRoutes.use(authMiddleware)

dashboardRoutes.get(
  '/admin',
  allowRoles('ADMIN'),
  dashboardController.admin
)

dashboardRoutes.get(
  '/seller',
  allowRoles('SELLER'),
  dashboardController.seller
)

dashboardRoutes.get(
  '/customer',
  allowRoles('CUSTOMER', 'ADMIN'),
  dashboardController.customer
)
