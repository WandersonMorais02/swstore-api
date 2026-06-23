import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ['ADMIN', 'SELLER', 'CUSTOMER'],
    default: 'CUSTOMER'
  },

  sellerProfile: {
    storeName: String,
    document: String,
    phone: String,

    customFeePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },

    useCustomFee: {
      type: Boolean,
      default: false
    },

    balanceAvailable: {
      type: Number,
      default: 0
    },

    balancePending: {
      type: Number,
      default: 0
    },

    isApproved: {
      type: Boolean,
      default: false
    }
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const User = mongoose.model('User', userSchema)
