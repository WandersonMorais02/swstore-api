import { z } from 'zod'

export const createCouponSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),

  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().min(0),

  scope: z.enum(['GLOBAL', 'SELLER']).default('GLOBAL'),
  sellerId: z.string().nullable().optional(),

  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).nullable().optional(),

  usageLimit: z.number().int().positive().nullable().optional(),

  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),

  isActive: z.boolean().optional()
})

export const updateCouponSchema = createCouponSchema.partial()

export const validateCouponSchema = z.object({
  code: z.string().min(2)
})
