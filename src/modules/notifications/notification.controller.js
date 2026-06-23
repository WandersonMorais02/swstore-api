import { notificationService } from './notification.service.js'

async function mine(req, res) {
  const notifications = await notificationService.findMine(req.user.id, req.query)

  return res.json(notifications)
}

async function count(req, res) {
  const result = await notificationService.unreadCount(req.user.id)

  return res.json(result)
}

async function read(req, res) {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user.id
  )

  return res.json(notification)
}

async function readAll(req, res) {
  const result = await notificationService.markAllAsRead(req.user.id)

  return res.json(result)
}

export const notificationController = {
  mine,
  count,
  read,
  readAll
}
