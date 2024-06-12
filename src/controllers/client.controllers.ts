import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { TokenPayload } from '@/interfaces/token.interfaces'
import { UpdateProfileBodyType } from '@/schemaValidations/client.schema'
import clientService from '@/services/client.services'
import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ParamsDictionary } from 'express-serve-static-core'

export const getMeProfileController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = (req.decoded_authorization as TokenPayload).user_id
  const data = await clientService.getMeProfile(user_id)

  res.json({
    message: CLIENT_MESSAGE.GET_ME_SUCCESS,
    data
  })
})

export const updateMeProfileController = asyncHandler(
  async (req: Request<ParamsDictionary, any, UpdateProfileBodyType>, res: Response, next: NextFunction) => {
    const user_id = (req.decoded_authorization as TokenPayload).user_id
    const newData = {
      ...req.body,
      date_of_birth: new Date(req.body.date_of_birth as string)
    }
    const data = await clientService.updateMeProfile({
      user_id,
      data: newData
    })

    res.json({
      message: CLIENT_MESSAGE.UPDATE_ME_SUCCESS,
      data
    })
  }
)
