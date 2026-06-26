import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
  path: String,
  mimeType: String,
  size: Number,

  alt: String,

  isMain: {
    type: Boolean,
    default: false
  },

  order: {
    type: Number,
    default: 0
  }
}, { _id: false })

const downloadPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  downloadLimit: {
    type: Number,
    default: null
  },

  isPermanent: {
    type: Boolean,
    default: false
  }
}, { _id: true })

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  type: {
    type: String,
    enum: ['DIGITAL', 'PHYSICAL', 'HYBRID'],
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  promotionalPrice: {
    type: Number,
    default: null
  },

  previewImages: [fileSchema],

  digitalFiles: [fileSchema],

  downloadPlans: [downloadPlanSchema],

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  dimensions: {
    weight: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    }
  },

  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE'],
    default: 'PENDING_APPROVAL'
  },

  rejectionReason: String,

  isActive: {
    type: Boolean,
    default: true
  },

  tags: [String]
}, {
  timestamps: true
})

export const Product = mongoose.model('Product', productSchema)
