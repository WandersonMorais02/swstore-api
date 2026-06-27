import { userService } from './user.service.js'
import {
  createUserSchema,
  updateUserSchema,
  updateMeSchema
} from './user.schema.js'

async function create(req, res) {
  const data = createUserSchema.parse(req.body)

  const user = await userService.create(data)

  return res.status(201).json(user)
}

async function index(req, res) {
  const users = await userService.findAll(req.query)

  return res.json(users)
}

async function show(req, res) {
  const user = await userService.findById(req.params.id)

  return res.json(user)
}

async function update(req, res) {
  const data = updateUserSchema.parse(req.body)

  const user = await userService.update(req.params.id, data)

  return res.json(user)
}

async function updateMe(req, res) {
  const data = updateMeSchema.parse(req.body)

  const user = await userService.updateMe(req.user.id, data)

  return res.json(user)
}

async function remove(req, res) {
  const result = await userService.remove(req.params.id)

  return res.json(result)
}

export const userController = {
  create,
  index,
  show,
  update,
  updateMe,
  remove
}
