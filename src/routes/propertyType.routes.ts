import { createNewPropertyTypeController, getPropertyTypesController } from '@/controllers/propertyType.controllers'
import { authorizeRole } from '@/middleware/auth.middlewares'
import { filterBodyRequestMiddleware } from '@/middleware/common.middlewares'
import { createNewPropertyTypeMiddleware } from '@/middleware/propertyType.middlewares'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import { PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { Router } from 'express'

const propertyTypeRouter = Router()

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
propertyTypeRouter.post(
  '/create',
  accessTokenValidator,
  authorizeRole(['ROLE1']),
  filterBodyRequestMiddleware<PropertyTypeBodyType>(['name', 'image', 'description']),
  createNewPropertyTypeMiddleware,
  createNewPropertyTypeController
)

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
propertyTypeRouter.get('/getPropertyTypes', getPropertyTypesController)

export default propertyTypeRouter
