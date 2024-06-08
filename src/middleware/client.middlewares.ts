import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { TokenPayload } from '@/interfaces/token.interfaces'
import { UpdateProfileBody, UpdateProfileBodyType } from '@/schemaValidations/client.schema'
import authService from '@/services/auth.services'
import { handleError } from '@/utils/handleErrors'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const updateMeProfileMiddleware = async (
  req: Request<ParamsDictionary, any, UpdateProfileBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await UpdateProfileBody.parseAsync(req.body)
    const existingUser = await authService.checkExistingUser({
      id: (req.decoded_authorization as TokenPayload).user_id
    })
    if (!existingUser) {
      return res.status(404).json({
        message: CLIENT_MESSAGE.USER_NOT_FOUND
      })
    }
    next()
  } catch (errors) {
    handleError({
      errors,
      next,
      res,
      status: 422
    })
  }
}
