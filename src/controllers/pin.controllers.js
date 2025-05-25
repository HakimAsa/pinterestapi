import asyncHandler from 'express-async-handler'

// Import your models here
import Pin, { validatePin as validate } from '../models/pin.models.js'
import fourOfour from '../utils/404.js'
import models from '../utils/models.js'
import { sendResponse } from '../utils/sendResponse.js'
import sharp from 'sharp'
import ImageKit from 'imagekit'

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
  const boardId = req.query.boardId
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
      : boardId
      ? { board: boardId }
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
//@route POST /api/v1/pins/create
//@access Private
export const createPin = asyncHandler(async (req, res) => {
  const media = req.files.media

  // get image metadata using sharp
  const metadata = await sharp(media.data).metadata()
  // get media original orientation
  const originalOrientation =
    metadata.width < metadata.height ? 'portrait' : 'landscape'
  const originalAspectRatio = metadata.width / metadata.height

  let clientAspectRatio
  let width
  let height
  let canvasOptions
  let textOptions
  try {
    canvasOptions =
      typeof req.body.canvasOptions === 'string'
        ? JSON.parse(req.body.canvasOptions)
        : req.body.canvasOptions || {}
    textOptions =
      typeof req.body.textOptions === 'string'
        ? JSON.parse(req.body.textOptions)
        : req.body.textOptions || {}
  } catch (e) {
    canvasOptions = {}
    textOptions = {}
  }

  if (canvasOptions?.size !== 'original') {
    clientAspectRatio =
      canvasOptions.size.split(':')[0] / canvasOptions.size.split(':')[1]
  } else {
    canvasOptions.orientation === originalOrientation
      ? (clientAspectRatio = originalAspectRatio)
      : (clientAspectRatio = 1 / originalAspectRatio)
  }

  //set width and height
  width = metadata.width
  height = metadata.width / clientAspectRatio
  // create an imagekit instance
  const imagekit = new ImageKit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: process.env.IK_URL_ENDPOINT,
  })

  // caculate positions
  const imageWidth = 375
  const textLeftPosition = Math.round((textOptions.left * width) / imageWidth)
  const textTopPosition = Math.round(
    (textOptions.top * height) / canvasOptions.height
  )

  const transformationString = `w-${width},h-${height}${
    originalAspectRatio > clientAspectRatio && canvasOptions.size === 'original'
      ? ',cm-pad_resize'
      : ''
  },bg-${canvasOptions.backgroundColor.substring(1)}${
    textOptions.text
      ? `,l-text,i-${textOptions.text},fs-${
          textOptions.fontSize * 2.1
        },lx-${textLeftPosition},ly-${textTopPosition},co-${textOptions.color.substring(
          1
        )},l-end`
      : ''
  }`

  //file upload
  imagekit
    .upload({
      file: media.data,
      fileName: media.name,
      folder: 'tests',
      transformation: {
        pre: transformationString,
      },
    })
    .then(async (response) => {
      req.body.media = response.filePath
      req.body.width = response.width
      req.body.height = response.height
      req.body.user = req.user._id
      req.body.link = req.body.link || null
      req.body.board = req.body.board || null
      req.body.tags = req.body.tags
        ? req.body.tags.split(',').map((tag) => tag.trim())
        : []

      req.body = {
        ...req.body,
        canvasOptions,
        textOptions,
        mediaUrl: response.url,
      }
      //validate client data before saving it to db;
      const { error } = validate(req.body)
      if (error)
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        })
      console.log(req.body)
      const pin = await Pin.create(req.body)
      return sendResponse(pin, 'Pin created successfully', 201, res)
    })
    .catch((e) => {
      console.error(e)
      return res.status(500).json(e)
    })

  // // validate inpute before uploading
  // const { error } = validate(req.files)
  // if (error)
  //   return res.status(400).json({
  //     success: false,
  //     message: error.details[0].message,
  //   })
})
