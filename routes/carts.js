/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Carts, Products } = require("../models/index")
const sendResponse = require("../utils/response")

// GET cart of the logged-in user
router.get("/", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const items = await Carts.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
        },
      ],
    })
    return sendResponse(res, {
      success: true,
      message: "Cart fetched successfully.",
      data: items,
    }, 200)
  } catch (error) {
    console.error("GET cart error:", error)
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

// POST add a product to cart
router.post("/add", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product ID is required.",
        },
        400
      )
    }

    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty <= 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Quantity must be a positive integer.",
        },
        400
      )
    }

    // Check if product exists
    const product = await Products.findByPk(productId)
    if (!product) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found.",
        },
        404
      )
    }

    // Check if already in cart
    const exists = await Carts.findOne({
      where: { userId, productId },
    })

    if (exists) {
      exists.quantity += qty
      await exists.save()

      const itemWithProduct = await Carts.findOne({
        where: { id: exists.id },
        include: [{ model: Products, as: "product" }],
      })

      return sendResponse(res, {
        success: true,
        message: "Product quantity updated in cart.",
        data: itemWithProduct,
      }, 200)
    }

    const newItem = await Carts.create({
      userId,
      productId,
      quantity: qty,
    })

    const itemWithProduct = await Carts.findOne({
      where: { id: newItem.id },
      include: [{ model: Products, as: "product" }],
    })

    return sendResponse(res, {
      success: true,
      message: "Product added to cart.",
      data: itemWithProduct,
    }, 200)
  } catch (error) {
    console.error("POST cart/add error:", error)
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

// PUT update quantity of a product in cart
router.put("/update", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId, quantity } = req.body

    if (!productId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product ID is required.",
        },
        400
      )
    }

    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty < 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Quantity must be a non-negative integer.",
        },
        400
      )
    }

    const exists = await Carts.findOne({
      where: { userId, productId },
    })

    if (!exists) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found in cart.",
        },
        404
      )
    }

    if (qty === 0) {
      await exists.destroy()
      return sendResponse(res, {
        success: true,
        message: "Product removed from cart.",
        data: null,
      }, 200)
    }

    exists.quantity = qty
    await exists.save()

    const itemWithProduct = await Carts.findOne({
      where: { id: exists.id },
      include: [{ model: Products, as: "product" }],
    })

    return sendResponse(res, {
      success: true,
      message: "Cart item quantity updated.",
      data: itemWithProduct,
    }, 200)
  } catch (error) {
    console.error("PUT cart/update error:", error)
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

// DELETE remove a product from cart
router.delete("/remove/:productId", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId } = req.params

    const destroyed = await Carts.destroy({
      where: { userId, productId },
    })

    if (destroyed) {
      return sendResponse(res, {
        success: true,
        message: "Product removed from cart.",
      }, 200)
    } else {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found in cart.",
        },
        404
      )
    }
  } catch (error) {
    console.error("DELETE cart/remove error:", error)
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

// DELETE clear all items from cart
router.delete("/clear", async function (req, res, next) {
  try {
    const userId = req.user.userId
    await Carts.destroy({
      where: { userId },
    })

    return sendResponse(res, {
      success: true,
      message: "Cart cleared successfully.",
    }, 200)
  } catch (error) {
    console.error("DELETE cart/clear error:", error)
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
