/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Users, Addresses } = require("../models/index")
const sendResponse = require("../utils/response")

/* GET address listing. */
router.get("/", async function (req, res, next) {
  try {
    console.log("get addresses")
    // gets addresses
    const addrResp = await Addresses.findAll({
      attributes: [
        "id",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "pinCode",
        "addressType",
        "isDefault",
        "mobileNumber",
      ],
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
        },
      ],
    })
    if (addrResp.length) {
      console.log(addrResp)
      return sendResponse(
        res,
        {
          success: true,
          message: "Addresses fetched successfully.",
          data: addrResp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No addresses found",
      },
      404
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
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

/* GET address single. */
router.get("/get/:id", async function (req, res, next) {
  try {
    const { id } = req.params
    const resp = await Addresses.findOne({
      where: { id },
      attributes: [
        "id",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "pinCode",
        "addressType",
        "isDefault",
        "mobileNumber",
      ],
      // logging: console.log,
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
        },
      ],
    })
    if (resp) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Address fetched successfully.",
          data: resp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No address found",
      },
      404
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
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

/* POST address add. */
router.post("/add", async function (req, res, next) {
  try {
    console.log(req.body)
    const {
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      addressType,
      mobileNumber,
    } = req.body

    const exists = await Addresses.findOne({
      where: {
        userId,
        isDefault: true,
      },
    })
    const isDefault = true
    if (exists) {
      isDefault = false
    }

    const resp = await Addresses.create({
      userId: userId,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      pinCode: pinCode,
      addressType: addressType,
      isDefault: isDefault,
      mobileNumber: mobileNumber,
    })
    console.log("Address added:", resp.toJSON())

    return sendResponse(res, {
      message: "Address added successfully.",
      data: resp,
    })
  } catch (error) {
    console.error(error)
    return sendResponse(
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

/* POST address update. */
router.post("/update/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const exists = await Addresses.findOne({ where: { id } })
    if (!exists) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Address not exists.",
        },
        404
      )
    }
    const [updatedCount] = await Addresses.update(
      { ...req.body }, // fields to update
      {
        where: { id }, // condition
      }
    )
    if (updatedCount) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Address updated successfully.",
          data: updatedCount,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "Error while updating",
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
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

/* POST address delete. */
router.post("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const exists = await Addresses.findOne({ where: { id } })
    if (!exists) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Address not exists.",
        },
        404
      )
    }
    const resp = await Addresses.destroy({
      where: { id },
    })
    if (resp) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Address deleted successfully.",
          data: resp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "Error while deleting",
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
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

/* GET address by userid. */
router.get("/get/user/:id", async function (req, res, next) {
  try {
    const { id } = req.params
    const resp = await Addresses.findAll({
      where: { userId: id },
      attributes: [
        "id",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "pinCode",
        "addressType",
        "isDefault",
        "mobileNumber",
      ],
      // logging: console.log,
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
        },
      ],
    })
    if (resp) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Address fetched successfully.",
          data: resp,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No address found",
      },
      404
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
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
