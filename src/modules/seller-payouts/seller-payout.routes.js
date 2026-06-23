import { Router } from 'express'

import { sellerPayoutController } from './seller-payout.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const sellerPayoutRoutes = Router()

sellerPayoutRoutes.use(authMiddleware)

sellerPayoutRoutes.get(
  '/me',
  allowRoles('SELLER'),
  sellerPayoutController.mine
)

sellerPayoutRoutes.get(
  '/',
  allowRoles('ADMIN'),
  sellerPayoutController.index
)

sellerPayoutRoutes.post(
  '/',
  allowRoles('ADMIN'),
  sellerPayoutController.create
)

sellerPayoutRoutes.patch(
  '/:id/pay',
  allowRoles('ADMIN'),
  sellerPayoutController.markAsPaid
)

sellerPayoutRoutes.patch(
  '/:id/cancel',
  allowRoles('ADMIN'),
  sellerPayoutController.cancel
)
