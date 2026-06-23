import { AppError } from '../errors/AppError.js'

export function errorHandler(error, req, res, next) {
  console.error(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: error.errors
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: error.message
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'ID inválido'
    })
  }

  return res.status(500).json({
    message: 'Erro interno do servidor'
  })
}
