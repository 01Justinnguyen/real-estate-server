import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

config({
  path: '.env'
})

const checkEnv = async () => {
  const chalk = (await import('chalk')).default
  if (!fs.existsSync(path.resolve('.env'))) {
    console.log(chalk.red(`Không tìm thấy file môi trường .env`))
    process.exit(1)
  }
}
checkEnv()

const configSchema = z.object({
  // z.coerce: ép kiểu về number
  LOCAL_DEV_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  DATABASE_URL_PRODUCTION: z.string(),
  API_URL_PRODUCTION: z.string(),
  DOMAIN: z.string(),
  AUTHOR: z.string(),
  VERSION: z.string(),
  PROTOCOL: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configServer.data

export const API_URL = `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.LOCAL_DEV_PORT}/${envConfig.VERSION}`
export default envConfig

// Đảm bảo các biến môi trường trong Nodejs (process.env) sẽ phải tuân theo cấu trúc xác định trong configSchema
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}