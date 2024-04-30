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

export const signTokenExpiresAt = (tokenExpiresIn: string) => {
  return addMilliseconds(new Date(), ms(tokenExpiresIn))
}
