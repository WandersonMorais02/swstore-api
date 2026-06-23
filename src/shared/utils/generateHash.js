import crypto from 'crypto'

export function generateHash(prefix = 'dl') {
  const hash = crypto.randomBytes(32).toString('hex')

  return `${prefix}_${hash}`
}
