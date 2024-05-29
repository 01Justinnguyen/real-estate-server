import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import envConfig, { API_URL } from '@/config'
import { isProduction } from '@/constants/config'
import authRouter from '@/routes/auth.routes'
import { badRequestException, defaultErrorHandler } from '@/middleware/errorHandler.middleware'

config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    })
  )
}

app.use('/v1/auth', authRouter)
app.use('/v1/test', (req, res) => {
  console.log(req.body)
  return res.json({
    message: 'DONE oke la'
  })
})
app.use(defaultErrorHandler)
app.use('/', badRequestException)

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
