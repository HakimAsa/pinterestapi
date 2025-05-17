import mongoose from 'mongoose'
import Joi from 'joi'

import models from '../utils/models.js'

const userSchema = new mongoose.Schema(
  {
    // Define your schema here
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/dqj8v0x2g/image/upload/v1698231234/boardify/default-profile-picture.png',
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password from queries
      minlength: 6, // Minimum length of 6 characters
    },
  },
  { timestamps: true }
)
// Add indexes for unique fields
userSchema.index({ email: 1, username: 1 }, { unique: true })

const User = mongoose.model(models.USER, userSchema)

export const validateUser = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
    email: isRequired ? Joi.string().email().required() : Joi.string().email(),
    password: isRequired
      ? Joi.string().min(6).max(20).required()
      : Joi.string().min(6).max(20),
    displayName: isRequired
      ? Joi.string().min(2).max(30).required()
      : Joi.string().min(2).max(30),
    username: isRequired
      ? Joi.string().min(3).max(30).required()
      : Joi.string().min(3).max(30),
    profilePicture: Joi.string().uri(),
  })
  return schema.validate(data)
}

export default User
