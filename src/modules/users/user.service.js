import bcrypt from 'bcryptjs'

import { User } from './user.model.js'
import { UserDTO } from './user.dto.js'
import { AppError } from '../../shared/errors/AppError.js'

async function create(data) {
  const emailExists = await User.findOne({ email: data.email })

  if (emailExists) {
    throw new AppError('Email já cadastrado', 409)
  }

  const usersCount = await User.countDocuments()

  const passwordHash = await bcrypt.hash(data.password, 8)

  let role = data.role || 'CUSTOMER'

  if (usersCount === 0) {
    role = 'ADMIN'
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: passwordHash,
    role,
    avatar: data.avatar,
    sellerProfile: role === 'SELLER'
      ? {
          storeName: data.sellerProfile?.storeName,
          document: data.sellerProfile?.document,
          phone: data.sellerProfile?.phone,
          customFeePercent: data.sellerProfile?.customFeePercent ?? null,
          useCustomFee: data.sellerProfile?.useCustomFee ?? false,
          isApproved: false
        }
      : undefined
  })

  return new UserDTO(user)
}

async function findAll(filters = {}) {
  const query = {}

  if (filters.role) {
    query.role = filters.role
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive
  }

  const users = await User.find(query).sort({ createdAt: -1 })

  return users.map(user => new UserDTO(user))
}

async function findById(id) {
  const user = await User.findById(id)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return new UserDTO(user)
}

async function update(id, data) {
  const user = await User.findById(id)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  if (data.email && data.email !== user.email) {
    const emailExists = await User.findOne({ email: data.email })

    if (emailExists) {
      throw new AppError('Email já cadastrado', 409)
    }
  }

  Object.assign(user, data)

  await user.save()

  return new UserDTO(user)
}

async function updateMe(userId, data) {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  const allowedData = {}

  if (data.name !== undefined) {
    allowedData.name = data.name
  }

  if (data.avatar !== undefined) {
    allowedData.avatar = data.avatar
  }

  Object.assign(user, allowedData)

  await user.save()

  return new UserDTO(user)
}

async function remove(id) {
  const user = await User.findById(id)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  await user.deleteOne()

  return {
    message: 'Usuário removido com sucesso'
  }
}

export const userService = {
  create,
  findAll,
  findById,
  update,
  updateMe,
  remove
}
