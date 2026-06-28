/* eslint-disable @typescript-eslint/no-require-imports */
// models/User.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Users = sequelize.define("users", {
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user"
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})
module.exports = Users
