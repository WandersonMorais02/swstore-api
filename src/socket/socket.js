let ioInstance = null

export function setupSocket(io) {
  ioInstance = io

  io.on('connection', socket => {
    console.log(`🔌 Socket conectado: ${socket.id}`)

    socket.on('join:user', userId => {
      if (!userId) return

      socket.join(`user:${userId}`)

      console.log(`👤 Socket ${socket.id} entrou na sala user:${userId}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Socket desconectado: ${socket.id}`)
    })
  })
}

export function getIO() {
  return ioInstance
}

export function emitToUser(userId, event, payload) {
  if (!ioInstance || !userId) return

  ioInstance.to(`user:${userId}`).emit(event, payload)
}

export function emitToAdmin(event, payload) {
  if (!ioInstance) return

  ioInstance.to('role:ADMIN').emit(event, payload)
}
