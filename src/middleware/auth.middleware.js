import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

const auth = asyncHandler(async (req, res, next) => {
  let token
  //Set token from Bearer token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1]
  //Set token from cookie
  else if (req.cookies?.token && req.headers['user-agent'])
    token = req.cookies.token
  //Set token from header
  else token = req.header('x-auth-token')

  // check if token is defined
  if (!token)
    return res
      .status(401)
      .send({ success: false, message: 'Acces denied. No token provided.' })
  // decode the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)

    req.user = decoded // attach user object to request

    next()
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: 'Invalid Token.', reason: error })
  }
})

export default auth
