import http from 'http'
import { Server } from 'socket.io'

import { app } from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './database/connect.js'
import { setupSocket } from './socket/socket.js'

async function bootstrap() {
  await connectDatabase()

  const httpServer = http.createServer(app)

  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  })

  setupSocket(io)

  httpServer.listen(env.port, () => {
    console.log(`🚀 API rodando na porta ${env.port}`)
  })
}

bootstrap()
