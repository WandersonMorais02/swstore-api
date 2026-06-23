import { z } from 'zod'

export const createLocalShippingZoneSchema = z.object({
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  zipcode: z.string().min(8),
  name: z.string().min(2),
  isActive: z.boolean().optional()
})

export const updateLocalShippingZoneSchema =
  createLocalShippingZoneSchema.partial()

export const createLocalShippingPriceSchema = z.object({
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  zipcode: z.string().min(8),

  originZoneId: z.string(),
  destinationZoneId: z.string(),

  price: z.number().min(0),
  deliveryTime: z.number().int().min(0).optional(),
  isBidirectional: z.boolean().optional(),
  isActive: z.boolean().optional()
})

export const updateLocalShippingPriceSchema =
  createLocalShippingPriceSchema.partial()

export const quoteLocalShippingSchema = z.object({
  zipcode: z.string().min(8),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  destinationZoneId: z.string()
})
