import mongoose from 'mongoose'

const localShippingRouteSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },

  state: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  zipcode: {
    type: String,
    required: true,
    trim: true
  },

  originDistrict: {
    type: String,
    required: true,
    trim: true
  },

  destinationDistrict: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  deliveryTime: {
    type: Number,
    default: 1
  },

  isBidirectional: {
    type: Boolean,
    default: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

localShippingRouteSchema.index({
  city: 1,
  state: 1,
  zipcode: 1,
  originDistrict: 1,
  destinationDistrict: 1
}, {
  unique: true
})

export const LocalShippingRoute = mongoose.model(
  'LocalShippingRoute',
  localShippingRouteSchema
)
