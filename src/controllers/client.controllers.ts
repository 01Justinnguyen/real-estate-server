import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { TokenPayload } from '@/interfaces/token.interfaces'
import clientService from '@/services/client.services'
import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

export const getMeProfileController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = (req.decoded_authorization as TokenPayload).user_id
  const data = await clientService.getMeProfile(user_id)

  res.json({
    message: CLIENT_MESSAGE.GET_ME_SUCCESS,
    data
  })
})
