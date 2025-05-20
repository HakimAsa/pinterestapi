import asyncHandler from 'express-async-handler'

// Import your models here
import Comment, {
  validateComment as validate,
} from '../models/comment.models.js'
import { sendResponse } from '../utils/sendResponse.js'
import Pin from '../models/pin.models.js'
import fourOfour from '../utils/404.js'

export const getPinComments = asyncHandler(async (req, res) => {
  const { pinId } = req.params
  const comments = await Comment.find({ pin: pinId })
    .populate('user', 'username profilePicture displayName')
    .sort({ createdAt: -1 })

  sendResponse(
    comments,
    `Comments of Pin -> ${pinId} fetched successfully!`,
    200,
    res
  )
})

export const addComment = asyncHandler(async (req, res) => {
  // add user dynamically
  if (!req.body) req.body = {}
  req.body.user = req.user._id.toString()
  const { error } = validate(req.body)
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    })

  const comment = await Comment.create(req.body)

  sendResponse(comment, `Comment added successfully!`, 200, res)
})
