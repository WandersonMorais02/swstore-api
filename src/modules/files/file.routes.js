import { Router } from 'express'

import { upload } from './upload.config.js'
import { fileController } from './file.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const fileRoutes = Router()

fileRoutes.use(authMiddleware)

fileRoutes.post(
  '/products/previews',
  allowRoles('ADMIN', 'SELLER'),
  upload.single('file'),
  fileController.uploadProductPreview
)

fileRoutes.post(
  '/products/originals',
  allowRoles('ADMIN', 'SELLER'),
  upload.single('file'),
  fileController.uploadProductOriginal
)

fileRoutes.post(
  '/categories',
  allowRoles('ADMIN'),
  upload.single('file'),
  fileController.uploadCategoryImage
)

fileRoutes.post(
  '/users/avatar',
  allowRoles('ADMIN', 'SELLER', 'CUSTOMER'),
  upload.single('file'),
  fileController.uploadUserAvatar
)
