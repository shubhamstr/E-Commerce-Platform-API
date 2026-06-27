/* eslint-disable @typescript-eslint/no-require-imports */
// models/Wishlists.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Wishlists = sequelize.define("wishlists", {
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
})

module.exports = Wishlists
