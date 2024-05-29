import { getMeProfileController } from '@/controllers/client.controllers'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import { Router } from 'express'

const clientRouter = Router()

clientRouter.get('/getMeProfile', accessTokenValidator, getMeProfileController)

export default clientRouter
