import initRolesController from '@/controllers/insert.controllers'
import { Router } from 'express'

const insertRouter = Router()

// init roles
insertRouter.post('/initRoles', initRolesController)

export default insertRouter
