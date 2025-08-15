/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const User = require("../models/User")
const sendResponse = require("../utils/response")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/jwt")

/* POST user registering. */
router.post("/", async function (req, res, next) {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ where: { email: email } })
    if (existingUser) {
      return sendResponse(
        res,
        {
          success: false,
          message: "User already exists",
        },
        200
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userResp = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    })
    console.log("User registered:", userResp.toJSON())

    return sendResponse(res, {
      message: "User registered successfully.",
      data: userResp,
    })
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      500
    )
  }
})

/* POST user login. */
router.post("/login", async function (req, res, next) {
  try {
    console.log(req.body)
    const { email, password } = req.body

    // find user
    const userResp = await User.findOne({ where: { email: email } })
    if (!userResp) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid credentials",
        },
        200
      )
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, userResp.password)
    if (!isMatch) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid credentials",
        },
        200
      )
    }

    const token = generateToken({ userId: userResp.id })
    console.log("User logged in:", token)

    return sendResponse(res, {
      message: `Welcome ${userResp.firstName}!`,
      data: {
        token,
        userResp,
      },
    })
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      500
    )
  }
})

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router
