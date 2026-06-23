import { Setting } from './setting.model.js'
import { SettingDTO } from './setting.dto.js'

async function getOrCreate() {
  let setting = await Setting.findOne()

  if (!setting) {
    setting = await Setting.create({})
  }

  return setting
}

async function getPublicSettings() {
  const setting = await getOrCreate()

  return new SettingDTO(setting)
}

async function update(data) {
  const setting = await getOrCreate()

  Object.assign(setting, data)

  await setting.save()

  return new SettingDTO(setting)
}

async function getPlatformFeePercentForSeller(seller) {
  if (
    seller?.sellerProfile?.useCustomFee === true &&
    typeof seller?.sellerProfile?.customFeePercent === 'number'
  ) {
    return seller.sellerProfile.customFeePercent
  }

  const setting = await getOrCreate()

  return setting.platformFeePercent
}

export const settingService = {
  getOrCreate,
  getPublicSettings,
  update,
  getPlatformFeePercentForSeller
}
