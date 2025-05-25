import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
// Import your models here
import User, { validateUser as validate } from '../models/user.models.js'
import models from '../utils/models.js'
import fourOfour from '../utils/404.js'
import { sendResponse } from '../utils/sendResponse.js'
import Follow from '../models/follow.models.js'

// @desc    fetch all uses
// @route   GET /api/v1/users
// @access  Private
export const getUsers = asyncHandler(async (req, res) => {
  // Your logic here
  const users = await User.find({}).select('-password')
  return res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: users,
  })
})

// @desc    fetch a signle user by user name
// @route   GET /api/v1/users/:username
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const username = req.params.username
  const user = await User.findOne({ username })
  if (!user) return fourOfour(models.USER, username, res)

  //get followers and followings
  const followerCount = await Follow.countDocuments({ following: user._id })
  const followingCount = await Follow.countDocuments({ follower: user._id })

  //check if already following this user
  const isFollowing = await Follow.exists({
    follower: req.user._id,
    following: user._id,
  })

  sendResponse(
    {
      ...user.toObject(),
      followerCount,
      followingCount,
      isFollowing: !!isFollowing,
    },
    'User fetched successfully',
    200,
    res
  )
})

// @desc    fetch current logged in user
// @route   GET /api/v1/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const id = req.user?._id
  const user = await User.findById(id)
  sendResponse(user, 'User fetched successfully', 200, res)
})

// @desc    Create a new user
// @route   POST /api/v1/users/auth/register
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
  const orQuery = []
  // Check if the email or username already exists
  if (req.body.email) orQuery.push({ email: req.body.email })
  if (req.body.username) orQuery.push({ username: req.body.username })

  // Check if the user already exists
  const userExists = await User.findOne({ $or: orQuery })
  if (userExists) {
    if (userExists.email === req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
    }
    if (userExists.username === req.body.username) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      })
    }
  }
  // hash the password
  req.body.password = await bcrypt.hash(req.body.password, 10)
  // Create the user
  const user = await User.create(req.body)
  // send token response
  sendTokenResponse(user, 201, res, 'User registered successfully')
})

// @desc    Log user in
// @route   POST /api/v1/users/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateOnLogin(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    })
  }

  const { email, password } = req.body

  //check if password match
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password)))
    return res
      .status(400)
      .send({ success: false, message: 'Invalid Credentials' })

  // send token response
  sendTokenResponse(user, 200, res)
})

// @desc   Logout user and clear cookie
// @route  GET /api/v1/users/auth/logout
// @access Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    sameSite: 'Strict', // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV === 'production', // ensure secure cookies in production
    expires: new Date(0), //Immediately expires the cookie
  })

  return res.status(200).json({
    success: true,
    message: 'Logout successfully',
  })
})

// @desc   fetch followers and followings from user collections
// @route  GET /api/v1/users/follow/:username
// @access Private
export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params

  //check if user exists
  const user = await User.findOne({ username })
  if (!user) return fourOfour(models.USER, username, res)

  //check if already following, then unfollow
  const isFollowing = await Follow.exists({
    follower: req.user._id,
    following: user._id,
  })
  // unfollow
  if (isFollowing)
    await Follow.deleteOne({
      follower: req.user._id,
      following: user._id,
    })
  else
    await Follow.create({
      follower: req.user._id,
      following: user._id,
    })

  sendResponse(
    null,
    'User followers and followings fetched successfully',
    200,
    res
  )
})

// Get token from model, create cookie and send response
const sendTokenResponse = (
  user,
  statusCode,
  res,
  message = 'Successfully authenticated'
) => {
  const token = user.generateAuthToken()
  const exp = Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  const options = {
    expires: new Date(exp),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  }

  return res.status(statusCode).cookie('token', token, options).json({
    sucess: true,
    message,
  })
}

function validateOnLogin(req) {
  const schema = Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().min(6).max(20),
  })

  return schema.validate(req)
}
