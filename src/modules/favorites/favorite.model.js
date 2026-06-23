import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
})

favoriteSchema.index({
  customerId: 1,
  productId: 1
}, {
  unique: true
})

export const Favorite = mongoose.model('Favorite', favoriteSchema)
