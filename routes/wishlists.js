/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Wishlists, Products } = require("../models/index")
const sendResponse = require("../utils/response")

// GET wishlist of the logged-in user
router.get("/", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const items = await Wishlists.findAll({
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
      message: "Wishlist fetched successfully.",
      data: items,
    }, 200)
  } catch (error) {
    console.error("GET wishlist error:", error)
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

// POST add a product to wishlist
router.post("/add", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId } = req.body

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

    // Check if already in wishlist
    const exists = await Wishlists.findOne({
      where: { userId, productId },
    })

    if (exists) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Product already in wishlist.",
          data: exists,
        },
        200
      )
    }

    const newItem = await Wishlists.create({
      userId,
      productId,
    })

    const itemWithProduct = await Wishlists.findOne({
      where: { id: newItem.id },
      include: [{ model: Products, as: "product" }],
    })

    return sendResponse(res, {
      success: true,
      message: "Product added to wishlist.",
      data: itemWithProduct,
    }, 200)
  } catch (error) {
    console.error("POST wishlist/add error:", error)
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

// POST toggle a product in wishlist (convenient helper endpoint)
router.post("/toggle", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId } = req.body

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

    const exists = await Wishlists.findOne({
      where: { userId, productId },
    })

    if (exists) {
      await exists.destroy()
      return sendResponse(res, {
        success: true,
        message: "Product removed from wishlist.",
        action: "removed",
      }, 200)
    } else {
      const newItem = await Wishlists.create({
        userId,
        productId,
      })
      const itemWithProduct = await Wishlists.findOne({
        where: { id: newItem.id },
        include: [{ model: Products, as: "product" }],
      })
      return sendResponse(res, {
        success: true,
        message: "Product added to wishlist.",
        action: "added",
        data: itemWithProduct,
      }, 200)
    }
  } catch (error) {
    console.error("POST wishlist/toggle error:", error)
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

// DELETE remove a product from wishlist
router.delete("/remove/:productId", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { productId } = req.params

    const destroyed = await Wishlists.destroy({
      where: { userId, productId },
    })

    if (destroyed) {
      return sendResponse(res, {
        success: true,
        message: "Product removed from wishlist.",
      }, 200)
    } else {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found in wishlist.",
        },
        404
      )
    }
  } catch (error) {
    console.error("DELETE wishlist/remove error:", error)
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
