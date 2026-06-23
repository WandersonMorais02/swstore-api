import { Router } from 'express'

import { sellerWalletController } from './seller-wallet.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const sellerWalletRoutes = Router()

sellerWalletRoutes.use(authMiddleware)

sellerWalletRoutes.get(
  '/me',
  allowRoles('SELLER'),
  sellerWalletController.mine
)

sellerWalletRoutes.put(
  '/me',
  allowRoles('SELLER'),
  sellerWalletController.upsertMine
)

sellerWalletRoutes.get(
  '/',
  allowRoles('ADMIN'),
  sellerWalletController.index
)

sellerWalletRoutes.patch(
  '/:id/verify',
  allowRoles('ADMIN'),
  sellerWalletController.verify
)
