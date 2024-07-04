import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import envConfig, { API_URL } from '@/config'
import { isProduction } from '@/constants/config'
import authRouter from '@/routes/auth.routes'
import { badRequestException, defaultErrorHandler } from '@/middleware/errorHandler.middleware'
import clientRouter from '@/routes/client.routes'
import { accessTokenValidator } from '@/middleware/token.middlewares'
import mediaRouter from '@/routes/media.routes'
import { initFolder } from '@/utils/file'
import { UPLOAD_DIR } from '@/constants/dir'
import insertRouter from '@/routes/insert.routes'
import propertyTypeRouter from '@/routes/propertyType.routes'
import connectionRedis from '@/database/redis.config'

config()
const app = express()

initFolder()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connectionRedis()
if (isProduction) {
  app.use(
    cors({
      origin: envConfig.API_URL_PRODUCTION,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    })
  )
} else {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    })
  )
}

app.use('/v1/auth', authRouter)
app.use('/v1/client', clientRouter)
app.use('/v1/medias', mediaRouter)
app.use('/v1/insert', insertRouter)
app.use('/v1/property-type', propertyTypeRouter)

// static file
app.use('/static', express.static(UPLOAD_DIR))

app.use(defaultErrorHandler)
app.use('/', badRequestException)

app.use('/v1/test', accessTokenValidator, (req, res) => {
  console.log(req.body)
  return res.json({
    message: 'DONE oke la'
  })
})

if (isProduction) {
  app.listen(process.env.PORT, () => {
    console.log(
      `Production: Hi ${envConfig.AUTHOR}, Back-end Server is running successfully at PORT: ${process.env.PORT}`
    )
  })
} else {
  app.listen(envConfig.LOCAL_DEV_PORT, () => {
    console.log(
      `Development: Hi ${envConfig.AUTHOR}, Back-end Server is running successfully at HOST: ${envConfig.DOMAIN} and PORT: ${envConfig.LOCAL_DEV_PORT}`
    )
    console.log(API_URL)
  })
}
