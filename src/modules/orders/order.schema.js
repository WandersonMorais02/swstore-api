import { z } from 'zod'

const shippingAddressSchema = z.object({
  recipientName: z.string().optional(),
  zipcode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional()
}).optional()

const shippingGroupSchema = z.object({
  sellerId: z.string(),
  provider: z.enum(['LOCAL', 'MELHOR_ENVIO', 'PICKUP']),
  quoteId: z.string().optional(),
  serviceName: z.string().min(2),
  amount: z.number().min(0),
  deliveryTime: z.number().int().min(0).optional()
})

export const createOrderFromCartSchema = z.object({
  addressId: z.string().optional(),
  shippingAddress: shippingAddressSchema,
  shippingGroups: z.array(shippingGroupSchema).optional(),
  couponCode: z.string().optional()
})
