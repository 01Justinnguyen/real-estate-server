import { config } from 'dotenv'
import { createClient } from 'redis'
config()

export const clientRedis = createClient()

clientRedis.on('error', (err) => console.log('Redis Client Error', err))

const connectionRedis = async () => {
  await clientRedis.connect()
  console.log('Redis connected 🐻🐻🐻')
}

export default connectionRedis
