import { sellerWalletService } from './seller-wallet.service.js'
import { upsertSellerWalletSchema } from './seller-wallet.schema.js'

async function mine(req, res) {
  const wallet = await sellerWalletService.getMine(req.user.id)

  return res.json(wallet)
}

async function upsertMine(req, res) {
  const data = upsertSellerWalletSchema.parse(req.body)

  const wallet = await sellerWalletService.upsertMine(req.user.id, data)

  return res.json(wallet)
}

async function index(req, res) {
  const wallets = await sellerWalletService.findAll()

  return res.json(wallets)
}

async function verify(req, res) {
  const wallet = await sellerWalletService.verify(req.params.id)

  return res.json(wallet)
}

export const sellerWalletController = {
  mine,
  upsertMine,
  index,
  verify
}
