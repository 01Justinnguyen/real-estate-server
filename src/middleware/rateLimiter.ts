import { clientRedis } from '@/database/redis.config'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
config()

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.headers?.client_id

  const currentTime = Date.now() // ms

  const client = (await clientRedis.hGetAll(`rateLimit-${clientId}`)) as {
    createdAt: string
    count: string
    [x: string]: string
  }

  if (Object.keys(client).length === 0) {
    await clientRedis.hSet(`rateLimit-${clientId}`, 'createdAt', currentTime)
    await clientRedis.hSet(`rateLimit-${clientId}`, 'count', 1)

    return next()
  }

  let difference = (currentTime - Number(client.createdAt)) / 1000
  console.log('🐻 ~ rateLimiter ~ difference:', difference)

  if (difference >= Number(process.env.RATE_LIMIT_RESET)) {
    await clientRedis.hSet(`rateLimit-${clientId}`, 'createdAt', currentTime)
    await clientRedis.hSet(`rateLimit-${clientId}`, 'count', 1)

    return next()
  }

  if (Number(client.count) >= Number(process.env.RATE_LIMIT_COUNT)) {
    return res.status(429).json({
      message: 'Do not spam API!!!'
    })
  } else {
    await clientRedis.hSet(`rateLimit-${clientId}`, 'count', Number(client.count) + 1)

    return next()
  }
}

export default rateLimiter
