import mongoose from 'mongoose'
import Joi from 'joi'

import models from '../utils/models'

const Schema = mongoose.Schema

const pinSchema = new Schema(
  {
    // Define your schema here
    media: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: String,
    board: {
      type: Schema.Types.ObjectId,
      ref: models.BOARD,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: models.USER,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

const Pin = mongoose.model(models.PIN, pinSchema)

export const validatePin = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
  })
  return schema.validate(data)
}

export default Pin
