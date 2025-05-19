import express from 'express'

import {
  createUser,
  getUser,
  getUsers,
  loginUser,
  logout,
} from '../controllers/user.controllers.js'
import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import validateObjectId from '../middleware/validateObjectId.js'

const { AUTH, CONS_USERNAME, FORWARDSLASH, LOGIN, LOGOUT, REGISTER } = endpoints

const router = express.Router()

// Define your routes here
router.route(FORWARDSLASH).get(getUsers)
router.post(dsf(AUTH, REGISTER), createUser)
router.post(dsf(AUTH, LOGIN), loginUser)
router.post(dsf(AUTH, LOGOUT), logout)
router.get(dsf(CONS_USERNAME), getUser)

export default router
