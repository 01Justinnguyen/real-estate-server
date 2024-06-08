import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import authService from '@/services/auth.services'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import prisma from '@/database'
import { hashPassword } from '@/utils/crypto'
import { ROLE, User } from '@prisma/client'
import { handleError } from '@/utils/handleErrors'

export const registerMiddleware = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await RegisterBody.parseAsync(req.body)
    const existingUser = await authService.checkExistingUser({ phone: req.body.phone })
    if (existingUser) {
      return res.status(409).json({
        message: CLIENT_MESSAGE.USER_EXISTED
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

export const loginMiddleware = async (
  req: Request<ParamsDictionary, any, LoginBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await LoginBody.parseAsync(req.body)
    const user = await prisma.user.findUnique({
      where: {
        phone: req.body.phone,
        password: hashPassword(req.body.password)
      }
    })
    if (user === null) {
      return res.status(401).json({
        message: CLIENT_MESSAGE.EMAIL_OR_PASSWORD_IS_INCORRECT
      })
    }
    req.user = user as User
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

export const authorizeRole = (roles: ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.decoded_authorization?.role as ROLE)) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }
    next()
  }
}
