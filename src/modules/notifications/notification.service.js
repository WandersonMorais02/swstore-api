import { Notification } from './notification.model.js'
import { NotificationDTO } from './notification.dto.js'
import { AppError } from '../../shared/errors/AppError.js'
import { emitToUser } from '../../socket/socket.js'

async function create(data) {
  const notification = await Notification.create(data)
  const dto = new NotificationDTO(notification)

  emitToUser(notification.userId.toString(), 'notification:new', dto)

  return dto
}

async function createMany(items = []) {
  const notifications = []

  for (const item of items) {
    const notification = await create(item)
    notifications.push(notification)
  }

  return notifications
}

async function findMine(userId, filters = {}) {
  const query = { userId }

  if (filters.unread === 'true') {
    query.readAt = null
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(filters.limit || 50))

  return notifications.map(item => new NotificationDTO(item))
}

async function unreadCount(userId) {
  const count = await Notification.countDocuments({
    userId,
    readAt: null
  })

  return { count }
}

async function markAsRead(id, userId) {
  const notification = await Notification.findOne({
    _id: id,
    userId
  })

  if (!notification) {
    throw new AppError('Notificação não encontrada', 404)
  }

  notification.readAt = new Date()

  await notification.save()

  return new NotificationDTO(notification)
}

async function markAllAsRead(userId) {
  await Notification.updateMany(
    {
      userId,
      readAt: null
    },
    {
      $set: {
        readAt: new Date()
      }
    }
  )

  return {
    message: 'Notificações marcadas como lidas'
  }
}

export const notificationService = {
  create,
  createMany,
  findMine,
  unreadCount,
  markAsRead,
  markAllAsRead
}
