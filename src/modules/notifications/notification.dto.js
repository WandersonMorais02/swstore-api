export class NotificationDTO {
  constructor(notification) {
    this.id = notification._id
    this.userId = notification.userId
    this.type = notification.type
    this.title = notification.title
    this.message = notification.message
    this.data = notification.data
    this.readAt = notification.readAt
    this.isRead = !!notification.readAt
    this.createdAt = notification.createdAt
    this.updatedAt = notification.updatedAt
  }
}
