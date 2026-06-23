import { License } from './license.model.js'
import { LicenseDTO } from './license.dto.js'
import { AppError } from '../../shared/errors/AppError.js'

function canDownload(license) {
  if (!license.isActive) {
    return false
  }

  if (license.expiresAt && license.expiresAt < new Date()) {
    return false
  }

  if (license.isPermanent) {
    return true
  }

  return license.downloadsUsed < license.downloadLimit
}

async function findMine(customerId) {
  const licenses = await License.find({ customerId })
    .populate('productId', 'name slug previewImages')
    .populate('orderId', 'code status createdAt')
    .sort({ createdAt: -1 })

  return licenses.map(license => new LicenseDTO(license))
}

async function findById(id, currentUser) {
  const license = await License.findById(id)
    .populate('productId', 'name slug previewImages')
    .populate('orderId', 'code status createdAt')

  if (!license) {
    throw new AppError('Licença não encontrada', 404)
  }

  const isOwner = license.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode acessar essa licença', 403)
  }

  return new LicenseDTO(license)
}

async function getDownloadLink(id, currentUser) {
  const license = await License.findById(id)

  if (!license) {
    throw new AppError('Licença não encontrada', 404)
  }

  const isOwner = license.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode baixar esse arquivo', 403)
  }

  if (!canDownload(license)) {
    throw new AppError('Limite de downloads atingido ou licença inativa', 400)
  }

  return {
    downloadUrl: `/api/downloads/${license.downloadHash}`
  }
}

export const licenseService = {
  findMine,
  findById,
  getDownloadLink
}
