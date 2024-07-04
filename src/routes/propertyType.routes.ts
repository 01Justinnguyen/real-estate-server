import {
  createNewPropertyTypeController,
  deleteAllPropertyTypeController,
  deletePropertyTypeController,
  getPropertyTypesController,
  updatePropertyTypeController
} from '@/controllers/propertyType.controllers'
import { authorizeRole } from '@/middleware/auth.middlewares'
import { filterBodyRequestMiddleware } from '@/middleware/common.middlewares'
import { createNewPropertyTypeMiddleware } from '@/middleware/propertyType.middlewares'
import rateLimiter from '@/middleware/rateLimiter'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import { PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { Router } from 'express'

const propertyTypeRouter = Router()

propertyTypeRouter.use(rateLimiter)

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
propertyTypeRouter.get('/getPropertyTypes', accessTokenValidator, authorizeRole(['ROLE1']), getPropertyTypesController)

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
propertyTypeRouter.patch(
  '/updatePropertyType/:id',
  accessTokenValidator,
  authorizeRole(['ROLE1']),
  updatePropertyTypeController
)

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
propertyTypeRouter.delete(
  '/deletePropertyType/:id',
  accessTokenValidator,
  authorizeRole(['ROLE1']),
  deletePropertyTypeController
)

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
propertyTypeRouter.delete(
  '/deleteAllPropertyType',
  accessTokenValidator,
  authorizeRole(['ROLE1']),
  deleteAllPropertyTypeController
)

export default propertyTypeRouter
