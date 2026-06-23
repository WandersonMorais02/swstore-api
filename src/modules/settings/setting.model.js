import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: 'Digital Commerce'
  },

  platformFeePercent: {
    type: Number,
    default: 5,
    min: 0,
    max: 100
  },

  payoutMode: {
    type: String,
    enum: ['MANUAL'],
    default: 'MANUAL'
  },

  payoutSchedule: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY'],
    default: 'DAILY'
  },

  currency: {
    type: String,
    default: 'BRL'
  }
}, {
  timestamps: true
})

export const Setting = mongoose.model('Setting', settingSchema)
