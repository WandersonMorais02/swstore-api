import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  description: String,

  type: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
    required: true
  },

  value: {
    type: Number,
    required: true,
    min: 0
  },

  scope: {
    type: String,
    enum: ['GLOBAL', 'SELLER'],
    default: 'GLOBAL'
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  minOrderAmount: {
    type: Number,
    default: 0
  },

  maxDiscountAmount: {
    type: Number,
    default: null
  },

  usageLimit: {
    type: Number,
    default: null
  },

  usedCount: {
    type: Number,
    default: 0
  },

  startsAt: Date,
  expiresAt: Date,

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const Coupon = mongoose.model('Coupon', couponSchema)
