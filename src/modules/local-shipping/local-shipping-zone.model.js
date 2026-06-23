import mongoose from 'mongoose'

const localShippingZoneSchema = new mongoose.Schema({
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

  name: {
    type: String,
    required: true,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

localShippingZoneSchema.index({
  city: 1,
  state: 1,
  zipcode: 1,
  name: 1
}, {
  unique: true
})

export const LocalShippingZone = mongoose.model(
  'LocalShippingZone',
  localShippingZoneSchema
)
