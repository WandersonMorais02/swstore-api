import { Router } from 'express'

import { shareLinkController } from './share-link.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const shareLinkRoutes = Router()



shareLinkRoutes.use(authMiddleware)

shareLinkRoutes.post(
  '/',
  allowRoles('CUSTOMER', 'ADMIN'),
  shareLinkController.create
)

shareLinkRoutes.get(
  '/me/list',
  allowRoles('CUSTOMER', 'ADMIN'),
  shareLinkController.mine
)

shareLinkRoutes.patch(
  '/:id/deactivate',
  allowRoles('CUSTOMER', 'ADMIN'),
  shareLinkController.deactivate
)

shareLinkRoutes.get('/:token', shareLinkController.showPublic)
shareLinkRoutes.post('/:token/access', shareLinkController.registerAccess)
shareLinkRoutes.get('/:token/download', shareLinkController.download)
