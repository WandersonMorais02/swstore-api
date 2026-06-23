import { Router } from 'express'

import { authController } from './auth.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'

export const authRoutes = Router()

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
authRoutes.get('/me', authMiddleware, authController.me)
authRoutes.post('/logout', authMiddleware, authController.logout)
