import asyncHandler from 'express-async-handler'

// Import your models here
import Pin, { validatePin as validate } from '../models/pin.models.js'

//@desc get all pins
//@route GET /api/v1/pins
//@access Private
export const getPins = asyncHandler(async (req, res) => {
  //Pagination
  const pageNumber = Number(req.query.cursor) || 0
  const LIMIT = 21 // number of items per page
  const pins = await Pin.find({})
    .limit(LIMIT)
    .skip(LIMIT * pageNumber)

  const hasNextPage = pins.length === LIMIT

  return res.status(200).send({
    success: true,
    message: 'Pins fetched successfully',
    nextCursor: hasNextPage ? pageNumber + 1 : null,
    data: pins,
  })
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
  return res.status(201).json({
    success: true,
    message: 'Pin created successfully',
    data: pin,
  })
})
