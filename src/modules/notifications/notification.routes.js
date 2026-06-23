import { Router } from 'express'

import { notificationController } from './notification.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'

export const notificationRoutes = Router()

notificationRoutes.use(authMiddleware)

notificationRoutes.get('/me', notificationController.mine)
notificationRoutes.get('/unread-count', notificationController.count)
notificationRoutes.patch('/:id/read', notificationController.read)
notificationRoutes.patch('/read-all', notificationController.readAll)
