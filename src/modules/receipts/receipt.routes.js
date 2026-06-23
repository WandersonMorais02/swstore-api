import { Router } from 'express'

import { receiptController } from './receipt.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const receiptRoutes = Router()

receiptRoutes.get('/public/:hash', receiptController.publicShow)
receiptRoutes.get('/public/:hash/pdf', receiptController.publicPdf)

receiptRoutes.get(
  '/private/:orderId/pdf',
  authMiddleware,
  allowRoles('ADMIN', 'SELLER', 'CUSTOMER'),
  receiptController.privatePdf
)
