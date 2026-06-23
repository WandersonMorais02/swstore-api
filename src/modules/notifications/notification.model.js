import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: [
      'ORDER_PAID',
      'ORDER_CREATED',
      'PRODUCT_APPROVED',
      'PRODUCT_REJECTED',
      'PAYOUT_PAID',
      'DOWNLOAD_AVAILABLE',
      'SYSTEM'
    ],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  data: {
    type: Object,
    default: {}
  },

  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

export const Notification = mongoose.model('Notification', notificationSchema)
