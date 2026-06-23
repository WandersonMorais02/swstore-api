import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  label: {
    type: String,
    default: 'Endereço'
  },

  recipientName: {
    type: String,
    required: true
  },

  zipcode: {
    type: String,
    required: true
  },

  street: {
    type: String,
    required: true
  },

  number: {
    type: String,
    required: true
  },

  complement: String,

  district: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true,
    uppercase: true
  },

  isDefault: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const Address = mongoose.model('Address', addressSchema)
