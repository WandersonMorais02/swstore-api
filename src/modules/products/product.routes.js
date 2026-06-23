import { Router } from 'express'

import { productController } from './product.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const productRoutes = Router()

productRoutes.get('/', productController.publicIndex)
productRoutes.get('/slug/:slug', productController.publicShow)

productRoutes.use(authMiddleware)

productRoutes.post(
  '/',
  allowRoles('ADMIN', 'SELLER'),
  productController.create
)

productRoutes.get(
  '/me',
  allowRoles('SELLER'),
  productController.mine
)

productRoutes.get(
  '/admin',
  allowRoles('ADMIN'),
  productController.adminIndex
)

productRoutes.get(
  '/admin/:id',
  allowRoles('ADMIN'),
  productController.adminShow
)

productRoutes.patch(
  '/:id',
  allowRoles('ADMIN', 'SELLER'),
  productController.update
)

productRoutes.delete(
  '/:id',
  allowRoles('ADMIN', 'SELLER'),
  productController.remove
)

productRoutes.patch(
  '/:id/approve',
  allowRoles('ADMIN'),
  productController.approve
)

productRoutes.patch(
  '/:id/reject',
  allowRoles('ADMIN'),
  productController.reject
)
