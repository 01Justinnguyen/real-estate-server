import { TokenPayload } from '@/interfaces/token.interfaces'
import { User } from '@prisma/client'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
    decoded_refresh_token?: TokenPayload
    decoded_authorization?: TokenPayload
    refresh_token_id?: string
  }
}
