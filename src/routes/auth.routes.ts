import { registerController } from '@/controllers/auth.controllers'
import { registerMiddleware } from '@/middleware/auth.middleware'
import { Router } from 'express'

const authRouter = Router()

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
authRouter.post('/register', registerMiddleware, registerController)

export default authRouter
