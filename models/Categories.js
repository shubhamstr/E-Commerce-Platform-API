/* eslint-disable @typescript-eslint/no-require-imports */
// models/Categories.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Categories = sequelize.define("categories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
})

module.exports = Categories
