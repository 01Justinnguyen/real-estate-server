import { Response, Request, NextFunction } from 'express'
import { handleUploadSingleImage } from '@/utils/file'
import asyncHandler from 'express-async-handler'
import mediaService from '@/services/media.services'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'

export const uploadAvatarController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const image_url = await mediaService.uploadSingleimage(req)
  res.json({
    message: CLIENT_MESSAGE.UPLOAD_SUCCESS,
    data: image_url
  })
})
