import mongoose from 'mongoose'
import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

import models from '../utils/models'

const Schema = mongoose.Schema
const myJoiObjectId = JoiObjectId(Joi)

const commentSchema = new Schema(
  {
    // Define your schema here
    description: {
      type: String,
      required: true,
    },
    pin: {
      type: Schema.Types.ObjectId,
      ref: models.PIN,
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

const Comment = mongoose.model(models.COMMENT, commentSchema)

export const validateComment = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
    description: isRequired ? Joi.string().required() : Joi.string(),
    pin: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
    user: myJoiObjectId().required(),
  })
  return schema.validate(data)
}

export default Comment
