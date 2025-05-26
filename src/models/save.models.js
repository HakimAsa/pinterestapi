import mongoose from 'mongoose'
import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

import models from '../utils/models.js'

const { Schema, model } = mongoose
const myJoiObjectId = JoiObjectId(Joi)

const saveSchema = new Schema(
  {
    // Define your schema here
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

const Save = model(models.SAVE, saveSchema)

export const validateSave = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
    pin: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
    user: isRequired ? myJoiObjectId().required() : myJoiObjectId(),
  })
  return schema.validate(data)
}

export default Save
