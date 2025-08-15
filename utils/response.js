// utils/response.ts
const sendResponse = (
  res,
  { success = true, message = "", data = null, error = null },
  statusCode = 200
) => {
  res.status(statusCode).json({ success, message, data, error })
}

module.exports = sendResponse
