import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { ParamsDictionary } from 'express-serve-static-core'
import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType
} from '@/schemaValidations/auth.schema'
import authService from '@/services/auth.services'
import { User } from '@prisma/client'
import { PHONE_VERIFY } from '@/enums/userStatus'
import { TokenPayload } from '@/interfaces/token.interfaces'

export const registerController = asyncHandler(
  async (req: Request<ParamsDictionary, any, RegisterBodyType>, res: Response<RegisterResType>, next: NextFunction) => {
    const result = await authService.register(req.body)
    res.json({
      message: CLIENT_MESSAGE.REGISTER_SUCCESS,
      data: {
        ...result
      }
    })
  }
)

export const loginController = asyncHandler(
  async (req: Request<ParamsDictionary, any, LoginBodyType>, res: Response<any>, next: NextFunction) => {
    const user = req.user as User
    const { id } = user
    const phone_verify = user.phone_verify as PHONE_VERIFY
    const result = await authService.login({ user_id: id, phone_verify })

    res.json({
      message: CLIENT_MESSAGE.LOGIN_SUCCESS,
      data: {
        result
      }
    })
  }
)

export const refreshTokenController = asyncHandler(
  async (req: Request<ParamsDictionary, any, RefreshTokenBodyType>, res: Response<RefreshTokenResType>) => {
    const { refresh_token } = req.body
    const refresh_token_id = req.refresh_token_id as string
    const { user_id, phone_verify } = req.decoded_refresh_token as TokenPayload

    const result = await authService.refreshToken({ user_id, refresh_token, phone_verify, refresh_token_id })

    res.json({
      message: CLIENT_MESSAGE.REFRESH_TOKEN_SUCCESS,
      data: {
        ...result
      }
    })
  }
)
