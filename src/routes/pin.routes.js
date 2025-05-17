import express from 'express'

import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import { createPin, getPins } from '../controllers/pin.controllers.js'

const { CREATE_PIN, FORWARDSLASH } = endpoints

const router = express.Router()

// Define your routes here
router.get(FORWARDSLASH, getPins)
router.post(dsf(CREATE_PIN), createPin)

export default router
