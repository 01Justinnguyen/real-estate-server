import envConfig from '@/config'
import { TokenType } from '@/constants/type'
import prisma from '@/database'
import { PHONE_VERIFY } from '@/enums/userStatus'
import { RegisterBodyType } from '@/schemaValidations/auth.schema'
import { hashPassword } from '@/utils/crypto'
import { signToken } from '@/utils/jwt'
import { config } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
config()
class AuthService {
  private signAccessToken({ user_id, phone_verify }: { user_id: string; phone_verify: PHONE_VERIFY }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, phone_verify },
      privateKey: envConfig.SECRET_JWT_ACCESS_TOKEN_KEY,
      options: { expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  private signRefreshToken({ user_id, phone_verify }: { user_id: string; phone_verify: PHONE_VERIFY }) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, phone_verify },
      privateKey: envConfig.SECRET_JWT_REFRESH_TOKEN_KEY,
      options: { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signEmailVerifyToken({ user_id, phone_verify }: { user_id: string; phone_verify: PHONE_VERIFY }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, phone_verify },
      privateKey: envConfig.SECRET_JWT_EMAIL_VERIFY_TOKEN_KEY,
      options: { expiresIn: envConfig.EMAIL_VERIFY_TOKEN_EXPIRES_IN }
    })
  }

  private signAccessAndRefreshToken({ user_id, phone_verify }: { user_id: string; phone_verify: PHONE_VERIFY }) {
    return Promise.all([
      this.signAccessToken({ user_id, phone_verify }),
      this.signRefreshToken({ user_id, phone_verify })
    ])
  }

  async checkExistingUser({ email, phone }: { email: string; phone: string }) {
    const existingUser = await prisma.user.findMany({
      where: {
        OR: [
          {
            email
          },
          {
            phone
          }
        ]
      }
    })

    return existingUser.length > 0
  }

  async register(payload: RegisterBodyType) {
    const user_id = uuidv4()
    const email_verify_token = await this.signEmailVerifyToken({ user_id, phone_verify: PHONE_VERIFY.UNVERIFY })
    console.log('🐻 ~ AuthService ~ register ~ email_verify_token:', email_verify_token)
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      phone_verify: PHONE_VERIFY.UNVERIFY
    })

    await Promise.all([
      prisma.user.create({
        data: {
          id: user_id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          email_verify_token: email_verify_token,
          role: payload.role,
          password: hashPassword(payload.password)
        }
      }),
      prisma.refreshToken.create({
        data: {
          userId: user_id,
          token: refresh_token
        }
      })
    ])

    return {
      access_token,
      refresh_token
    }
  }
}

const authService = new AuthService()

export default authService
