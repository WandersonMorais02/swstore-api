import { downloadService } from './download.service.js'

async function downloadByHash(req, res) {
  const file = await downloadService.getDownloadFileByHash(
    req.params.hash,
    req.user
  )

  return res.download(file.absolutePath, file.filename)
}

export const downloadController = {
  downloadByHash
}
