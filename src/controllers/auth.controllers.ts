import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { ParamsDictionary } from 'express-serve-static-core'
import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { RegisterBodyType, RegisterResType } from '@/schemaValidations/auth.schema'
import authService from '@/services/auth.services'

export const registerController = asyncHandler(
  async (req: Request<ParamsDictionary, any, RegisterBodyType>, res: Response<any>, next: NextFunction) => {
    const result = await authService.register(req.body)
    res.json({
      message: CLIENT_MESSAGE.REGISTER_SUCCESS,
      result
    })
  }
)
