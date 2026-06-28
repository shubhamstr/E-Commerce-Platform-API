/* eslint-disable @typescript-eslint/no-require-imports */
// models/Notifications.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Notifications = sequelize.define("notifications", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
})

module.exports = Notifications
