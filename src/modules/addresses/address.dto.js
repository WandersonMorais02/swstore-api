export class AddressDTO {
  constructor(address) {
    this.id = address._id
    this.customerId = address.customerId
    this.label = address.label
    this.recipientName = address.recipientName
    this.zipcode = address.zipcode
    this.street = address.street
    this.number = address.number
    this.complement = address.complement
    this.district = address.district
    this.city = address.city
    this.state = address.state
    this.isDefault = address.isDefault
    this.isActive = address.isActive
    this.createdAt = address.createdAt
    this.updatedAt = address.updatedAt
  }
}
