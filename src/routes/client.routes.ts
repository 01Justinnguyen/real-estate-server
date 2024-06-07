import { getMeProfileController, updateMeProfileController } from '@/controllers/client.controllers'
import { updateMeProfileMiddleware } from '@/middleware/client.middlewares'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import { Router } from 'express'

const clientRouter = Router()

// get profile
clientRouter.get('/getMeProfile', accessTokenValidator, getMeProfileController)

// update profile
clientRouter.patch('/updateMeProfile', accessTokenValidator, updateMeProfileMiddleware, updateMeProfileController)

export default clientRouter
