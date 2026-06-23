import mongoose from 'mongoose'

const licenseSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  downloadHash: {
    type: String,
    required: true,
    unique: true
  },

  planId: String,
  planName: String,

  downloadLimit: {
    type: Number,
    default: null
  },

  downloadsUsed: {
    type: Number,
    default: 0
  },

  isPermanent: {
    type: Boolean,
    default: false
  },

  expiresAt: Date,

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const License = mongoose.model('License', licenseSchema)
