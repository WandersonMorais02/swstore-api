import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  role: z.enum(['SELLER', 'CUSTOMER']).optional(),

  sellerProfile: z.object({
    storeName: z.string().optional(),
    document: z.string().optional(),
    phone: z.string().optional()
  }).optional()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
