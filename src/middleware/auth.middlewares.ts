import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import authService from '@/services/auth.services'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import prisma from '@/database'
import { hashPassword } from '@/utils/crypto'
import { ROLE, User } from '@prisma/client'

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
