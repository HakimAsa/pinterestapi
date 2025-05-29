import mongoose from 'mongoose'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import models from '../utils/models.js'
import bcrypt from 'bcryptjs'

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
      default: 'https://picsum.photos/id/1/200/200',
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

// generate auth token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  )

  return token
}

//generate refresh token
userSchema.methods.generateRefreshAuthToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_REFRESH_PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, //'1m'
    }
  )
}

// Match entered password with saved password in db
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

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
