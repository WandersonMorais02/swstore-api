import { Router } from 'express'

import { categoryController } from './category.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const categoryRoutes = Router()

categoryRoutes.get('/', categoryController.index)
categoryRoutes.get('/:id', categoryController.show)

categoryRoutes.use(authMiddleware)
categoryRoutes.use(allowRoles('ADMIN'))

categoryRoutes.post('/', categoryController.create)
categoryRoutes.patch('/:id', categoryController.update)
categoryRoutes.delete('/:id', categoryController.remove)
