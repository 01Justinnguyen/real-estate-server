import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import prisma from '@/database'
import { PropertyTypeBody, PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { handleError } from '@/utils/handleErrors'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const createNewPropertyTypeMiddleware = async (
  req: Request<ParamsDictionary, any, PropertyTypeBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    await PropertyTypeBody.parseAsync(req.body)
    const existingPropertyType = await prisma.propertyType.findFirst({
      where: {
        name: req.body.name
      }
    })
    if (existingPropertyType) {
      return res.status(409).json({
        message: CLIENT_MESSAGE.PROPERTY_TYPE_EXISTED
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
