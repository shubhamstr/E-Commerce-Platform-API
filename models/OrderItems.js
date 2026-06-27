/* eslint-disable @typescript-eslint/no-require-imports */
// models/OrderItems.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const OrderItems = sequelize.define("order_items", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "orders",
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "products",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
})

module.exports = OrderItems
