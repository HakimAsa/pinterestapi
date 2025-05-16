import mongoose from 'mongoose'
import Joi from 'joi'

import models from '../utils/models.js'

const userSchema = new mongoose.Schema({
  // Define your schema here
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
})

const User = mongoose.model(models.USER, userSchema)

export const validateUser = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
    email: isRequired ? Joi.string().email().required() : Joi.string().email(),
    password: isRequired
      ? Joi.string().min(6).max(20).required()
      : Joi.string().min(6).max(20),
    username: isRequired
      ? Joi.string().min(3).max(30).required()
      : Joi.string().min(3).max(30),
  })
  return schema.validate(data)
}

export default User
