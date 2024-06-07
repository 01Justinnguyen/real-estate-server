import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '@/controllers/auth.controllers'
import { authorizeRole, loginMiddleware, registerMiddleware } from '@/middleware/auth.middlewares'
import { accessTokenValidator, refreshTokenValidator } from '@/middleware/token.middlewares'
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

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: {refresh_token: string}
 */
authRouter.post('/refresh-token', refreshTokenValidator, refreshTokenController)

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <token>}
 * Body: {refresh_token: string}
 */
authRouter.post('/logout', accessTokenValidator, authorizeRole(['USER']), refreshTokenValidator, logoutController)

export default authRouter
