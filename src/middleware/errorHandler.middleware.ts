import { Request, Response, NextFunction } from 'express'

export const badRequestException = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found.`)
  res.status(404)
  next(error)
}

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({
    err
  })
}
