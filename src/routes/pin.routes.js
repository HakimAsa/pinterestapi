import express from 'express'

import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import { createPin, getPin, getPins } from '../controllers/pin.controllers.js'
import validateObjectId from '../middleware/validateObjectId.js'
import auth from '../middleware/auth.middleware.js'

const { CONS_ID, CREATE, FORWARDSLASH } = endpoints

const router = express.Router()

// Define your routes here
router.get(FORWARDSLASH, getPins)
router.post(dsf(CREATE), [auth], createPin)
router.get(dsf(CONS_ID), [validateObjectId], getPin)

export default router
