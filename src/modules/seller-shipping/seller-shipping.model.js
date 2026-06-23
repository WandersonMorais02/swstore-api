import mongoose from 'mongoose'

const sellerShippingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  pickupName: {
    type: String,
    default: 'Loja Principal'
  },

  originAddress: {
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
      required: true
    }
  },

  sender: {
    name: String,
    phone: String,
    document: String
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export const SellerShipping = mongoose.model('SellerShipping', sellerShippingSchema)
