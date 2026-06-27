/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Op } = require("sequelize")
const { Contacts, Users } = require("../models/index")
const sendResponse = require("../utils/response")

/* POST contact create - public endpoint */
router.post("/create", async function (req, res, next) {
  try {
    const { firstName, lastName, email, subject, message } = req.body

    if (!firstName || !email) {
      return sendResponse(
        res,
        {
          success: false,
          message: "First name and email are required.",
        },
        400
      )
    }

    const contact = await Contacts.create({
      firstName,
      lastName,
      email,
      subject,
      message,
      isRead: false,
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Your message has been sent successfully. We will get back to you soon!",
        data: contact,
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

/* GET contacts listing - admin only */
router.get("/get", async function (req, res, next) {
  try {
    // Check admin access
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can access contacts.",
        },
        403
      )
    }

    let { page = 1, limit = 10, sortField, sortOrder, filters } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const offset = (page - 1) * limit

    let where = {}
    if (filters) {
      const parsed = JSON.parse(filters)
      for (const field in parsed) {
        const value = parsed[field]?.value
        if (value !== undefined && value !== null && value !== "") {
          if (field === "isRead") {
            where[field] = value === "true" || value === true
          } else {
            where[field] = {
              [Op.like]: `%${value}%`,
            }
          }
        }
      }
    }

    let order = []
    if (sortField) {
      order.push([sortField, sortOrder == -1 ? "DESC" : "ASC"])
    } else {
      order.push(["createdAt", "DESC"])
    }

    const count = await Contacts.count({ where })
    const records = await Contacts.findAll({
      where,
      limit,
      offset,
      order,
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Contacts fetched successfully.",
        data: {
          records,
          total: count,
        },
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

/* PATCH contact mark as read - admin only */
router.patch("/mark-read/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can perform this action.",
        },
        403
      )
    }

    const { id } = req.params

    const contact = await Contacts.findOne({ where: { id } })
    if (!contact) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Contact not found.",
        },
        404
      )
    }

    await Contacts.update({ isRead: true }, { where: { id } })
    const updated = await Contacts.findOne({ where: { id } })

    return sendResponse(
      res,
      {
        success: true,
        message: "Contact marked as read.",
        data: updated,
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

/* DELETE contact - admin only */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can perform this action.",
        },
        403
      )
    }

    const { id } = req.params

    const contact = await Contacts.findOne({ where: { id } })
    if (!contact) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Contact not found.",
        },
        404
      )
    }

    await Contacts.destroy({ where: { id } })

    return sendResponse(
      res,
      {
        success: true,
        message: "Contact deleted successfully.",
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
