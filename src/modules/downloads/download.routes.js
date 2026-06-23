import { Router } from 'express'

import { downloadController } from './download.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const downloadRoutes = Router()

downloadRoutes.use(authMiddleware)

downloadRoutes.get(
  '/:hash',
  allowRoles('CUSTOMER', 'ADMIN'),
  downloadController.downloadByHash
)
