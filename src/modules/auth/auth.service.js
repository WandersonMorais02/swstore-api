import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import { User } from '../users/user.model.js'
import { UserDTO } from '../users/user.dto.js'
import { userService } from '../users/user.service.js'
import { AppError } from '../../shared/errors/AppError.js'

function generateToken(user) {
  return jwt.sign(
    {
      role: user.role
    },
    env.jwtSecret,
    {
      subject: user._id.toString(),
      expiresIn: env.jwtExpiresIn
    }
  )
}

async function register(data) {
  const user = await userService.create(data)

  return user
}

async function login(data) {
  const user = await User.findOne({ email: data.email }).select('+password')

  if (!user) {
    throw new AppError('Email ou senha inválidos', 401)
  }

  if (!user.isActive) {
    throw new AppError('Usuário inativo', 403)
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password)

  if (!passwordMatch) {
    throw new AppError('Email ou senha inválidos', 401)
  }

  const token = generateToken(user)

  return {
    token,
    user: new UserDTO(user)
  }
}

async function me(userId) {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return new UserDTO(user)
}

export const authService = {
  register,
  login,
  me
}
