import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  productType: {
    type: String,
    enum: ['DIGITAL', 'PHYSICAL', 'HYBRID'],
    required: true
  },

  name: String,
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },

  planSnapshot: {
    planId: String,
    name: String,
    price: Number,
    downloadLimit: Number,
    isPermanent: Boolean
  },

  productSnapshot: {
    previewImages: Array,
    dimensions: Object
  },

  sellerFeeSnapshot: {
    feePercent: Number,
    feeAmount: Number,
    sellerNetAmount: Number
  }
}, { _id: true })

const shippingGroupSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  provider: {
    type: String,
    enum: ['LOCAL', 'MELHOR_ENVIO', 'PICKUP'],
    required: true
  },

  quoteId: String,
  serviceName: { type: String, required: true },
  amount: { type: Number, default: 0, min: 0 },
  deliveryTime: Number,
  trackingCode: String,
  labelUrl: String,

  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'],
    default: 'PENDING'
  }
}, { _id: true })

const orderSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [orderItemSchema],

  subtotal: {
    type: Number,
    required: true
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  couponSnapshot: {
    couponId: String,
    code: String,
    type: String,
    value: Number,
    scope: String,
    sellerId: String,
    discountAmount: Number
  },

  shippingAmount: {
    type: Number,
    default: 0
  },

  shippingGroups: [shippingGroupSchema],

  total: {
    type: Number,
    required: true
  },

  platformFeeTotal: {
    type: Number,
    default: 0
  },

  sellersNetTotal: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'PROCESSING',
      'COMPLETED',
      'CANCELED',
      'REFUNDED'
    ],
    default: 'PENDING_PAYMENT'
  },

  payment: {
    provider: String,
    method: String,
    externalId: String,
    paidAt: Date
  },

  shippingAddress: {
    recipientName: String,
    zipcode: String,
    street: String,
    number: String,
    complement: String,
    district: String,
    city: String,
    state: String
  }
}, {
  timestamps: true
})

export const Order = mongoose.model('Order', orderSchema)
