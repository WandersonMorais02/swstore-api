import { favoriteService } from './favorite.service.js'
import { addFavoriteSchema } from './favorite.schema.js'

async function add(req, res) {
  const data = addFavoriteSchema.parse(req.body)

  const favorite = await favoriteService.add(req.user.id, data)

  return res.status(201).json(favorite)
}

async function remove(req, res) {
  const result = await favoriteService.remove(
    req.user.id,
    req.params.productId
  )

  return res.json(result)
}

async function toggle(req, res) {
  const data = addFavoriteSchema.parse(req.body)

  const result = await favoriteService.toggle(req.user.id, data)

  return res.json(result)
}

async function mine(req, res) {
  const favorites = await favoriteService.findMine(req.user.id)

  return res.json(favorites)
}

async function check(req, res) {
  const result = await favoriteService.isFavorite(
    req.user.id,
    req.params.productId
  )

  return res.json(result)
}

export const favoriteController = {
  add,
  remove,
  toggle,
  mine,
  check
}
