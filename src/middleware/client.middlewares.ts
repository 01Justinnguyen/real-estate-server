import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { TokenPayload } from '@/interfaces/token.interfaces'
import { UpdateProfileBody, UpdateProfileBodyType } from '@/schemaValidations/client.schema'
import authService from '@/services/auth.services'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ZodError } from 'zod'

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
  } catch (error) {
    let err = error
    if (err instanceof ZodError) {
      err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
      return res.status(422).json({
        message: 'Unprocessable Entity',
        errors: err
      })
    } else {
      next(err)
    }
  }
}
