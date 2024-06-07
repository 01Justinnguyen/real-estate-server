import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { Request, Response } from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const initFolder = () => {
  if (!fs.existsSync(path.resolve('uploads'))) {
    const uploadFolderPath = path.resolve('uploads')
    fs.mkdirSync(uploadFolderPath, {
      recursive: false
    })
  }
}

export const handleUploadSingleImage = (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 500 * 1024, // 500KB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'file' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (Object.entries(files).length === 0 && !Boolean(files.image)) {
        return reject(new Error(CLIENT_MESSAGE.FILE_IS_EMPTY))
      }
      resolve(files)
    })
  })
}
