import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  title: String,
  comment: String,

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

reviewSchema.index({
  customerId: 1,
  productId: 1,
  orderId: 1
}, {
  unique: true
})

export const Review = mongoose.model('Review', reviewSchema)
