import envConfig from '@/config'
import { isProduction } from '@/constants/config'
import { PrismaClient } from '@prisma/client'

const url = isProduction ? envConfig.DATABASE_URL_PRODUCTION : envConfig.DATABASE_URL
console.log('🐻 ~ isProduction:', isProduction)

const prisma = new PrismaClient({
  datasources: {
    db: { url }
  },
  log: ['info']
})

export default prisma
