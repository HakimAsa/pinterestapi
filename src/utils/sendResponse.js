export const sendResponse = (data, message, statusCode, res) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}
