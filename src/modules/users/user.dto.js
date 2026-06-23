export class UserDTO {
  constructor(user) {
    this.id = user._id
    this.name = user.name
    this.email = user.email
    this.role = user.role
    this.sellerProfile = user.sellerProfile
    this.isActive = user.isActive
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }
}
