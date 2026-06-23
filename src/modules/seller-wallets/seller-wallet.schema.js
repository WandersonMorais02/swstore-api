import { z } from 'zod'

export const upsertSellerWalletSchema = z.object({
  preferredMethod: z.enum(['PIX', 'BANK_ACCOUNT']),

  pix: z.object({
    type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM']).optional(),
    key: z.string().optional(),
    holderName: z.string().optional(),
    document: z.string().optional()
  }).optional(),

  bankAccount: z.object({
    bankName: z.string().optional(),
    bankCode: z.string().optional(),
    agency: z.string().optional(),
    account: z.string().optional(),
    accountDigit: z.string().optional(),
    accountType: z.enum(['CHECKING', 'SAVINGS']).optional(),
    holderName: z.string().optional(),
    document: z.string().optional()
  }).optional()
})
