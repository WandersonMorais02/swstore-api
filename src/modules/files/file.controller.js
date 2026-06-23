import { fileService } from './file.service.js'

async function uploadProductPreview(req, res) {
  const file = await fileService.uploadProductPreview(req.file)

  return res.status(201).json(file)
}

async function uploadProductOriginal(req, res) {
  const file = await fileService.uploadProductOriginal(req.file)

  return res.status(201).json(file)
}

async function uploadCategoryImage(req, res) {
  const file = await fileService.uploadCategoryImage(req.file)

  return res.status(201).json(file)
}

export const fileController = {
  uploadProductPreview,
  uploadProductOriginal,
  uploadCategoryImage
}
