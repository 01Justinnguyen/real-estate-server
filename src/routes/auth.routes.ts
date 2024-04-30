import { loginController, registerController } from '@/controllers/auth.controllers'
import { loginMiddleware, registerMiddleware } from '@/middleware/auth.middleware'
import { Router } from 'express'

const authRouter = Router()

/**
 * Description: Register an account
 * Path: /auth/register
 * Method: POST
 * Body: {name: string; email: string; password: string; phone: string; role: "USER" | "AGENT"}
 */
authRouter.post('/register', registerMiddleware, registerController)

/**
 * Description: Login a user
 * Path: /auth/login
 * Method: POST
 * Body: {phone:string'; password: string}
 */
authRouter.post('/login', loginMiddleware, loginController)

export default authRouter
