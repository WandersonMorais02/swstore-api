import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

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
  role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
  isActive: z.boolean().optional(),

  sellerProfile: z.object({
    storeName: z.string().optional(),
    document: z.string().optional(),
    phone: z.string().optional(),
    commissionRate: z.number().min(0).max(100).optional(),
    isApproved: z.boolean().optional()
  }).optional()
})
