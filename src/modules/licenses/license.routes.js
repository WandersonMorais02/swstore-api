import { Router } from 'express'

import { licenseController } from './license.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const licenseRoutes = Router()

licenseRoutes.use(authMiddleware)

licenseRoutes.get(
  '/my',
  allowRoles('CUSTOMER', 'ADMIN'),
  licenseController.mine
)

licenseRoutes.get(
  '/:id',
  allowRoles('CUSTOMER', 'ADMIN'),
  licenseController.show
)

licenseRoutes.post(
  '/:id/download-link',
  allowRoles('CUSTOMER', 'ADMIN'),
  licenseController.getDownloadLink
)
