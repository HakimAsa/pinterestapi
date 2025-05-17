import express from 'express'

import { createUser, getUsers } from '../controllers/user.controllers.js'
import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'

const { CREATE_USER, FORWARDSLASH } = endpoints

const router = express.Router()

// Define your routes here
router.route(FORWARDSLASH).get(getUsers)
router.post(dsf(CREATE_USER), createUser)

export default router
