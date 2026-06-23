import { env } from '../../config/env.js'
import { authService } from './auth.service.js'
import { loginSchema, registerSchema } from './auth.schema.js'

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

async function register(req, res) {
  const data = registerSchema.parse(req.body)

  const user = await authService.register(data)

  return res.status(201).json(user)
}

async function login(req, res) {
  const data = loginSchema.parse(req.body)

  const { token, user } = await authService.login(data)

  res.cookie(env.cookieName, token, cookieOptions())

  return res.json({
    token,
    user
  })
}

async function me(req, res) {
  const user = await authService.me(req.user.id)

  return res.json(user)
}

async function logout(req, res) {
  res.clearCookie(env.cookieName, cookieOptions())

  return res.json({
    message: 'Logout realizado com sucesso'
  })
}

export const authController = {
  register,
  login,
  me,
  logout
}
