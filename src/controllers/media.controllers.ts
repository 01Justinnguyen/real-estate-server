import { Response, Request, NextFunction } from 'express'
import { handleUploadSingleImage } from '@/utils/file'
import asyncHandler from 'express-async-handler'

export const uploadAvatarController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await handleUploadSingleImage(req)
  res.json({
    result: data
  })
})
