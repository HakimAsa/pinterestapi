import express from 'express'
import { doSetForwardslash as dsf } from '../utils/helpers.js'
import endpoints from '../utils/endpoints.js'
import validateObjectId from '../middleware/validateObjectId.js'
import { getUserBoards } from '../controllers/board.controllers.js'

const router = express.Router()

const { CONS_USER_ID } = endpoints

// Define your routes here
router.get(dsf(CONS_USER_ID), [validateObjectId], getUserBoards)

export default router
