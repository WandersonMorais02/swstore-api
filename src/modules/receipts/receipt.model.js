import mongoose from 'mongoose'

const receiptSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  privateHash: {
    type: String,
    required: true,
    unique: true
  },

  publicHash: {
    type: String,
    required: true,
    unique: true
  },

  privateNumber: {
    type: String,
    required: true,
    unique: true
  },

  publicNumber: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ['ORDER_RECEIPT'],
    default: 'ORDER_RECEIPT'
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const Receipt = mongoose.model('Receipt', receiptSchema)
