/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var cors = require("cors")
const sequelize = require("./utils/db")
const { authenticateToken } = require("./utils/auth.middleware")
const { createDefaultAdmin } = require("./utils/seeders")
require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV || "development"

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var addressesRouter = require("./routes/addresses")

var app = express()

app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(authenticateToken)

// seeders
createDefaultAdmin()

console.log("Server is running...")

sequelize.authenticate()
console.log("Connection has been established successfully.")

if (NODE_ENV === "development") {
  sequelize.sync({ alter: true })
}

app.use("/api/", indexRouter)
app.use("/api/user", usersRouter)
app.use("/api/address", addressesRouter)

module.exports = app
