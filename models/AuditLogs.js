/* eslint-disable @typescript-eslint/no-require-imports */
// models/AuditLogs.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const AuditLogs = sequelize.define("audit_logs", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  changes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "success",
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})

module.exports = AuditLogs
