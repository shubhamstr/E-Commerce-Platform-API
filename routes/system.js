/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { SystemLogs, Users } = require("../models/index")
const sequelize = require("../utils/db")
const sendResponse = require("../utils/response")

/* GET system health status - admin only */
router.get("/health", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can view health metrics.",
        },
        403
      )
    }

    // Check database connection and measure latency
    const startDb = Date.now()
    let dbStatus = "healthy"
    let dbLatency = 0
    try {
      await sequelize.authenticate()
      dbLatency = Date.now() - startDb
    } catch (dbErr) {
      dbStatus = "unhealthy"
    }

    // Node.js process and OS statistics
    const healthInfo = {
      status: "healthy",
      timestamp: new Date(),
      uptime: process.uptime(), // seconds
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
      },
    }

    return sendResponse(res, { success: true, data: healthInfo }, 200)
  } catch (error) {
    console.error("GET health error:", error)
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

/* GET system logs - admin only */
router.get("/logs", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin can view system logs.",
        },
        403
      )
    }

    const logs = await SystemLogs.findAll({
      order: [["createdAt", "DESC"]],
      limit: 200, // retrieve up to 200 recent logs
    })

    return sendResponse(res, { success: true, data: logs }, 200)
  } catch (error) {
    console.error("GET system logs error:", error)
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
