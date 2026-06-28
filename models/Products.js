/* eslint-disable @typescript-eslint/no-require-imports */
// models/Products.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Products = sequelize.define("products", {
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "categories",
      key: "id",
    },
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sizes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  colors: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

module.exports = Products
