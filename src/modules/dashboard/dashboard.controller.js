import { dashboardService } from './dashboard.service.js'

async function admin(req, res) {
  const data = await dashboardService.admin()

  return res.json(data)
}

async function seller(req, res) {
  const data = await dashboardService.seller(req.user.id)

  return res.json(data)
}

async function customer(req, res) {
  const data = await dashboardService.customer(req.user.id)

  return res.json(data)
}

export const dashboardController = {
  admin,
  seller,
  customer
}
