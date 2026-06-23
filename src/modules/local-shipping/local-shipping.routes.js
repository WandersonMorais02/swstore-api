import { Router } from 'express'

import { localShippingController } from './local-shipping.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const localShippingRoutes = Router()

localShippingRoutes.use(authMiddleware)

localShippingRoutes.post(
  '/quote',
  allowRoles('CUSTOMER', 'ADMIN'),
  localShippingController.quoteMine
)

localShippingRoutes.get(
  '/zones',
  allowRoles('ADMIN'),
  localShippingController.indexZones
)

localShippingRoutes.post(
  '/zones',
  allowRoles('ADMIN'),
  localShippingController.createZone
)

localShippingRoutes.patch(
  '/zones/:id',
  allowRoles('ADMIN'),
  localShippingController.updateZone
)

localShippingRoutes.delete(
  '/zones/:id',
  allowRoles('ADMIN'),
  localShippingController.removeZone
)

localShippingRoutes.get(
  '/prices',
  allowRoles('ADMIN'),
  localShippingController.indexPrices
)

localShippingRoutes.post(
  '/prices',
  allowRoles('ADMIN'),
  localShippingController.createPrice
)

localShippingRoutes.patch(
  '/prices/:id',
  allowRoles('ADMIN'),
  localShippingController.updatePrice
)

localShippingRoutes.delete(
  '/prices/:id',
  allowRoles('ADMIN'),
  localShippingController.removePrice
)
