import mongoose from 'mongoose'

const sellerWalletSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  preferredMethod: {
    type: String,
    enum: ['PIX', 'BANK_ACCOUNT'],
    default: 'PIX'
  },

  pix: {
    type: {
      type: String,
      enum: ['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM']
    },
    key: String,
    holderName: String,
    document: String
  },

  bankAccount: {
    bankName: String,
    bankCode: String,
    agency: String,
    account: String,
    accountDigit: String,
    accountType: {
      type: String,
      enum: ['CHECKING', 'SAVINGS']
    },
    holderName: String,
    document: String
  },

  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export const SellerWallet = mongoose.model('SellerWallet', sellerWalletSchema)
