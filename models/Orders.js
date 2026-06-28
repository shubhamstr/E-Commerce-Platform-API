/* eslint-disable @typescript-eslint/no-require-imports */
// models/Orders.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Orders = sequelize.define("orders", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "addresses",
      key: "id",
    },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
})

module.exports = Orders
