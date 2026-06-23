import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

import { ensureDir } from '../../shared/utils/ensureDir.js'

const tempFolder = path.resolve('uploads', 'temp')

ensureDir(tempFolder)

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, tempFolder)
  },

  filename(req, file, callback) {
    const hash = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname)
    const filename = `${hash}${ext}`

    callback(null, filename)
  }
})

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
})
