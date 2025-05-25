import mongoose from 'mongoose'
import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

import models from '../utils/models.js'

const Schema = mongoose.Schema
const myJoiObjectId = JoiObjectId(Joi)

const pinSchema = new Schema(
  {
    // Define your schema here
    media: {
      type: String,
      required: true,
    },
    mediaUrl: {
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
    textOptions: Schema.Types.Mixed,
    canvasOptions: Schema.Types.Mixed,
    board: {
      type: Schema.Types.ObjectId,
      ref: models.BOARD,
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
    media: isRequired ? Joi.string().required() : Joi.string(),
    mediaUrl: isRequired ? Joi.string().uri().required() : Joi.string().uri(),
    width: isRequired ? Joi.number().required() : Joi.number(),
    height: isRequired ? Joi.number().required() : Joi.number(),
    title: isRequired ? Joi.string().required() : Joi.string(),
    description: isRequired ? Joi.string().required() : Joi.string(),
    textOptions: Joi.object(),
    canvasOptions: Joi.object(),
    link: Joi.string().uri().allow(null),
    board: myJoiObjectId().allow(null),
    user: myJoiObjectId().required(),
    tags: Joi.array().items(Joi.string()),
  })
  return schema.validate(data)
}

export default Pin
