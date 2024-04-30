import { User } from '@prisma/client'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
  }
}
