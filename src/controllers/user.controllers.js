import asyncHandler from 'express-async-handler'

// Import your models here
import User, { validateUser as validate } from '../models/user.models.js'

export const getUsers = asyncHandler(async (req, res) => {
  // Your logic here
  const users = await User.find({}).select('-password')
  return res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: users,
  })
})

// @desc    Create a new user
// @route   POST /api/v1/users/create-user
// @access  Public
// @param   {Object} req - The request object containing user data
// @param   {Object} res - The response object to send the response
export const createUser = asyncHandler(async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    })
  }
  const user = await User.create(req.body)
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  })
})
