import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { UPLOAD_TEMP_DIR } from '@/constants/dir'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true
    })
  }
}

export const handleUploadSingleImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
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

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (Object.entries(files).length === 0 && !Boolean(files.image)) {
        return reject(new Error(CLIENT_MESSAGE.FILE_IS_EMPTY))
      }
      resolve((files.file as File[])[0])
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  return fullname.split('.')[0]
}
