import 'colors'
import express from 'express'

const PORT = process.env.PORT || 5000
const ENV = process.env.NODE_ENV || 'development'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/test', (req, res) => {
  return res.status(200).json({
    message: 'Hello from the backend API!',
  })
})

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${ENV} mode`.yellow.underline.bold
  )
})
