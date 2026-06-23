import { licenseService } from './license.service.js'

async function mine(req, res) {
  const licenses = await licenseService.findMine(req.user.id)

  return res.json(licenses)
}

async function show(req, res) {
  const license = await licenseService.findById(req.params.id, req.user)

  return res.json(license)
}

async function getDownloadLink(req, res) {
  const result = await licenseService.getDownloadLink(req.params.id, req.user)

  return res.json(result)
}

export const licenseController = {
  mine,
  show,
  getDownloadLink
}
