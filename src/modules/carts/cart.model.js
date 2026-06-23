import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: true })

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  items: [cartItemSchema]
}, {
  timestamps: true
})

export const Cart = mongoose.model('Cart', cartSchema)
