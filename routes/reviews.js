/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Reviews, Products, Orders, OrderItems, Users } = require("../models/index")
const sendResponse = require("../utils/response")

// POST /api/review - Create or update a review
router.post("/", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { orderId, productId, rating, comment } = req.body

    if (!orderId || !rating) {
      return sendResponse(
        res,
        {
          success: false,
          message: "orderId and rating are required.",
        },
        400
      )
    }

    const ratingVal = parseInt(rating)
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Rating must be an integer between 1 and 5.",
        },
        400
      )
    }

    // 1. Verify that order exists and belongs to user
    let order
    if (productId) {
      order = await Orders.findOne({
        where: { id: orderId, userId },
        include: [
          {
            model: OrderItems,
            as: "items",
            where: { productId },
          },
        ],
      })
    } else {
      order = await Orders.findOne({
        where: { id: orderId, userId },
      })
    }

    if (!order) {
      return sendResponse(
        res,
        {
          success: false,
          message: productId
            ? "Order not found, does not belong to you, or does not contain the specified product."
            : "Order not found or does not belong to you.",
        },
        404
      )
    }

    // 2. Enforce only delivered orders can be reviewed
    if (!order.status || order.status.toLowerCase() !== "delivered") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Reviews can only be submitted after the order has been delivered.",
        },
        400
      )
    }

    // 3. Check if review already exists
    const targetProductId = productId || null
    let review = await Reviews.findOne({
      where: { userId, orderId, productId: targetProductId },
    })

    if (review) {
      // Update existing review
      review.rating = ratingVal
      review.comment = comment || ""
      await review.save()

      return sendResponse(
        res,
        {
          success: true,
          message: "Review updated successfully.",
          data: review,
        },
        200
      )
    } else {
      // Create new review
      review = await Reviews.create({
        userId,
        orderId,
        productId: targetProductId,
        rating: ratingVal,
        comment: comment || "",
      })

      return sendResponse(
        res,
        {
          success: true,
          message: "Review submitted successfully.",
          data: review,
        },
        201
      )
    }
  } catch (error) {
    console.error("POST review error:", error)
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

// GET /api/review/product/:productId - Get reviews for a product
router.get("/product/:productId", async function (req, res, next) {
  try {
    const { productId } = req.params
    const reviews = await Reviews.findAll({
      where: { productId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(
      res,
      {
        success: true,
        data: reviews,
      },
      200
    )
  } catch (error) {
    console.error("GET product reviews error:", error)
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

// GET /api/review/my - Get user's own reviews
router.get("/my", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const reviews = await Reviews.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["id", "name", "imageUrl", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(
      res,
      {
        success: true,
        data: reviews,
      },
      200
    )
  } catch (error) {
    console.error("GET my reviews error:", error)
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
