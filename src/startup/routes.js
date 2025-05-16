import express from 'express'

// Import the global error middleware
import { errorHandler, notFound } from '../middleware/error.js'

// Import your routes here
import pinRoutes from '../routes/pin.routes.js'
import userRoutes from '../routes/user.routes.js'

export default (app) => {
  // Middleware to parse JSON requests
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //test route
  app.use('/', (req, res) => {
    return res.status(200).send({
      message: 'Welcome to the AkimPin API Version 1.0',
    })
  })

  // Use your routes
  app.use('/api/v1/users', userRoutes)
  app.use('/api/v1/pins', pinRoutes)

  // Handle 404 errors
  app.use(notFound)
  // Handle other errors
  app.use(errorHandler)
}
