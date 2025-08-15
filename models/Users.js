/* eslint-disable @typescript-eslint/no-require-imports */
// models/User.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")
const Addresses = require("./Addresses")

const Users = sequelize.define("users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

// Users.hasMany(Addresses, {
//   foreignKey: 'userId',   // foreign key in Post table
//   as: 'addresses'             // alias for relation
// });

module.exports = Users
