import { z } from 'zod'

export const createShareLinkSchema = z.object({
  licenseId: z.string(),
  expiresInHours: z.number().int().min(1).max(24 * 30).default(24),
  accessLimit: z.number().int().min(1).max(100).default(1),
  allowDownload: z.boolean().default(false)
})
