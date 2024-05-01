import { RefreshTokenBody, RefreshTokenBodyType } from '@/schemaValidations/auth.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/utils/jwt'
import envConfig from '@/config'
import prisma from '@/database'
import { ZodError } from 'zod'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { TokenPayload } from '@/interfaces/token.interfaces'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

export const refreshTokenValidator = async (
  req: Request<ParamsDictionary, any, RefreshTokenBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const [decoded_refresh_token, refresh_token] = await Promise.all([
      verifyToken({
        token: req.body.refresh_token,
        secretOrPublicKey: envConfig.SECRET_JWT_REFRESH_TOKEN_KEY
      }),
      prisma.refreshToken.findFirst({
        where: {
          token: req.body.refresh_token
        }
      })
    ])
    if (refresh_token === null) {
      return res.status(404).json({
        message: CLIENT_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXIST
      })
    }
    req.decoded_refresh_token = decoded_refresh_token
    req.refresh_token_id = refresh_token.id
    next()
  } catch (error) {
    let err = error
    if (err instanceof ZodError) {
      err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
      return res.status(422).json({
        status: 'failed',
        error: err
      })
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: capitalize(err.message)
      })
    } else {
      next(err)
    }
  }
}
