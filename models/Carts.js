/* eslint-disable @typescript-eslint/no-require-imports */
// models/Carts.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Carts = sequelize.define("carts", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
})

module.exports = Carts
