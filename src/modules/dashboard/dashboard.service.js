import { User } from '../users/user.model.js'
import { Product } from '../products/product.model.js'
import { Order } from '../orders/order.model.js'
import { License } from '../licenses/license.model.js'
import { Review } from '../reviews/review.model.js'
import { Favorite } from '../favorites/favorite.model.js'
import { SellerPayout } from '../seller-payouts/seller-payout.model.js'

function startOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function startOfDay() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

async function admin() {
  const today = startOfDay()
  const month = startOfMonth()

  const [
    customers,
    sellers,
    products,
    pendingProducts,
    orders,
    paidOrders,
    licenses,
    reviews
  ] = await Promise.all([
    User.countDocuments({ role: 'CUSTOMER' }),
    User.countDocuments({ role: 'SELLER' }),
    Product.countDocuments(),
    Product.countDocuments({ status: 'PENDING_APPROVAL' }),
    Order.countDocuments(),
    Order.countDocuments({ status: 'PAID' }),
    License.countDocuments(),
    Review.countDocuments({ isActive: true })
  ])

  const todaySales = await Order.aggregate([
    {
      $match: {
        status: { $in: ['PAID', 'PROCESSING', 'COMPLETED'] },
        createdAt: { $gte: today }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
        platformFeeTotal: { $sum: '$platformFeeTotal' },
        sellersNetTotal: { $sum: '$sellersNetTotal' },
        orders: { $sum: 1 }
      }
    }
  ])

  const monthSales = await Order.aggregate([
    {
      $match: {
        status: { $in: ['PAID', 'PROCESSING', 'COMPLETED'] },
        createdAt: { $gte: month }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
        platformFeeTotal: { $sum: '$platformFeeTotal' },
        sellersNetTotal: { $sum: '$sellersNetTotal' },
        orders: { $sum: 1 }
      }
    }
  ])

  const recentOrders = await Order.find()
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.total' }
      }
    },
    { $sort: { quantity: -1 } },
    { $limit: 10 }
  ])

  return {
    counters: {
      customers,
      sellers,
      products,
      pendingProducts,
      orders,
      paidOrders,
      licenses,
      reviews
    },
    today: todaySales[0] || {
      total: 0,
      platformFeeTotal: 0,
      sellersNetTotal: 0,
      orders: 0
    },
    month: monthSales[0] || {
      total: 0,
      platformFeeTotal: 0,
      sellersNetTotal: 0,
      orders: 0
    },
    recentOrders,
    topProducts
  }
}

async function seller(sellerId) {
  const today = startOfDay()
  const month = startOfMonth()

  const [
    products,
    pendingProducts,
    approvedProducts,
    reviews,
    payouts
  ] = await Promise.all([
    Product.countDocuments({ sellerId }),
    Product.countDocuments({ sellerId, status: 'PENDING_APPROVAL' }),
    Product.countDocuments({ sellerId, status: 'APPROVED' }),
    Review.countDocuments({ isActive: true }),
    SellerPayout.find({ sellerId }).sort({ createdAt: -1 }).limit(10)
  ])

  const orders = await Order.find({
    'items.sellerId': sellerId,
    status: { $in: ['PAID', 'PROCESSING', 'COMPLETED'] }
  }).sort({ createdAt: -1 })

  function extractSellerTotals(orderList) {
    let grossAmount = 0
    let platformFeeAmount = 0
    let netAmount = 0
    let ordersCount = 0

    for (const order of orderList) {
      const sellerItems = order.items.filter(item => {
        return item.sellerId.toString() === sellerId
      })

      if (sellerItems.length > 0) {
        ordersCount += 1
      }

      for (const item of sellerItems) {
        grossAmount += item.total
        platformFeeAmount += item.sellerFeeSnapshot?.feeAmount || 0
        netAmount += item.sellerFeeSnapshot?.sellerNetAmount || 0
      }
    }

    return {
      grossAmount,
      platformFeeAmount,
      netAmount,
      orders: ordersCount
    }
  }

  const todayOrders = orders.filter(order => order.createdAt >= today)
  const monthOrders = orders.filter(order => order.createdAt >= month)

  const recentOrders = orders.slice(0, 10)

  const topProducts = await Order.aggregate([
    {
      $match: {
        status: { $in: ['PAID', 'PROCESSING', 'COMPLETED'] },
        'items.sellerId': sellerId
      }
    },
    { $unwind: '$items' },
    {
      $match: {
        'items.sellerId': sellerId
      }
    },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.total' }
      }
    },
    { $sort: { quantity: -1 } },
    { $limit: 10 }
  ])

  return {
    counters: {
      products,
      pendingProducts,
      approvedProducts,
      reviews
    },
    today: extractSellerTotals(todayOrders),
    month: extractSellerTotals(monthOrders),
    total: extractSellerTotals(orders),
    recentOrders,
    topProducts,
    payouts
  }
}

async function customer(customerId) {
  const [
    orders,
    licenses,
    favorites,
    reviews
  ] = await Promise.all([
    Order.find({ customerId }).sort({ createdAt: -1 }).limit(10),
    License.find({ customerId }).populate('productId', 'name slug previewImages').sort({ createdAt: -1 }).limit(10),
    Favorite.find({ customerId }).populate('productId', 'name slug price promotionalPrice previewImages').sort({ createdAt: -1 }).limit(10),
    Review.find({ customerId }).populate('productId', 'name slug').sort({ createdAt: -1 }).limit(10)
  ])

  const counters = {
    orders: await Order.countDocuments({ customerId }),
    licenses: await License.countDocuments({ customerId }),
    favorites: await Favorite.countDocuments({ customerId }),
    reviews: await Review.countDocuments({ customerId })
  }

  return {
    counters,
    recentOrders: orders,
    recentLicenses: licenses,
    recentFavorites: favorites,
    recentReviews: reviews
  }
}

export const dashboardService = {
  admin,
  seller,
  customer
}
