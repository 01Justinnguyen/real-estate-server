import { uploadAvatarController } from '@/controllers/media.controllers'
import { authorizeRole } from '@/middleware/auth.middlewares'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import { Router } from 'express'

const mediaRouter = Router()

mediaRouter.post('/upload-avatar', accessTokenValidator, authorizeRole(['AGENT', 'USER']), uploadAvatarController)

export default mediaRouter
