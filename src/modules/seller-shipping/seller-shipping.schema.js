import { z } from 'zod'

export const upsertSellerShippingSchema = z.object({
  pickupName: z.string().optional(),
  originAddress: z.object({
    zipcode: z.string().min(8),
    street: z.string().min(2),
    number: z.string().min(1),
    complement: z.string().optional(),
    district: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2).max(2)
  }),

  sender: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    document: z.string().optional()
  }).optional(),

  isActive: z.boolean().optional()
})
