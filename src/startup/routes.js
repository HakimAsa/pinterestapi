import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import path from 'path'

// Import the global error middleware
import { errorHandler, notFound } from '../middleware/error.js'

// Import your routes here
import boardRoutes from '../routes/board.routes.js'
import commentRoutes from '../routes/comment.routes.js'
import pinRoutes from '../routes/pin.routes.js'
import userRoutes from '../routes/user.routes.js'

export default (app) => {
  // Middleware to parse JSON requests
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // load static files in public folder
  console.log(process.cwd())
  app.use(express.static(path.join(process.cwd(), 'public')))
  // app.use('../../public', express.static('public'))

  //cors
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))

  // cooke-parser
  app.use(cookieParser())
  // fileupload
  app.use(fileUpload())
  // Prevent http param polution
  app.use(hpp())
  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 min
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 25 requests can be made in 10 min
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers,
    message: 'Too many requests, please try again later.',
  })

  app.use(limiter)

  // Use your routes
  app.use('/api/v1/boards', boardRoutes)
  app.use('/api/v1/comments', commentRoutes)
  app.use('/api/v1/users', userRoutes)
  app.use('/api/v1/pins', pinRoutes)

  //entry point to serve the API doc
  app.get('/', (req, res) => {
    return res.status(200).send({
      message: 'Welcome to the AkimPin API Version 1.0',
    })
    // res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
  })

  //test route
  app.use('/health', (req, res) => {
    return res.status(200).send({
      message: 'Welcome to the AkimPin API Version 1.0',
    })
  })

  // Handle 404 errors
  app.use(notFound)
  // Handle other errors
  app.use(errorHandler)
}
