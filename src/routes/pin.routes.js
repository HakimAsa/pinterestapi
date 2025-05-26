import express from 'express'

import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import {
  createPin,
  getPin,
  getPins,
  interact,
  interactionCheck,
} from '../controllers/pin.controllers.js'
import validateObjectId from '../middleware/validateObjectId.js'
import auth from '../middleware/auth.middleware.js'

const {
  CONS_ID,
  CONS_PIN_ID,
  CREATE,
  FORWARDSLASH,
  INTERACT,
  INTERACTIONS_CHECK,
} = endpoints

const router = express.Router()

// Define your routes here
router.get(FORWARDSLASH, getPins)
router.post(dsf(CREATE), [auth], createPin)
router.get(
  dsf(CONS_PIN_ID, INTERACTIONS_CHECK),
  [validateObjectId, auth],
  interactionCheck
)
router.post(dsf(CONS_PIN_ID, INTERACT), [validateObjectId, auth], interact)
router.get(dsf(CONS_ID), [validateObjectId], getPin)

export default router
