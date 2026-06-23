import mongoose from 'mongoose'

const shareLinkSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  licenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License',
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  token: {
    type: String,
    required: true,
    unique: true
  },

  expiresAt: {
    type: Date,
    required: true
  },

  accessLimit: {
    type: Number,
    default: 1
  },

  accessUsed: {
    type: Number,
    default: 0
  },

  allowDownload: {
    type: Boolean,
    default: false
  },

  downloadConsumesLicense: {
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

export const ShareLink = mongoose.model('ShareLink', shareLinkSchema)
