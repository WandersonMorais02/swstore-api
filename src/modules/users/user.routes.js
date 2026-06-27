import { Router } from 'express'

import { userController } from './user.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const userRoutes = Router()

userRoutes.post('/', userController.create)

userRoutes.use(authMiddleware)
userRoutes.use(allowRoles('ADMIN'))

userRoutes.get('/', userController.index)
userRoutes.get('/:id', userController.show)
userRoutes.patch('/:id', userController.update)
userRoutes.delete('/:id', userController.remove)
userRoutes.patch('/me', authMiddleware, userController.updateMe)
