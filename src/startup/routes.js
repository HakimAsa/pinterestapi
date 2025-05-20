import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

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

  //cors
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))

  // cooke-parser
  app.use(cookieParser())

  // Use your routes
  app.use('/api/v1/boards', boardRoutes)
  app.use('/api/v1/comments', commentRoutes)
  app.use('/api/v1/users', userRoutes)
  app.use('/api/v1/pins', pinRoutes)

  //test route
  app.use('/', (req, res) => {
    return res.status(200).send({
      message: 'Welcome to the AkimPin API Version 1.0',
    })
  })

  // Handle 404 errors
  app.use(notFound)
  // Handle other errors
  app.use(errorHandler)
}
