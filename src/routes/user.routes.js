import express from 'express'

import {
  createUser,
  getMe,
  getUser,
  getUsers,
  loginUser,
  logout,
} from '../controllers/user.controllers.js'
import endpoints from '../utils/endpoints.js'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import validateObjectId from '../middleware/validateObjectId.js'
import auth from '../middleware/auth.middleware.js'

const { AUTH, CONS_USERNAME, FORWARDSLASH, LOGIN, LOGOUT, ME, REGISTER } =
  endpoints

const router = express.Router()

// Define your routes here
router.route(FORWARDSLASH).get(getUsers)
router.get(dsf(ME), auth, getMe)
router.post(dsf(AUTH, REGISTER), createUser)
router.post(dsf(AUTH, LOGIN), loginUser)
router.post(dsf(AUTH, LOGOUT), logout)
router.get(dsf(CONS_USERNAME), getUser) //// dynamic - keep this last

export default router
