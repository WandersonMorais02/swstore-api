import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import { routes } from './routes/index.js'
import { errorHandler } from './shared/middlewares/errorHandler.js'
import { notFound } from './shared/middlewares/notFound.js'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger.js'

export const app = express()

app.use(cors({
  origin: env.clientUrl,
  credentials: true
}))

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
)

app.use(morgan('dev'))

app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ extended: true, limit: '200mb' }))

app.use(cookieParser())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(
  '/uploads/public',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
  },
  express.static('uploads/public')
)

app.get('/', (req, res) => {
  return res.json({
    message: 'Digital Commerce API online'
  })
})

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)
