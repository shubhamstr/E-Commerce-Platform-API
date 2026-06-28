/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Coupons, Users } = require("../models/index")
const sendResponse = require("../utils/response")
const { Op } = require("sequelize")

// GET / - List all coupons (Admin/Seller only)
router.get("/", async function (req, res, next) {
  try {
    const { userId, userType } = req.user
    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. Admin or Seller access required.",
        },
        403
      )
    }

    let whereClause = {}
    if (userType === "seller") {
      whereClause.createdById = userId
    }

    const coupons = await Coupons.findAll({
      where: whereClause,
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(res, {
      success: true,
      data: coupons,
    })
  } catch (error) {
    console.error("List coupons error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

// GET /:id - Get details of a single coupon
router.get("/:id", async function (req, res, next) {
  try {
    const { userId, userType } = req.user
    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden.",
        },
        403
      )
    }

    const coupon = await Coupons.findByPk(req.params.id)
    if (!coupon) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Coupon not found.",
        },
        404
      )
    }

    if (userType === "seller" && coupon.createdById !== userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. You do not own this coupon.",
        },
        403
      )
    }

    return sendResponse(res, {
      success: true,
      data: coupon,
    })
  } catch (error) {
    console.error("Get coupon error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

// POST / - Create a coupon (Admin/Seller only)
router.post("/", async function (req, res, next) {
  try {
    const { userId, userType } = req.user
    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. Admin or Seller access required.",
        },
        403
      )
    }

    let {
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount,
      usageLimit,
      expiryDate,
      isActive,
    } = req.body

    if (!code || !discountType || discountValue === undefined) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Code, discountType, and discountValue are required.",
        },
        400
      )
    }

    code = code.trim().toUpperCase()

    // Check unique code
    const existing = await Coupons.findOne({ where: { code } })
    if (existing) {
      return sendResponse(
        res,
        {
          success: false,
          message: `Coupon code '${code}' already exists.`,
        },
        400
      )
    }

    const coupon = await Coupons.create({
      code,
      discountType,
      discountValue,
      maxDiscountAmount: maxDiscountAmount || null,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || null,
      expiryDate: expiryDate || null,
      isActive: isActive !== undefined ? isActive : true,
      createdById: userId,
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Coupon created successfully.",
        data: coupon,
      },
      201
    )
  } catch (error) {
    console.error("Create coupon error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

// PUT /:id - Update a coupon (Admin/Seller only)
router.put("/:id", async function (req, res, next) {
  try {
    const { userId, userType } = req.user
    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. Admin or Seller access required.",
        },
        403
      )
    }

    const coupon = await Coupons.findByPk(req.params.id)
    if (!coupon) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Coupon not found.",
        },
        404
      )
    }

    if (userType === "seller" && coupon.createdById !== userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. You do not own this coupon.",
        },
        403
      )
    }

    let {
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount,
      usageLimit,
      expiryDate,
      isActive,
    } = req.body

    if (code) {
      code = code.trim().toUpperCase()
      const existing = await Coupons.findOne({
        where: {
          code,
          id: { [Op.ne]: coupon.id },
        },
      })
      if (existing) {
        return sendResponse(
          res,
          {
            success: false,
            message: `Coupon code '${code}' already exists.`,
          },
          400
        )
      }
      coupon.code = code
    }

    if (discountType) coupon.discountType = discountType
    if (discountValue !== undefined) coupon.discountValue = discountValue
    if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount || null
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount || 0
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit || null
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate || null
    if (isActive !== undefined) coupon.isActive = isActive

    await coupon.save()

    return sendResponse(res, {
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    })
  } catch (error) {
    console.error("Update coupon error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

// DELETE /:id - Delete/Deactivate a coupon (Admin/Seller only)
router.delete("/:id", async function (req, res, next) {
  try {
    const { userId, userType } = req.user
    if (userType !== "admin" && userType !== "seller") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. Admin or Seller access required.",
        },
        403
      )
    }

    const coupon = await Coupons.findByPk(req.params.id)
    if (!coupon) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Coupon not found.",
        },
        404
      )
    }

    if (userType === "seller" && coupon.createdById !== userId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Forbidden. You do not own this coupon.",
        },
        403
      )
    }

    // We can either delete it or set isActive to false. Let's physically delete it.
    await coupon.destroy()

    return sendResponse(res, {
      success: true,
      message: "Coupon deleted successfully.",
    })
  } catch (error) {
    console.error("Delete coupon error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

// POST /validate - Validate a coupon code for an order subTotal
router.post("/validate", async function (req, res, next) {
  try {
    let { code, subTotal } = req.body

    if (!code) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Coupon code is required.",
        },
        400
      )
    }

    if (subTotal === undefined || subTotal === null || isNaN(subTotal)) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Valid order subTotal is required.",
        },
        400
      )
    }

    code = code.trim().toUpperCase()
    subTotal = parseFloat(subTotal)

    const coupon = await Coupons.findOne({ where: { code } })
    if (!coupon) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid coupon code.",
        },
        404
      )
    }

    if (!coupon.isActive) {
      return sendResponse(
        res,
        {
          success: false,
          message: "This coupon is inactive.",
        },
        400
      )
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return sendResponse(
        res,
        {
          success: false,
          message: "This coupon has expired.",
        },
        400
      )
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return sendResponse(
        res,
        {
          success: false,
          message: "This coupon has reached its usage limit.",
        },
        400
      )
    }

    // Check minimum order amount
    if (coupon.minOrderAmount !== null && subTotal < parseFloat(coupon.minOrderAmount)) {
      return sendResponse(
        res,
        {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} is required to use this coupon.`,
        },
        400
      )
    }

    // Calculate discount amount
    let discountAmount = 0
    const val = parseFloat(coupon.discountValue)
    if (coupon.discountType === "percentage") {
      discountAmount = (subTotal * val) / 100
      if (coupon.maxDiscountAmount !== null) {
        const maxDisc = parseFloat(coupon.maxDiscountAmount)
        if (discountAmount > maxDisc) {
          discountAmount = maxDisc
        }
      }
    } else {
      // fixed discount
      discountAmount = val
    }

    if (discountAmount > subTotal) {
      discountAmount = subTotal
    }

    return sendResponse(res, {
      success: true,
      message: "Coupon validated successfully.",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minOrderAmount: coupon.minOrderAmount,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
    })
  } catch (error) {
    console.error("Validate coupon error:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

module.exports = router
