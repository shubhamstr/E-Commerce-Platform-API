/* eslint-disable @typescript-eslint/no-require-imports */
// models/EmailLogs.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const EmailLogs = sequelize.define("email_logs", {
  toEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  templateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})

module.exports = EmailLogs
