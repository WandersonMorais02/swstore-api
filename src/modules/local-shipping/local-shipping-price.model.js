import mongoose from 'mongoose'

const localShippingPriceSchema = new mongoose.Schema({
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

  originZoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocalShippingZone',
    required: true
  },

  destinationZoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocalShippingZone',
    required: true
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

localShippingPriceSchema.index({
  city: 1,
  state: 1,
  zipcode: 1,
  originZoneId: 1,
  destinationZoneId: 1
}, {
  unique: true
})

export const LocalShippingPrice = mongoose.model(
  'LocalShippingPrice',
  localShippingPriceSchema
)
