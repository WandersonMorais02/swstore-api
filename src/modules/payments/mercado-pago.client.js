import { MercadoPagoConfig, Preference, Payment as MercadoPagoPayment } from 'mercadopago'

import { env } from '../../config/env.js'
import { AppError } from '../../shared/errors/AppError.js'

if (!env.mercadoPagoAccessToken) {
  console.warn('⚠️ MERCADO_PAGO_ACCESS_TOKEN não configurado')
}

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: env.mercadoPagoAccessToken
})

export const mercadoPagoPreference = new Preference(mercadoPagoClient)
export const mercadoPagoPayment = new MercadoPagoPayment(mercadoPagoClient)

export function ensureMercadoPagoConfigured() {
  if (!env.mercadoPagoAccessToken) {
    throw new AppError('Mercado Pago não configurado', 500)
  }
}
