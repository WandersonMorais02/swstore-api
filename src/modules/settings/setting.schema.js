import { z } from 'zod'

export const updateSettingSchema = z.object({
  platformName: z.string().min(2).optional(),
  platformFeePercent: z.number().min(0).max(100).optional(),
  payoutSchedule: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  currency: z.string().default('BRL').optional()
})
