import { AuthorizationHeaderSchema, RefreshTokenBody, RefreshTokenBodyType } from '@/schemaValidations/auth.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/utils/jwt'
import envConfig from '@/config'
import prisma from '@/database'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { authorizationHandleErrors } from '@/utils/handleErrors'

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
      return res.status(401).json({
        message: CLIENT_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXIST
      })
    }
    req.decoded_refresh_token = decoded_refresh_token
    req.refresh_token_id = refresh_token.id
    next()
  } catch (errors) {
    authorizationHandleErrors({
      errors,
      next,
      res,
      status: 401
    })
  }
}

export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: CLIENT_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
    })
  }
  try {
    AuthorizationHeaderSchema.parse(req.headers.authorization)
    const access_token = req.headers.authorization.split(' ')[1]

    if (access_token === undefined) {
      return res.status(401).json({
        message: CLIENT_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      })
    }

    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.SECRET_JWT_ACCESS_TOKEN_KEY as string
    })
    req.decoded_authorization = decoded_authorization
    next()
  } catch (errors) {
    authorizationHandleErrors({
      errors,
      next,
      res,
      status: 401
    })
  }
}
