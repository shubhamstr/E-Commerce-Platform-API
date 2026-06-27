// utils/response.ts
const sendResponse = (
  res,
  payload = {},
  statusCode = 200
) => {
  const { success = true, message = "", data = null, error = null, ...rest } = payload
  return res.status(statusCode).json({ success, message, data, error, ...rest })
}

module.exports = sendResponse
