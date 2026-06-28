const jwt = require("jsonwebtoken")
const sendResponse = require("./response")
const { excludedPaths } = require("./constants")
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(" ")[1]

    if (!token) {
      if (excludedPaths.includes(req.path)) {
        return next()
      }
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
        if (excludedPaths.includes(req.path)) {
          return next()
        }
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
