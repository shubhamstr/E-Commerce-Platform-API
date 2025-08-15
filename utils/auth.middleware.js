const jwt = require("jsonwebtoken")
const sendResponse = require("./response")
const { excludedPaths } = require("./constants")
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  try {
    // console.log(req.path)
    if (excludedPaths.includes(req.path)) {
      return next() // Skip auth for these routes
    }
    const authHeader = req.headers["authorization"]
    // console.log(authHeader)
    const token = authHeader?.split(" ")[1] // optional chaining for safety
    // console.log(token)

    if (!token) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, token not found.",
        },
        401
      )
    }

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Unauthorized, invalid token.",
            error: err.message,
          },
          403
        )
      }

      req.user = user // attach decoded payload to req.user
      next()
    })
  } catch (err) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: err.message,
      },
      500
    )
  }
}

module.exports = { authenticateToken }
