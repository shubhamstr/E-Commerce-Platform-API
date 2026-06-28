/* eslint-disable @typescript-eslint/no-require-imports */
// models/Coupons.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const Coupons = sequelize.define("coupons", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
})

module.exports = Coupons
