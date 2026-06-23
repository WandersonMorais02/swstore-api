import { Router } from 'express'

import { sellerShippingController } from './seller-shipping.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const sellerShippingRoutes = Router()

sellerShippingRoutes.use(authMiddleware)

sellerShippingRoutes.get(
  '/me',
  allowRoles('SELLER'),
  sellerShippingController.mine
)

sellerShippingRoutes.put(
  '/me',
  allowRoles('SELLER'),
  sellerShippingController.upsertMine
)

sellerShippingRoutes.get(
  '/',
  allowRoles('ADMIN'),
  sellerShippingController.index
)

sellerShippingRoutes.patch(
  '/:id/activate',
  allowRoles('ADMIN'),
  sellerShippingController.activate
)

sellerShippingRoutes.patch(
  '/:id/deactivate',
  allowRoles('ADMIN'),
  sellerShippingController.deactivate
)
