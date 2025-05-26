import express from 'express'

import {
  createUser,
  followUser,
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

const { AUTH, CONS_USERNAME, FOLLOW, LOGIN, LOGOUT, ME, REGISTER } = endpoints

const router = express.Router()

// Define your routes here
router.route(dsf()).get(auth, getUsers)
router.get(dsf(ME), auth, getMe)
router.post(dsf(AUTH, REGISTER), createUser)
router.post(dsf(AUTH, LOGIN), loginUser)
router.post(dsf(AUTH, LOGOUT), auth, logout)
// dynamic - keep these last
router.get(dsf(CONS_USERNAME), [auth], getUser)
router.get(dsf(FOLLOW, CONS_USERNAME), [auth], followUser)

export default router
