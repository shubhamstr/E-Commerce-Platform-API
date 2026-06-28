/* eslint-disable @typescript-eslint/no-require-imports */
// utils/auditLogger.js
const { AuditLogs } = require("../models")

/**
 * Logs an audit event to the database.
 * 
 * @param {Object} req Express request object (optional)
 * @param {Object} options Audit options
 * @param {string} options.action The action performed (e.g., 'CREATE_PRODUCT')
 * @param {string} [options.entityType] The type of the target resource (e.g., 'Product')
 * @param {string|number} [options.entityId] The ID of the target resource
 * @param {string} [options.description] Human-readable description
 * @param {Object|string} [options.changes] State changes (e.g., { old: ..., new: ... })
 * @param {string} [options.status] Action status ('success' or 'failure')
 * @param {Object} [options.actorOverride] Override actor context (e.g. for login attempts: { userId, email, role })
 */
const logAudit = async (req, { action, entityType, entityId, description, changes, status = "success", actorOverride = null }) => {
  try {
    let userId = null
    let userEmail = null
    let userRole = null

    // Extract actor details from request token context
    if (req && req.user) {
      userId = req.user.userId || null
      userEmail = req.user.email || null
      userRole = req.user.userType || null
    }

    // Override actor details if provided explicitly (e.g., for login/register/reset flows)
    if (actorOverride) {
      if (actorOverride.userId) userId = actorOverride.userId
      if (actorOverride.email) userEmail = actorOverride.email
      if (actorOverride.role) userRole = actorOverride.role
    }

    // Format changes field
    let changesStr = null
    if (changes) {
      if (typeof changes === "object") {
        changesStr = JSON.stringify(changes)
      } else {
        changesStr = String(changes)
      }
    }

    // Capture network and agent details
    let ipAddress = null
    let userAgent = null
    if (req) {
      ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || null
      userAgent = req.headers["user-agent"] || null
    }

    // Create Audit Log entry
    await AuditLogs.create({
      userId,
      userEmail,
      userRole,
      action,
      entityType,
      entityId: entityId ? String(entityId) : null,
      description,
      changes: changesStr,
      status,
      ipAddress,
      userAgent,
    })
  } catch (err) {
    console.error("Audit logger failed to write to database:", err.message)
  }
}

module.exports = {
  logAudit,
}
