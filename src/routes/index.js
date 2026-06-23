import { Router } from 'express'

import { authRoutes } from '../modules/auth/auth.routes.js'
import { userRoutes } from '../modules/users/user.routes.js'
import { settingRoutes } from '../modules/settings/setting.routes.js'
import { sellerWalletRoutes } from '../modules/seller-wallets/seller-wallet.routes.js'
import { sellerPayoutRoutes } from '../modules/seller-payouts/seller-payout.routes.js'
import { categoryRoutes } from '../modules/categories/category.routes.js'
import { productRoutes } from '../modules/products/product.routes.js'
import { fileRoutes } from '../modules/files/file.routes.js'
import { cartRoutes } from '../modules/carts/cart.routes.js'
import { orderRoutes } from '../modules/orders/order.routes.js'
import { licenseRoutes } from '../modules/licenses/license.routes.js'
import { downloadRoutes } from '../modules/downloads/download.routes.js'
import { paymentRoutes } from '../modules/payments/payment.routes.js'
import { sellerShippingRoutes } from '../modules/seller-shipping/seller-shipping.routes.js'
import { shippingRoutes } from '../modules/shipping/shipping.routes.js'
import { localShippingRoutes } from '../modules/local-shipping/local-shipping.routes.js'
import { addressRoutes } from '../modules/addresses/address.routes.js'
import { couponRoutes } from '../modules/coupons/coupon.routes.js'
import { reviewRoutes } from '../modules/reviews/review.routes.js'
import { favoriteRoutes } from '../modules/favorites/favorite.routes.js'
import { dashboardRoutes } from '../modules/dashboard/dashboard.routes.js'
import { shareLinkRoutes } from '../modules/share-links/share-link.routes.js'
import { notificationRoutes } from '../modules/notifications/notification.routes.js'
import { receiptRoutes } from '../modules/receipts/receipt.routes.js'

export const routes = Router()

routes.get('/health', (req, res) => {
  return res.json({
    status: 'ok'
  })
})

routes.use('/auth', authRoutes)
routes.use('/users', userRoutes)
routes.use('/settings', settingRoutes)
routes.use('/seller-wallets', sellerWalletRoutes)
routes.use('/seller-payouts', sellerPayoutRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/products', productRoutes)
routes.use('/files', fileRoutes)
routes.use('/cart', cartRoutes)
routes.use('/orders', orderRoutes)
routes.use('/licenses', licenseRoutes)
routes.use('/downloads', downloadRoutes)
routes.use('/payments', paymentRoutes)
routes.use('/seller-shipping', sellerShippingRoutes)
routes.use('/shipping', shippingRoutes)
routes.use('/local-shipping', localShippingRoutes)
routes.use('/addresses', addressRoutes)
routes.use('/coupons', couponRoutes)
routes.use('/reviews', reviewRoutes)
routes.use('/favorites', favoriteRoutes)
routes.use('/dashboard', dashboardRoutes)
routes.use('/share-links', shareLinkRoutes)
routes.use('/notifications', notificationRoutes)
routes.use('/receipts', receiptRoutes)
