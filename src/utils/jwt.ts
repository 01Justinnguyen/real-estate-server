import { TokenPayload } from '@/interfaces/token.interfaces'
import { addMilliseconds } from 'date-fns'
import jwt, { SignOptions } from 'jsonwebtoken'
import ms from 'ms'

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }
      resolve(decoded as TokenPayload)
    })
  })
}

export const signTokenExpiresAt = (tokenExpiresIn: string) => {
  return addMilliseconds(new Date(), ms(tokenExpiresIn))
}
