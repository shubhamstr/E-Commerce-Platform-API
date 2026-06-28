/* eslint-disable @typescript-eslint/no-require-imports */
// routes/auditLogs.js
var express = require("express")
var router = express.Router()
const { AuditLogs, Users } = require("../models/index")
const { Op } = require("sequelize")
const sendResponse = require("../utils/response")

/* GET audit logs - admin only */
router.get("/", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user?.userId)
    if (!user || user.userType !== "admin") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only administrators can access audit logs.",
        },
        403
      )
    }

    const { action, status, entityType, userQuery, limit, offset } = req.query

    const where = {}

    if (action) {
      where.action = action
    }

    if (status) {
      where.status = status
    }

    if (entityType) {
      where.entityType = entityType
    }

    if (userQuery) {
      where[Op.or] = [
        { userEmail: { [Op.like]: `%${userQuery}%` } },
        { userRole: { [Op.like]: `%${userQuery}%` } },
      ]
    }

    const queryLimit = limit ? parseInt(limit, 10) : 200
    const queryOffset = offset ? parseInt(offset, 10) : 0

    const logs = await AuditLogs.findAll({
      where,
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "userType"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: queryLimit,
      offset: queryOffset,
    })

    return sendResponse(res, { success: true, data: logs }, 200)
  } catch (error) {
    console.error("GET audit logs error:", error)
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
