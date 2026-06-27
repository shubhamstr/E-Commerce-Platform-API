/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Carts, Products, Orders, OrderItems, Addresses, Users } = require("../models/index")
const sendResponse = require("../utils/response")
const sequelize = require("../utils/db")

// POST checkout - place an order from the user's cart
router.post("/checkout", async function (req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const userId = req.user.userId
    const { addressId } = req.body

    if (!addressId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Address is required.",
        },
        400
      )
    }

    // 1. Verify address exists and belongs to user
    const address = await Addresses.findOne({
      where: { id: addressId, userId },
    })
    if (!address) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Selected address not found or does not belong to user.",
        },
        404
      )
    }

    // 2. Fetch user's cart items
    const cartItems = await Carts.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
        },
      ],
    })

    if (!cartItems || cartItems.length === 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Your cart is empty. Cannot place an order.",
        },
        400
      )
    }

    // 3. Calculate total amount
    let totalAmount = 0
    for (const item of cartItems) {
      if (!item.product) {
        return sendResponse(
          res,
          {
            success: false,
            message: `Product info missing for item in cart.`,
          },
          400
        )
      }
      totalAmount += (item.product.price || 0) * item.quantity
    }

    // 4. Create Order
    const order = await Orders.create(
      {
        userId,
        addressId,
        totalAmount,
        status: "pending",
      },
      { transaction }
    )

    // 5. Create OrderItems
    for (const item of cartItems) {
      await OrderItems.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
        { transaction }
      )
    }

    // 6. Clear user's cart
    await Carts.destroy({
      where: { userId },
      transaction,
    })

    await transaction.commit()

    return sendResponse(
      res,
      {
        success: true,
        message: "Order placed successfully.",
        data: {
          orderId: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
        },
      },
      201
    )
  } catch (error) {
    await transaction.rollback()
    console.error("Checkout error:", error)
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

// GET /my - fetch logged-in user's orders
router.get("/my", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const orders = await Orders.findAll({
      where: { userId },
      include: [
        {
          model: Addresses,
          as: "address",
        },
        {
          model: OrderItems,
          as: "items",
          include: [
            {
              model: Products,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(res, {
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Fetch my orders error:", error)
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

// GET / - fetch all orders (Admin/Seller only)
router.get("/", async function (req, res, next) {
  try {
    const { userType } = req.user
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

    const orders = await Orders.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber"],
        },
        {
          model: Addresses,
          as: "address",
        },
        {
          model: OrderItems,
          as: "items",
          include: [
            {
              model: Products,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return sendResponse(res, {
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Fetch all orders error:", error)
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

// PUT /:id/status - update order status (Admin/Seller only)
router.put("/:id/status", async function (req, res, next) {
  try {
    const { userType } = req.user
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

    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!allowedStatuses.includes(status)) {
      return sendResponse(
        res,
        {
          success: false,
          message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
        },
        400
      )
    }

    const order = await Orders.findByPk(id)
    if (!order) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Order not found.",
        },
        404
      )
    }

    order.status = status
    await order.save()

    return sendResponse(res, {
      success: true,
      message: "Order status updated successfully.",
      data: order,
    })
  } catch (error) {
    console.error("Update order status error:", error)
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
