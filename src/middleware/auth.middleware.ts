import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import authService from '@/services/auth.services'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
export const registerMiddleware = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await RegisterBody.parseAsync(req.body)
    const existingUser = await authService.checkExistingUser({ email: req.body.email, phone: req.body.phone })
    if (existingUser) {
      return res.status(409).json({
        message: CLIENT_MESSAGE.USER_EXISTED
      })
    }
    next()
  } catch (error) {
    let err = error
    if (err instanceof ZodError) {
      err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
      return res.status(422).json({
        status: 'failed',
        error: err
      })
    } else {
      next(err)
    }
  }
}
