import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  provider: {
    type: String,
    enum: ['MERCADO_PAGO'],
    required: true
  },

  providerPaymentId: String,
  providerPreferenceId: String,

  status: {
    type: String,
    enum: [
      'CREATED',
      'PENDING',
      'APPROVED',
      'REJECTED',
      'CANCELED',
      'REFUNDED'
    ],
    default: 'CREATED'
  },

  amount: {
    type: Number,
    required: true
  },

  checkoutUrl: String,
  sandboxCheckoutUrl: String,

  raw: Object
}, {
  timestamps: true
})

export const Payment = mongoose.model('Payment', paymentSchema)
