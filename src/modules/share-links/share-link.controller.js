import path from 'path'
import fs from 'fs'

import { shareLinkService } from './share-link.service.js'
import { createShareLinkSchema } from './share-link.schema.js'
import { AppError } from '../../shared/errors/AppError.js'

async function create(req, res) {
  const data = createShareLinkSchema.parse(req.body)

  const link = await shareLinkService.create(req.user.id, data)

  return res.status(201).json(link)
}

async function mine(req, res) {
  const links = await shareLinkService.findMine(req.user.id)

  return res.json(links)
}

async function deactivate(req, res) {
  const link = await shareLinkService.deactivate(req.params.id, req.user)

  return res.json(link)
}

async function showPublic(req, res) {
  const data = await shareLinkService.getPublicByToken(req.params.token)

  return res.json(data)
}

async function registerAccess(req, res) {
  const link = await shareLinkService.registerAccess(req.params.token)

  return res.json(link)
}

async function download(req, res) {
  const file = await shareLinkService.getDownloadFileByToken(req.params.token)

  const absolutePath = path.resolve(file.path)

  if (!fs.existsSync(absolutePath)) {
    throw new AppError('Arquivo não encontrado no servidor', 404)
  }

  return res.download(absolutePath, file.filename)
}

export const shareLinkController = {
  create,
  mine,
  deactivate,
  showPublic,
  registerAccess,
  download
}
