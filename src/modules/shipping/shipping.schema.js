import { z } from 'zod'

export const shippingQuoteSchema = z.object({
  zipcode: z.string().min(8)
})
