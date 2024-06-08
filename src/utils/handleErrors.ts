import { HttpStatusCode } from '@/constants/httpStatus'
import { NextFunction, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ZodError } from 'zod'

export const handleError = ({
  res,
  next,
  errors,
  status
}: {
  res: Response
  next: NextFunction
  errors: any
  status: HttpStatusCode
}) => {
  let err = errors
  if (err instanceof ZodError) {
    err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
    return res.status(status).json({
      message: 'Unprocessable Entity',
      errors: err
    })
  } else {
    next(err)
  }
}

export const authorizationHandleErrors = ({
  res,
  next,
  errors,
  status
}: {
  res: Response
  next: NextFunction
  errors: any
  status: HttpStatusCode
}) => {
  let err = errors
  if (err instanceof ZodError) {
    err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
    return res.status(status).json({
      status: 'failed',
      error: err
    })
  } else if (err instanceof JsonWebTokenError) {
    return res.status(status).json({
      message: capitalize(err.message)
    })
  } else {
    next(err)
  }
}
