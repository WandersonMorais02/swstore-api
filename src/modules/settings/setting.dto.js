export class SettingDTO {
  constructor(setting) {
    this.id = setting._id
    this.platformName = setting.platformName
    this.platformFeePercent = setting.platformFeePercent
    this.payoutMode = setting.payoutMode
    this.payoutSchedule = setting.payoutSchedule
    this.currency = setting.currency
    this.createdAt = setting.createdAt
    this.updatedAt = setting.updatedAt
  }
}
