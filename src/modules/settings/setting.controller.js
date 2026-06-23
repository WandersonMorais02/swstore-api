import { settingService } from './setting.service.js'
import { updateSettingSchema } from './setting.schema.js'

async function show(req, res) {
  const setting = await settingService.getPublicSettings()

  return res.json(setting)
}

async function update(req, res) {
  const data = updateSettingSchema.parse(req.body)

  const setting = await settingService.update(data)

  return res.json(setting)
}

export const settingController = {
  show,
  update
}
