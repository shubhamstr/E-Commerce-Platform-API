/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Notifications } = require("../models/index")
const sendResponse = require("../utils/response")

// Get notifications for logged-in user (admin/seller)
router.get("/", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { userType } = req.user

    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. Admin or Seller access required.",
        },
        403
      )
    }

    const list = await Notifications.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(res, {
      success: true,
      data: list,
    })
  } catch (error) {
    console.error("Fetch notifications error:", error)
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

// Mark a single notification as read
router.put("/:id/read", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const notification = await Notifications.findOne({
      where: { id, userId },
    })

    if (!notification) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Notification not found or does not belong to you.",
        },
        404
      )
    }

    notification.isRead = true
    await notification.save()

    return sendResponse(res, {
      success: true,
      message: "Notification marked as read successfully.",
      data: notification,
    })
  } catch (error) {
    console.error("Mark notification read error:", error)
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

// Mark all notifications as read for current user
router.put("/read-all", async function (req, res, next) {
  try {
    const userId = req.user.userId

    await Notifications.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    )

    return sendResponse(res, {
      success: true,
      message: "All notifications marked as read.",
    })
  } catch (error) {
    console.error("Mark all notifications read error:", error)
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
