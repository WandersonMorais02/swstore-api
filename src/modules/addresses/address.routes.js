import { Router } from 'express'

import { addressController } from './address.controller.js'
import { authMiddleware } from '../../shared/middlewares/authMiddleware.js'
import { allowRoles } from '../../shared/middlewares/allowRoles.js'

export const addressRoutes = Router()

addressRoutes.use(authMiddleware)
addressRoutes.use(allowRoles('CUSTOMER', 'ADMIN'))

addressRoutes.get('/me', addressController.mine)
addressRoutes.post('/', addressController.create)
addressRoutes.get('/:id', addressController.show)
addressRoutes.patch('/:id', addressController.update)
addressRoutes.patch('/:id/default', addressController.setDefault)
addressRoutes.delete('/:id', addressController.remove)
