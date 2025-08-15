/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const sequelize = require("../utils/db")
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

/* GET db operations. */
router.get("/db", async function (req, res, next) {
  const { type } = req.query
  const dbSync = async (val) => {
    try {
      if (val === "sync") {
        await sequelize.sync({ alter: true })
      } else if (val === "force-sync") {
        await sequelize.sync({ force: true })
      }
      return { success: true, message: "Models synced." }
    } catch (error) {
      return { success: false, error: error }
    }
  }
  const resp = await dbSync(type)
  const buttonLinks = [
    { label: "Back", url: "/" },
    { label: "Sync database models", url: "/db?type=sync" },
    {
      label: "Forcefully sync database models (it will drop and recreate)",
      url: "/db?type=force-sync",
    },
  ]
  let respMessage = ""
  if (resp.success) {
    respMessage = resp.message
  } else {
    respMessage = resp.error
  }
  res.render("db", { links: buttonLinks, respMessage: respMessage })
})

module.exports = router
