import asyncHandler from 'express-async-handler'

// Import your models here
import User, { validateUser } from '../models/user.models.js'

export const getUsers = asyncHandler(async (req, res) => {
  // Your logic here
  //   const users = await User.find({}).select('-password')
  return res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: [
      {
        id: 1,
        username: 'JohnDoe',
        email: 'aa1@gmail.com',
      },
    ],
  })
})
