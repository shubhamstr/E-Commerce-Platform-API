/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const sendResponse = require("../utils/response")

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    await sequelize.authenticate()
    sendResponse(res, {
      message:
        "Server is running... Connection has been established successfully.",
    })
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      500
    )
  }
})

module.exports = router
