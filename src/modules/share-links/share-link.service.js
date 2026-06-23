import { ShareLink } from './share-link.model.js'
import { ShareLinkDTO } from './share-link.dto.js'
import { License } from '../licenses/license.model.js'
import { Product } from '../products/product.model.js'

import { AppError } from '../../shared/errors/AppError.js'
import { generateHash } from '../../shared/utils/generateHash.js'

function isLicenseValid(license) {
  if (!license.isActive) return false
  if (license.expiresAt && license.expiresAt < new Date()) return false
  if (license.isPermanent) return true

  return license.downloadsUsed < license.downloadLimit
}

function canAccess(link) {
  if (!link.isActive) return false
  if (link.expiresAt < new Date()) return false
  if (link.accessUsed >= link.accessLimit) return false

  return true
}

async function createUniqueToken() {
  let token
  let exists = true

  while (exists) {
    token = generateHash('share')
    exists = await ShareLink.findOne({ token })
  }

  return token
}

async function create(customerId, data) {
  const license = await License.findOne({
    _id: data.licenseId,
    customerId,
    isActive: true
  })

  if (!license) {
    throw new AppError('Licença não encontrada', 404)
  }

  if (!isLicenseValid(license)) {
    throw new AppError('Licença inválida ou limite de downloads atingido', 400)
  }

  const product = await Product.findById(license.productId)

  if (!product) {
    throw new AppError('Produto não encontrado', 404)
  }

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + data.expiresInHours)

  const link = await ShareLink.create({
    customerId,
    licenseId: license._id,
    productId: license.productId,
    token: await createUniqueToken(),
    expiresAt,
    accessLimit: data.accessLimit,
    allowDownload: data.allowDownload,
    downloadConsumesLicense: true,
    isActive: true
  })

  return new ShareLinkDTO(link)
}

async function findMine(customerId) {
  const links = await ShareLink.find({ customerId })
    .populate('productId', 'name slug previewImages')
    .populate('licenseId', 'planName downloadLimit downloadsUsed isPermanent')
    .sort({ createdAt: -1 })

  return links.map(link => new ShareLinkDTO(link))
}

async function deactivate(id, currentUser) {
  const link = await ShareLink.findById(id)

  if (!link) {
    throw new AppError('Link compartilhado não encontrado', 404)
  }

  const isOwner = link.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode desativar esse link', 403)
  }

  link.isActive = false

  await link.save()

  return new ShareLinkDTO(link)
}

async function getPublicByToken(token) {
  const link = await ShareLink.findOne({ token })
    .populate('productId', 'name slug previewImages description')
    .populate('licenseId', 'planName downloadLimit downloadsUsed isPermanent isActive expiresAt')

  if (!link) {
    throw new AppError('Link inválido', 404)
  }

  if (!canAccess(link)) {
    throw new AppError('Link expirado ou limite de acessos atingido', 400)
  }

  return {
    id: link._id,
    product: link.productId,
    expiresAt: link.expiresAt,
    accessLimit: link.accessLimit,
    accessUsed: link.accessUsed,
    allowDownload: link.allowDownload,
    downloadUrl: link.allowDownload
      ? `/api/share-links/${link.token}/download`
      : null
  }
}

async function registerAccess(token) {
  const link = await ShareLink.findOne({ token })

  if (!link) {
    throw new AppError('Link inválido', 404)
  }

  if (!canAccess(link)) {
    throw new AppError('Link expirado ou limite de acessos atingido', 400)
  }

  link.accessUsed += 1

  await link.save()

  return new ShareLinkDTO(link)
}

async function getDownloadFileByToken(token) {
  const link = await ShareLink.findOne({ token })

  if (!link) {
    throw new AppError('Link inválido', 404)
  }

  if (!canAccess(link)) {
    throw new AppError('Link expirado ou limite de acessos atingido', 400)
  }

  if (!link.allowDownload) {
    throw new AppError('Download não permitido para este link', 403)
  }

  const license = await License.findById(link.licenseId)

  if (!license || !isLicenseValid(license)) {
    throw new AppError('Licença inválida ou limite de downloads atingido', 400)
  }

  const product = await Product.findById(link.productId)

  if (!product || !product.digitalFiles || product.digitalFiles.length === 0) {
    throw new AppError('Arquivo do produto não encontrado', 404)
  }

  const file = product.digitalFiles[0]

  if (!file.path) {
    throw new AppError('Arquivo sem caminho privado', 404)
  }

  link.accessUsed += 1

  if (link.downloadConsumesLicense && !license.isPermanent) {
    license.downloadsUsed += 1
    await license.save()
  }

  await link.save()

  return {
    path: file.path,
    filename: file.name
  }
}

export const shareLinkService = {
  create,
  findMine,
  deactivate,
  getPublicByToken,
  registerAccess,
  getDownloadFileByToken
}
