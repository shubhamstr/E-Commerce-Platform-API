/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { EmailLogs, Users } = require("../models/index")
const sendResponse = require("../utils/response")
const nodemailer = require("nodemailer")

/**
 * Helper to get SMTP transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email"
  const port = parseInt(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER || ""
  const pass = process.env.SMTP_PASS || ""

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })
}

/* GET email logs listing - admin only */
router.get("/", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can view email logs.",
        },
        403
      )
    }

    const logs = await EmailLogs.findAll({
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(
      res,
      {
        success: true,
        data: logs,
      },
      200
    )
  } catch (error) {
    console.error("GET email logs error:", error)
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

/* POST resend email - admin only */
router.post("/resend/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can resend emails.",
        },
        403
      )
    }

    const { id } = req.params
    const log = await EmailLogs.findByPk(id)
    if (!log) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Email log not found.",
        },
        404
      )
    }

    try {
      const transporter = getTransporter()
      const mailOptions = {
        from: process.env.SMTP_FROM || '"E-Commerce Platform" <no-reply@ecom.com>',
        to: log.toEmail,
        subject: log.subject,
        html: log.body,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log(`Email successfully resent to ${log.toEmail} (MessageID: ${info.messageId})`)

      log.status = "success"
      log.errorMessage = null
      await log.save()

      return sendResponse(
        res,
        {
          success: true,
          message: "Email resent successfully.",
          data: log,
        },
        200
      )
    } catch (sendErr) {
      console.error(`Email resend delivery to ${log.toEmail} failed:`, sendErr)

      log.status = "failed"
      log.errorMessage = sendErr.message
      await log.save()

      return sendResponse(
        res,
        {
          success: false,
          message: `Resend failed: ${sendErr.message}`,
          data: log,
        },
        200
      )
    }
  } catch (error) {
    console.error("Resend email error:", error)
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
