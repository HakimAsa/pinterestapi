import 'colors'
import express from 'express'

const PORT = process.env.PORT || 5000
const ENV = process.env.NODE_ENV || 'development'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${ENV} mode`.yellow.underline.bold
  )
})
