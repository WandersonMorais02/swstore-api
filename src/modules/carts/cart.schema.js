import { z } from 'zod'

export const addCartItemSchema = z.object({
  productId: z.string(),
  planId: z.string().nullable().optional(),
  quantity: z.number().int().min(1).default(1)
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1)
})
