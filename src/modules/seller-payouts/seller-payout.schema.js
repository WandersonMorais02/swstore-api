import { z } from 'zod'

export const createSellerPayoutSchema = z.object({
  sellerId: z.string(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  grossAmount: z.number().min(0),
  platformFeeAmount: z.number().min(0),
  netAmount: z.number().min(0)
})

export const updatePayoutStatusSchema = z.object({
  adminNotes: z.string().optional()
})
