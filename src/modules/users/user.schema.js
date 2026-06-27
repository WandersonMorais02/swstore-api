import { z } from 'zod'

const avatarSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  path: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional()
}).optional()

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  avatar: avatarSchema,

  role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),

  sellerProfile: z.object({
    storeName: z.string().optional(),
    document: z.string().optional(),
    phone: z.string().optional()
  }).optional()
})

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: avatarSchema,
  role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
  isActive: z.boolean().optional(),

  sellerProfile: z.object({
    storeName: z.string().optional(),
    document: z.string().optional(),
    phone: z.string().optional(),

    customFeePercent: z.number().min(0).max(100).nullable().optional(),
    useCustomFee: z.boolean().optional(),

    balanceAvailable: z.number().optional(),
    balancePending: z.number().optional(),

    isApproved: z.boolean().optional()
  }).optional()
})

export const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: avatarSchema
})
