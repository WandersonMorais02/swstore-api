import { Router } from 'express'

import { favoriteController } from './favorite.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const favoriteRoutes = Router()

favoriteRoutes.use(authMiddleware)
favoriteRoutes.use(allowRoles('CUSTOMER', 'ADMIN'))

favoriteRoutes.get('/me', favoriteController.mine)
favoriteRoutes.get('/check/:productId', favoriteController.check)
favoriteRoutes.post('/', favoriteController.add)
favoriteRoutes.post('/toggle', favoriteController.toggle)
favoriteRoutes.delete('/:productId', favoriteController.remove)
