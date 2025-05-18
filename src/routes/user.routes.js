import express from 'express'

import {
  createUser,
  getUser,
  getUsers,
} from '../controllers/user.controllers.js'
import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import validateObjectId from '../middleware/validateObjectId.js'

const { CONS_USERNAME, CREATE_USER, FORWARDSLASH } = endpoints

const router = express.Router()

// Define your routes here
router.route(FORWARDSLASH).get(getUsers)
router.post(dsf(CREATE_USER), createUser)
router.get(dsf(CONS_USERNAME), getUser)

export default router
