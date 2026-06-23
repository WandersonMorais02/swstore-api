import path from 'path'
import fs from 'fs'

import { License } from '../licenses/license.model.js'
import { Product } from '../products/product.model.js'
import { AppError } from '../../shared/errors/AppError.js'

function canDownload(license) {
  if (!license.isActive) return false

  if (license.expiresAt && license.expiresAt < new Date()) return false

  if (license.isPermanent) return true

  return license.downloadsUsed < license.downloadLimit
}

async function getDownloadFileByHash(hash, currentUser) {
  const license = await License.findOne({ downloadHash: hash })

  if (!license) {
    throw new AppError('Link de download inválido', 404)
  }

  const isOwner = license.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode baixar esse arquivo', 403)
  }

  if (!canDownload(license)) {
    throw new AppError('Limite de downloads atingido ou licença inativa', 400)
  }

  const product = await Product.findById(license.productId)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  if (!product.digitalFiles || product.digitalFiles.length === 0) {
    throw new AppError('Arquivo digital não encontrado', 404)
  }

  const file = product.digitalFiles[0]

  if (!file.path) {
    throw new AppError('Caminho do arquivo não encontrado', 404)
  }

  const absolutePath = path.resolve(file.path)

  if (!fs.existsSync(absolutePath)) {
    throw new AppError('Arquivo não existe no servidor', 404)
  }

  if (!license.isPermanent) {
    license.downloadsUsed += 1
    await license.save()
  }

  return {
    absolutePath,
    filename: file.name || path.basename(absolutePath)
  }
}

export const downloadService = {
  getDownloadFileByHash
}
