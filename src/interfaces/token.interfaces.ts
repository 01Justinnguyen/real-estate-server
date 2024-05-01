import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '@/constants/type'
import { PHONE_VERIFY } from '@/enums/userStatus'
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: typeof TokenType
  phone_verify: PHONE_VERIFY
}
