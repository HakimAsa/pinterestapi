import express from 'express'

import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import { createPin, getPin, getPins } from '../controllers/pin.controllers.js'
import validateObjectId from '../middleware/validateObjectId.js'

const { CONS_ID, CREATE_PIN, FORWARDSLASH } = endpoints

const router = express.Router()

// Define your routes here
router.get(FORWARDSLASH, getPins)
router.post(dsf(CREATE_PIN), createPin)
router.get(dsf(CONS_ID), [validateObjectId], getPin)

export default router
