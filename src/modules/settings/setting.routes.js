import { Router } from 'express'

import { settingController } from './setting.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const settingRoutes = Router()

settingRoutes.get('/', settingController.show)

settingRoutes.patch(
  '/',
  authMiddleware,
  allowRoles('ADMIN'),
  settingController.update
)
