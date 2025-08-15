/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Users, Addresses } = require("../models/index")
const sendResponse = require("../utils/response")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/jwt")

// /* POST user registering. */
// router.post("/register", async function (req, res, next) {
//   try {
//     console.log(req.body)
//     const { firstName, lastName, email, password } = req.body

//     // Check if user exists
//     const existingUser = await Users.findOne({ where: { email: email } })
//     if (existingUser) {
//       return sendResponse(
//         res,
//         {
//           success: false,
//           message: "User already exists",
//         },
//         200
//       )
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10)

//     const userResp = await Users.create({
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       password: hashedPassword,
//     })
//     console.log("User registered:", userResp.toJSON())

//     return sendResponse(res, {
//       message: "User registered successfully.",
//       data: userResp,
//     })
//   } catch (error) {
//     console.error(error)
//     return sendResponse(
//       res,
//       {
//         success: false,
//         message: "Internal Server Error",
//         error: error,
//       },
//       500
//     )
//   }
// })

// /* POST user login. */
// router.post("/login", async function (req, res, next) {
//   try {
//     console.log(req.body)
//     const { email, password } = req.body

//     // find user
//     const userResp = await Users.findOne({ where: { email: email } })
//     if (!userResp) {
//       return sendResponse(
//         res,
//         {
//           success: false,
//           message: "Invalid credentials",
//         },
//         200
//       )
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, userResp.password)
//     if (!isMatch) {
//       return sendResponse(
//         res,
//         {
//           success: false,
//           message: "Invalid credentials",
//         },
//         200
//       )
//     }

//     const token = generateToken({ userId: userResp.id })
//     console.log("User logged in:", token)

//     return sendResponse(res, {
//       message: `Welcome ${userResp.firstName}!`,
//       data: {
//         token,
//         userResp,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     return sendResponse(
//       res,
//       {
//         success: false,
//         message: "Internal Server Error",
//         error: error,
//       },
//       500
//     )
//   }
// })

/* GET address listing. */
router.get("/", async function (req, res, next) {
  try {
    console.log("get addresses")
    // gets addresses
    const addrResp = await Addresses.findAll({
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
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
        },
      ],
    })
    if (addrResp.length) {
      console.log(addrResp)
      return sendResponse(
        res,
        {
          success: true,
          message: "Addresses fetched successfully.",
          data: addrResp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No addresses found",
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

module.exports = router
