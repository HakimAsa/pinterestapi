export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - Route ${req.originalUrl} does not exist`)
  console.error(error.message, error)
  res.status(404)
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  // Log exception
  console.error(err.message, err)

  res.status(500).json({
    success: false,
    message: 'Something failed... ' + err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })

  return next()
}
