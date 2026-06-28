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
var categoriesRouter = require("./routes/categories")
var productsRouter = require("./routes/products")
var wishlistsRouter = require("./routes/wishlists")
var contactsRouter = require("./routes/contacts")
var cartsRouter = require("./routes/carts")
var ordersRouter = require("./routes/orders")
var reviewsRouter = require("./routes/reviews")
var notificationsRouter = require("./routes/notifications")
var emailLogsRouter = require("./routes/emailLogs")
var couponsRouter = require("./routes/coupons")

var app = express()

app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

const swagger = require("./utils/swagger")
app.use("/api-docs", swagger.serve, swagger.setup)

app.use(authenticateToken)

// Database connection, synchronization and seeders
sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.")
    if (NODE_ENV === "development") {
      return sequelize.sync()
    }
  })
  .then(() => {
    return createDefaultAdmin()
  })
  .catch(err => {
    console.error("Database initialization failed:", err)
  })

app.use("/api/", indexRouter)
app.use("/api/user", usersRouter)
app.use("/api/address", addressesRouter)
app.use("/api/category", categoriesRouter)
app.use("/api/product", productsRouter)
app.use("/api/wishlist", wishlistsRouter)
app.use("/api/contact", contactsRouter)
app.use("/api/cart", cartsRouter)
app.use("/api/order", ordersRouter)
app.use("/api/review", reviewsRouter)
app.use("/api/notification", notificationsRouter)
app.use("/api/email-log", emailLogsRouter)
app.use("/api/coupon", couponsRouter)

module.exports = app
