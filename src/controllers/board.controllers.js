import asyncHandler from 'express-async-handler'

// Import your models here
import Board, { validateBoard as validate } from '../models/board.models.js'
import { sendResponse } from '../utils/sendResponse.js'
import User from '../models/user.models.js'
import Pin from '../models/pin.models.js'
import models from '../utils/models.js'
import fourOfour from '../utils/404.js'

//@desc   Fetch all user boards
//@route  GET /api/v1/boards/userId
//@access Private
export const getUserBoards = asyncHandler(async (req, res) => {
  const { userId } = req.params
  //check if user exists
  const user = await User.findById(userId)
  if (!user) return fourOfour(models.USER, userId, res)

  const boards = await Board.find({ user: userId })

  const boardWithPinDetails = await Promise.all(
    boards.map(async (board) => {
      const pinCount = await Pin.countDocuments({ board: board._id })
      const firstPin = await Pin.findOne({ board: board._id })

      return {
        ...board.toObject(),
        pinCount,
        firstPin,
      }
    })
  )

  sendResponse(boardWithPinDetails, 'Boards fetched successfully', 200, res)
})
