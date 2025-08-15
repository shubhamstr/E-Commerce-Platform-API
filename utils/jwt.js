/* eslint-disable @typescript-eslint/no-require-imports */
// utils/jwt.js
const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET // Move this to environment variable for production

// Create JWT Token
const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET, { expiresIn })
}

module.exports = {
  generateToken,
}
