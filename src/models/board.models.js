import mongoose from 'mongoose'
import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

import models from '../utils/models'

const Schema = mongoose.Schema
const myJoiObjectId = JoiObjectId(Joi)

const boardSchema = new Schema(
  {
    // Define your schema here
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: models.USER,
      required: true,
    },
  },
  { timestamps: true }
)

const Board = mongoose.model(models.BOARD, boardSchema)

export const validateBoard = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
    title: isRequired ? Joi.string().required() : Joi.string(),
    user: myJoiObjectId().required(),
  })
  return schema.validate(data)
}

export default Board
