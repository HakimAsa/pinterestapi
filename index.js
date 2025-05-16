import 'colors'
import express from 'express'

// import setup routes
import setupRoutes from './src/startup/routes.js'

const PORT = process.env.PORT || 5001
const ENV = process.env.NODE_ENV || 'development'
const app = express()

setupRoutes(app)

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${ENV} mode`.yellow.underline.bold
  )
})
