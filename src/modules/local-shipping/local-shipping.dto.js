export class LocalShippingZoneDTO {
  constructor(zone) {
    this.id = zone._id
    this.city = zone.city
    this.state = zone.state
    this.zipcode = zone.zipcode
    this.name = zone.name
    this.isActive = zone.isActive
    this.createdAt = zone.createdAt
    this.updatedAt = zone.updatedAt
  }
}

export class LocalShippingPriceDTO {
  constructor(price) {
    this.id = price._id
    this.city = price.city
    this.state = price.state
    this.zipcode = price.zipcode
    this.originZoneId = price.originZoneId
    this.destinationZoneId = price.destinationZoneId
    this.price = price.price
    this.deliveryTime = price.deliveryTime
    this.isBidirectional = price.isBidirectional
    this.isActive = price.isActive
    this.createdAt = price.createdAt
    this.updatedAt = price.updatedAt
  }
}
