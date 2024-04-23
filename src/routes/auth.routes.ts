import { testController } from '@/controllers/auth.controllers'
import { Router } from 'express'

const authRouter = Router()

authRouter.get('/test', testController)

export default authRouter
