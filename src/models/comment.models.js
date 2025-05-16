import mongoose from 'mongoose'
import Joi from 'joi'
import models from '../utils/models'

const commentSchema = new mongoose.Schema({
  // Define your schema here
})

const Comment = mongoose.model(models.COMMENT, commentSchema)

export const validateComment = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
  })
  return schema.validate(data)
}

export default comment
