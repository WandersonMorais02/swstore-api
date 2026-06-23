import { Router } from 'express'

import { cartController } from './cart.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const cartRoutes = Router()

cartRoutes.use(authMiddleware)
cartRoutes.use(allowRoles('CUSTOMER', 'ADMIN'))

cartRoutes.get('/me', cartController.mine)
cartRoutes.post('/items', cartController.addItem)
cartRoutes.patch('/items/:itemId', cartController.updateItem)
cartRoutes.delete('/items/:itemId', cartController.removeItem)
cartRoutes.delete('/clear', cartController.clear)
