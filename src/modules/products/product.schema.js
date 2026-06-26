import { z } from 'zod'

const fileSchema = z.object({
  name: z.string().optional(),
  url: z.string().nullable().optional(),
  path: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional(),

  alt: z.string().optional(),
  isMain: z.boolean().optional(),
  order: z.number().int().min(0).optional()
})

const downloadPlanSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  downloadLimit: z.number().int().positive().nullable().optional(),
  isPermanent: z.boolean().optional()
})

const dimensionsSchema = z.object({
  weight: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  length: z.number().min(0).optional()
}).optional()

export const createProductSchema = z.object({
  sellerId: z.string().optional(),
  categoryId: z.string(),

  type: z.enum(['DIGITAL', 'PHYSICAL', 'HYBRID']),

  name: z.string().min(2),
  description: z.string().min(5),

  price: z.number().min(0),
  promotionalPrice: z.number().min(0).nullable().optional(),

  previewImages: z.array(fileSchema).optional(),
  digitalFiles: z.array(fileSchema).optional(),

  downloadPlans: z.array(downloadPlanSchema).optional(),

  stock: z.number().int().min(0).optional(),

  dimensions: dimensionsSchema,

  tags: z.array(z.string()).optional(),

  status: z.enum(['DRAFT', 'PENDING_APPROVAL']).optional()
})

export const updateProductSchema = createProductSchema.partial().extend({
  status: z.enum([
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'INACTIVE'
  ]).optional(),

  rejectionReason: z.string().optional(),

  isActive: z.boolean().optional()
})

export const approveProductSchema = z.object({})

export const rejectProductSchema = z.object({
  rejectionReason: z.string().min(2)
})
