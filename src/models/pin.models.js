import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema({
  // Define your schema here
})

const User = mongoose.model('User', userSchema)

export const validateUser = (data, isRequired = true) => {
  const schema = Joi.object({
    // Define your validation schema here
  })
  return schema.validate(data)
}

export default User
