/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Users, Addresses } = require("../models/index")
const sendResponse = require("../utils/response")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/jwt")

/* POST user registering. */
router.post("/register", async function (req, res, next) {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body

    // Check if user exists
    const existingUser = await Users.findOne({ where: { email: email } })
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

    const userResp = await Users.create({
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
    const userResp = await Users.findOne({ where: { email: email } })
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

/* GET users listing. */
router.get("/get", async function (req, res, next) {
  try {
    const userResp = await Users.findAll({
      attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
      include: [
        {
          model: Addresses,
          as: "addresses",
          attributes: [
            "id",
            "addressLine1",
            "addressLine2",
            "city",
            "state",
            "pinCode",
            "addressType",
            "isDefault",
          ],
        },
      ],
    })
    if (userResp.length) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Users fetched successfully.",
          data: userResp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No users found",
      },
      404
    )
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

/* GET user single. */
router.get("/get/:id", async function (req, res, next) {
  try {
    const { id } = req.params
    const userResp = await Users.findOne({
      where: { id },
      attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
      // logging: console.log,
      include: [
        {
          model: Addresses,
          as: "addresses",
          attributes: [
            "id",
            "addressLine1",
            "addressLine2",
            "city",
            "state",
            "pinCode",
            "addressType",
            "isDefault",
          ],
        },
      ],
    })
    if (userResp) {
      return sendResponse(
        res,
        {
          success: true,
          message: "User fetched successfully.",
          data: userResp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No user found",
      },
      404
    )
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

/* POST user update. */
router.post("/update/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    // find user
    const exists = await Users.findOne({ where: { id } })
    if (!exists) {
      return sendResponse(
        res,
        {
          success: false,
          message: "User not exists.",
        },
        404
      )
    }
    const [updatedCount] = await Users.update(
      { ...req.body }, // fields to update
      {
        where: { id }, // condition
      }
    )
    if (updatedCount) {
      return sendResponse(
        res,
        {
          success: true,
          message: "User updated successfully.",
          data: updatedCount,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "Error while updating",
      },
      200
    )
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

module.exports = router
