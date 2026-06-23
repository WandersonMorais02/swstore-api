import { AppError } from '../errors/AppError.js'

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Acesso negado', 403)
    }

    return next()
  }
}
