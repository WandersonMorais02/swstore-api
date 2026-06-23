import mongoose from 'mongoose'

const sellerPayoutSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  periodStart: {
    type: Date,
    required: true
  },

  periodEnd: {
    type: Date,
    required: true
  },

  grossAmount: {
    type: Number,
    required: true,
    default: 0
  },

  platformFeeAmount: {
    type: Number,
    required: true,
    default: 0
  },

  netAmount: {
    type: Number,
    required: true,
    default: 0
  },

  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELED'],
    default: 'PENDING'
  },

  paymentMethodSnapshot: {
    preferredMethod: String,
    pix: Object,
    bankAccount: Object
  },

  paidAt: Date,

  adminNotes: String
}, {
  timestamps: true
})

export const SellerPayout = mongoose.model('SellerPayout', sellerPayoutSchema)
