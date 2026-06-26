import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import { ensureDir } from '../../shared/utils/ensureDir.js'
import { AppError } from '../../shared/errors/AppError.js'

function getPublicUrl(filePath) {
  return `/${filePath.replaceAll('\\', '/')}`
}

function isImage(mimeType) {
  return [
    'image/jpeg',
    'image/png',
    'image/webp'
  ].includes(mimeType)
}

async function removeTemp(filePath) {
  try {
    await fs.unlink(filePath)
  } catch {}
}

async function uploadProductPreview(file) {
  if (!file) {
    throw new AppError('Arquivo não enviado', 400)
  }

  if (!isImage(file.mimetype)) {
    await removeTemp(file.path)
    throw new AppError('Preview precisa ser uma imagem JPG, PNG ou WEBP', 400)
  }

  const outputDir = path.resolve('uploads', 'public', 'previews')
  ensureDir(outputDir)

  const filename = `${path.parse(file.filename).name}.webp`
  const outputPath = path.join(outputDir, filename)

  await sharp(file.path)
    .resize({
      width: 1200,
      withoutEnlargement: true
    })
    .webp({ quality: 72 })
    .toFile(outputPath)

  await removeTemp(file.path)

  const relativePath = path.join('uploads', 'public', 'previews', filename)

  return {
    name: file.originalname,
    url: getPublicUrl(relativePath),
    path: relativePath,
    mimeType: 'image/webp',
    size: file.size
  }
}

async function uploadProductOriginal(file) {
  if (!file) {
    throw new AppError('Arquivo não enviado', 400)
  }

  const allowedTypes = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    await removeTemp(file.path)
    throw new AppError('Tipo de arquivo original não permitido', 400)
  }

  const outputDir = path.resolve('uploads', 'private', 'originals')
  ensureDir(outputDir)

  const outputPath = path.join(outputDir, file.filename)

  await fs.rename(file.path, outputPath)

  const relativePath = path.join('uploads', 'private', 'originals', file.filename)

  return {
    name: file.originalname,
    url: null,
    path: relativePath,
    mimeType: file.mimetype,
    size: file.size
  }
}

async function uploadCategoryImage(file) {
  if (!file) {
    throw new AppError('Arquivo não enviado', 400)
  }

  if (!isImage(file.mimetype)) {
    await removeTemp(file.path)
    throw new AppError('Imagem da categoria precisa ser JPG, PNG ou WEBP', 400)
  }

  const outputDir = path.resolve('uploads', 'public', 'categories')
  ensureDir(outputDir)

  const filename = `${path.parse(file.filename).name}.webp`
  const outputPath = path.join(outputDir, filename)

  await sharp(file.path)
    .resize({
      width: 800,
      withoutEnlargement: true
    })
    .webp({ quality: 70 })
    .toFile(outputPath)

  await removeTemp(file.path)

  const relativePath = path.join('uploads', 'public', 'categories', filename)

  return {
    name: file.originalname,
    url: getPublicUrl(relativePath),
    path: relativePath,
    mimeType: 'image/webp',
    size: file.size
  }
}

async function uploadUserAvatar(file) {
  if (!file) {
    throw new AppError('Arquivo não enviado', 400)
  }

  if (!isImage(file.mimetype)) {
    await removeTemp(file.path)
    throw new AppError('Foto precisa ser JPG, PNG ou WEBP', 400)
  }

  const outputDir = path.resolve('uploads', 'public', 'avatars')
  ensureDir(outputDir)

  const filename = `${path.parse(file.filename).name}.webp`
  const outputPath = path.join(outputDir, filename)

  await sharp(file.path)
    .resize({
      width: 400,
      height: 400,
      fit: 'cover'
    })
    .webp({ quality: 75 })
    .toFile(outputPath)

  await removeTemp(file.path)

  const relativePath = path.join('uploads', 'public', 'avatars', filename)

  return {
    name: file.originalname,
    url: getPublicUrl(relativePath),
    path: relativePath,
    mimeType: 'image/webp',
    size: file.size
  }
}

export const fileService = {
  uploadProductPreview,
  uploadProductOriginal,
  uploadCategoryImage,
  uploadUserAvatar
}
