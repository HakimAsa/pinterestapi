import asyncHandler from 'express-async-handler'

// Import your models here
import Pin, { validatePin as validate } from '../models/pin.models.js'
import fourOfour from '../utils/404.js'
import models from '../utils/models.js'
import { sendResponse } from '../utils/sendResponse.js'

//@desc   Fetch all pins
//@route  GET /api/v1/pins
//@access Private
export const getPins = asyncHandler(async (req, res) => {
  //Pagination
  const pageNumber = Number(req.query.cursor) || 0
  const LIMIT = 21 // number of items per page
  // search query
  const search = req.query.searchItem
  const userId = req.query.userId
  const pins = await Pin.find(
    search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
          ],
        }
      : userId
      ? { user: userId }
      : {}
  )
    .sort({ createdAt: -1 })
    .limit(LIMIT)
    .skip(LIMIT * pageNumber)

  const hasNextPage = pins.length === LIMIT

  return {
    ...sendResponse(pins, 'Pins fetched successfully', 200, res),
    nextCursor: hasNextPage ? pageNumber + 1 : null,
  }
})

//@desc Get a single pin from db
//@route GET /api/v1/pins/id
//@access Private
export const getPin = asyncHandler(async (req, res) => {
  const id = req.params.id
  const pin = await Pin.findById(id).populate(
    'user',
    'username displayName profilePicture'
  )
  if (!pin) return fourOfour(models.PIN, id, res)

  sendResponse(pin, 'Pin fetched successfully', 200, res)
})

//@desc Create a pin and save it to db
//@route POST /api/v1/pins/create-pin
//@access Private
export const createPin = asyncHandler(async (req, res) => {
  const { error } = validate(req.body)
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    })

  const pin = await Pin.create(req.body)
  sendResponse(pin, 'Pin created successfully', 201, res)
})
