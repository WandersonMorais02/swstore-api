import mongoose from 'mongoose'
import { env } from '../config/env.js'

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri)
    console.log('✅ MongoDB conectado')
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message)
    process.exit(1)
  }
}
