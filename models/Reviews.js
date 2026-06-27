/* eslint-disable @typescript-eslint/no-require-imports */
// models/Reviews.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Reviews = sequelize.define("reviews", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})

module.exports = Reviews
