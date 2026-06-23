import { Router } from 'express'

import { paymentController } from './payment.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const paymentRoutes = Router()

paymentRoutes.post(
  '/webhook/mercado-pago',
  paymentController.mercadoPagoWebhook
)

paymentRoutes.get(
  '/webhook/mercado-pago',
  paymentController.mercadoPagoWebhook
)

paymentRoutes.use(authMiddleware)

paymentRoutes.post(
  '/checkout/:orderId',
  allowRoles('CUSTOMER', 'ADMIN'),
  paymentController.createCheckout
)

paymentRoutes.get(
  '/me',
  allowRoles('CUSTOMER', 'ADMIN'),
  paymentController.mine
)

paymentRoutes.get(
  '/',
  allowRoles('ADMIN'),
  paymentController.index
)
