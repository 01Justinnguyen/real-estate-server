import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import insertService from '@/services/insert.services'
import { roles } from '@/constants/roles'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'

const initRolesController = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  const response = insertService.initRoles(roles)

  res.json({
    message: CLIENT_MESSAGE.CREATE_ROLES_SUCCESS
  })
})

export default initRolesController
