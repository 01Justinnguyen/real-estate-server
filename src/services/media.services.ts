import { UPLOAD_DIR } from '@/constants/dir'
import { getNameFromFullname, handleUploadSingleImage } from '@/utils/file'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import fs from 'node:fs'
import { isProduction } from '@/constants/config'
import envConfig from '@/config'

class MediaService {
  async uploadSingleimage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    sharp.cache(false)
    await sharp(file.filepath)
      .jpeg({
        quality: 90
      })
      .toFile(newPath)
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${envConfig.API_URL_PRODUCTION}/static/${newName}.jpg`
      : `http://localhost:${envConfig.LOCAL_DEV_PORT}/static/${newName}.jpg`
  }
}

const mediaService = new MediaService()

export default mediaService
