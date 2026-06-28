/* eslint-disable @typescript-eslint/no-require-imports */
// models/SystemLogs.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const SystemLogs = sequelize.define("system_logs", {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "info",
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})

module.exports = SystemLogs
