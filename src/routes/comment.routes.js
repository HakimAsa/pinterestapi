import express from 'express'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import endpoints from '../utils/endpoints.js'
import validateObjectId from '../middleware/validateObjectId.js'

// Import your controllers here
import { getPinComments } from '../controllers/comment.controllers.js'

const router = express.Router()

const { CONS_PIN_ID } = endpoints

// Define routes here
router.get(dsf(CONS_PIN_ID), [validateObjectId], getPinComments)

export default router
