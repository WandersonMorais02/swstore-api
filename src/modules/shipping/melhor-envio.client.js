import { env } from '../../config/env.js'
import { AppError } from '../../shared/errors/AppError.js'

export function ensureMelhorEnvioConfigured() {
  if (!env.melhorEnvioToken) {
    throw new AppError('Melhor Envio não configurado', 500)
  }
}

export async function melhorEnvioRequest(path, options = {}) {
  ensureMelhorEnvioConfigured()

  const response = await fetch(`${env.melhorEnvioBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.melhorEnvioToken}`,
      'User-Agent': 'Digital Commerce API',
      ...(options.headers || {})
    }
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new AppError(
      data?.message || 'Erro na comunicação com Melhor Envio',
      response.status
    )
  }

  return data
}
