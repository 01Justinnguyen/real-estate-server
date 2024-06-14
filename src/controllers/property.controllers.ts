import asyncHandler from 'express-async-handler'
import { Response, Request, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const createNewPropertyController = asyncHandler(
  async (req: Request<ParamsDictionary, any, any>, res: Response<any>, next: NextFunction) => {}
)
