/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Op } = require("sequelize")
const { Users, Addresses, Orders, Products, Categories, Contacts, Reviews } = require("../models/index")
const sequelize = require("../utils/db")
const sendResponse = require("../utils/response")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/jwt")
const { triggerNotification } = require("../utils/notificationHelper")

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

/* POST seller registration. */
router.post("/register-seller", async function (req, res, next) {
  try {
    const { firstName, lastName, email, password, mobileNumber, businessName } = req.body

    // Check if user exists
    const existingUser = await Users.findOne({ where: { email: email } })
    if (existingUser) {
      return sendResponse(
        res,
        {
          success: false,
          message: "An account with this email already exists",
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
      mobileNumber: mobileNumber || null,
      userType: "seller",
      isActive: false, // Seller is inactive until admin approves
    })

    // Trigger notification for admins
    triggerNotification(
      "new_seller",
      "New Seller Registration",
      `A new seller (${firstName} ${lastName} - ${email}) has registered and is pending approval.`
    ).catch(err => console.error("Notification trigger failed:", err))

    return sendResponse(res, {
      success: true,
      message: "Seller registration submitted successfully. Your account is pending admin approval.",
      data: { id: userResp.id, email: userResp.email, userType: userResp.userType, isActive: userResp.isActive },
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

    // Check if user is active (sellers must be approved by admin)
    if (!userResp.isActive) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Your account is pending admin approval. Please wait for activation.",
        },
        200
      )
    }

    const token = generateToken({
      userId: userResp.id,
      email: userResp.email,
      firstName: userResp.firstName,
      lastName: userResp.lastName,
      userType: userResp.userType,
    })
    console.log("User logged in:", token)
    await Users.update(
      { loginToken: token },
      {
        where: { id: userResp.id },
      }
    )

    return sendResponse(res, {
      success: true,
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

/* GET dashboard statistics. */
router.get("/dashboard-stats", async function (req, res, next) {
  try {
    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || (requestingUser.userType !== "admin" && requestingUser.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }

    const { userType } = requestingUser

    // Common statistics
    const totalCustomers = await Users.count({ where: { userType: "user" } })
    const totalSellers = await Users.count({ where: { userType: "seller" } })
    const totalOrders = await Orders.count()
    const totalProducts = await Products.count()
    const totalReviews = await Reviews.count()

    // Order status counts
    const orderStatuses = await Orders.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    })

    const statusCounts = {}
    orderStatuses.forEach(item => {
      const statusVal = item.status || 'pending'
      statusCounts[statusVal] = (statusCounts[statusVal] || 0) + (parseInt(item.get('count')) || 0)
    })

    let data = {
      totalCustomers,
      totalSellers,
      totalOrders,
      totalProducts,
      totalReviews,
      statusCounts,
      userType
    }

    // Admin-only statistics
    if (userType === "admin") {
      const totalContacts = await Contacts.count()
      const totalCategories = await Categories.count()
      const totalActiveLogins = await Users.count({
        where: {
          loginToken: {
            [Op.ne]: null
          }
        }
      })
      const totalEarningsResult = await Orders.sum('totalAmount') || 0
      const totalEarnings = parseFloat(totalEarningsResult)

      data = {
        ...data,
        totalContacts,
        totalCategories,
        totalActiveLogins,
        totalEarnings
      }
    }

    return sendResponse(res, {
      success: true,
      message: "Dashboard statistics fetched successfully.",
      data
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* GET users listing. */
router.get("/get", async function (req, res, next) {
  try {
    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || requestingUser.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }

    let { page = 1, limit = 10, sortField, sortOrder, filters } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const offset = (page - 1) * limit

    // Sequelize where clause for filters
    let where = {}
    if (filters) {
      const parsed = JSON.parse(filters)
      for (const field in parsed) {
        const value = parsed[field]?.value
        if (value) {
          where[field] = {
            [Op.iLike]: `%${value}%`, // case-insensitive LIKE
          }
        }
      }
    }

    // Sorting
    let order = []
    if (sortField) {
      order.push([sortField, sortOrder == -1 ? "DESC" : "ASC"])
    }

    const count = await Users.count({ where, limit, offset, order })
    const userResp = await Users.findAll({
      where,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "mobileNumber",
        "userType",
        "isActive",
        "loginToken",
        "createdAt",
      ],
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
      limit,
      offset,
      order,
    })
    if (userResp.length) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Users fetched successfully.",
          data: {
            records: userResp,
            total: count,
          },
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
    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || (requestingUser.userType !== "admin" && String(requestingUser.id) !== String(id))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }
    const userResp = await Users.findOne({
      where: { id },
      attributes: ["id", "firstName", "lastName", "email", "mobileNumber", "userType", "isActive"],
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

    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || (requestingUser.userType !== "admin" && String(requestingUser.id) !== String(id))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }

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

    // prevent non-admin privilege escalation
    let updateData = { ...req.body }
    if (requestingUser.userType !== "admin") {
      delete updateData.userType
      delete updateData.isActive
      delete updateData.loginToken
    }

    const [updatedCount] = await Users.update(
      updateData, // fields to update
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

/* POST user password update. */
router.post("/update-password/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || (requestingUser.userType !== "admin" && String(requestingUser.id) !== String(id))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }

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

    const { currentPassword, newPassword, password } = req.body
    const targetPassword = newPassword || password
    if (!targetPassword) {
      return sendResponse(
        res,
        {
          success: false,
          message: "New password is required.",
        },
        200
      )
    }

    // Verify current password if NOT admin
    if (requestingUser.userType !== "admin") {
      if (!currentPassword) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Current password is required.",
          },
          200
        )
      }
      const isMatch = await bcrypt.compare(currentPassword, exists.password)
      if (!isMatch) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Incorrect current password.",
          },
          200
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(targetPassword, 10)

    const [updatedCount] = await Users.update(
      { password: hashedPassword }, // fields to update
      {
        where: { id }, // condition
      }
    )
    if (updatedCount) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Password changed successfully.",
          data: updatedCount,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "Error while changing password",
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

/* POST user exists. */
router.post("/exists/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    // find user
    const exists = await Users.findOne({
      where: { id, loginToken: req.body.token },
    })
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
    if (exists) {
      return sendResponse(
        res,
        {
          success: true,
          message: "User exists.",
          data: exists,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "Error while checking",
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

/* DELETE user. */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const requestingUser = await Users.findByPk(req.user.userId)
    if (!requestingUser || requestingUser.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized access.",
        },
        403
      )
    }

    const user = await Users.findByPk(id)
    if (!user) {
      return sendResponse(
        res,
        {
          success: false,
          message: "User not found.",
        },
        404
      )
    }

    await Users.destroy({ where: { id } })

    return sendResponse(
      res,
      {
        success: true,
        message: "User deleted successfully.",
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
        error: error.message,
      },
      500
    )
  }
})

module.exports = router

