import { Router } from 'express'

import { shippingController } from './shipping.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const shippingRoutes = Router()

shippingRoutes.use(authMiddleware)

shippingRoutes.post(
  '/quote',
  allowRoles('CUSTOMER', 'ADMIN'),
  shippingController.quoteMine
)
