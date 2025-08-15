/* eslint-disable @typescript-eslint/no-require-imports */
// models/Addresses.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Addresses = sequelize.define("addresses", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
})

module.exports = Addresses
