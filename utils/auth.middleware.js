const jwt = require("jsonwebtoken")
const sendResponse = require("./response")

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(" ")[1] // optional chaining for safety

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

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
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
