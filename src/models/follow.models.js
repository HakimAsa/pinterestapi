import mongoose from 'mongoose'
import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

import models from '../utils/models.js'

const { Schema, model } = mongoose
const myJoiObjectId = JoiObjectId(Joi)

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: models.USER,
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: models.USER,
      required: true,
    },
  },
  { timestamps: true }
)

const Follow = model(models.FOLLOW, followSchema)

export const validateFollow = (data, isRequired = true) => {
  const schema = Joi.object({
    follower: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
    following: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
  })
  return schema.validate(data)
}

export default Follow
