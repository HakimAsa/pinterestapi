import mongoose from 'mongoose'
import Joi from 'joi'

import models from '../utils/models'

const boardSchema = new mongoose.Schema({
  // Define your schema here
})

const Board = mongoose.model(models.BOARD, boardSchema)

export const validateBoard = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
  })
  return schema.validate(data)
}

export default board
