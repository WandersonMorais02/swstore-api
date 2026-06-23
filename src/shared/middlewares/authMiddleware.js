import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import { User } from '../../modules/users/user.model.js'
import { AppError } from '../errors/AppError.js'

export async function authMiddleware(req, res, next) {
  const cookieToken = req.cookies?.[env.cookieName]

  const authHeader = req.headers.authorization
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  const token = cookieToken || bearerToken

  if (!token) {
    throw new AppError('Token não informado', 401)
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret)

    const user = await User.findById(decoded.sub)

    if (!user || !user.isActive) {
      throw new AppError('Usuário não autorizado', 401)
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    }

    return next()
  } catch {
    throw new AppError('Token inválido ou expirado', 401)
  }
}
