import { z } from 'zod'

export const createAddressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2),
  zipcode: z.string().min(8),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  isDefault: z.boolean().optional()
})

export const updateAddressSchema = createAddressSchema.partial()
