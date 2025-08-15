/* eslint-disable @typescript-eslint/no-require-imports */
// sequelize.js
const { Sequelize } = require("sequelize")
require('dotenv').config()

const DB_DIALECT = process.env.DB_DIALECT || "mysql" // 'postgres' or 'mysql'
const DB_NAME = process.env.DB_NAME || "ecom"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_HOST = process.env.DB_HOST || "localhost"

// console.log(process.env)

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, // Set to true for SQL logging
})

module.exports = sequelize
