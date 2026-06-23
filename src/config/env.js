import 'dotenv/config'

export const env = {
  port: process.env.PORT || 3333,
  nodeEnv: process.env.NODE_ENV || 'development',

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  cookieName: process.env.COOKIE_NAME || 'digital_commerce_token',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:3333',

  uploadDir: process.env.UPLOAD_DIR || 'uploads',

  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  mercadoPagoWebhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET,

  melhorEnvioToken: process.env.MELHOR_ENVIO_TOKEN,
  melhorEnvioBaseUrl: process.env.MELHOR_ENVIO_BASE_URL || 'https://www.melhorenvio.com.br'
}
