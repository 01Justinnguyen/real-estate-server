import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '@/constants/type'
import { PHONE_VERIFY } from '@/enums/userStatus'
import { ROLE } from '@prisma/client'
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: typeof TokenType
  phone_verify: PHONE_VERIFY
  role: ROLE
}
