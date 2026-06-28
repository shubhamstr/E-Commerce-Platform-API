/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const { Carts, Products, Orders, OrderItems, Addresses, Users, Reviews } = require("../models/index")
const sendResponse = require("../utils/response")
const sequelize = require("../utils/db")
const { triggerNotification } = require("../utils/notificationHelper")
const { sendMail } = require("../utils/mail")

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

    // Send order confirmation email
    try {
      const user = await Users.findByPk(userId)
      if (user) {
        const emailItems = cartItems.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))

        await sendMail({
          to: user.email,
          subject: `Order Confirmation - Order #${order.id}`,
          templateName: "order-place",
          context: {
            name: `${user.firstName} ${user.lastName}`,
            orderId: order.id,
            items: emailItems,
            totalAmount: order.totalAmount,
            shippingAddress: address
          }
        })
      }
    } catch (mailErr) {
      console.error("Order placed email failed to send:", mailErr)
    }

    // Trigger notification
    triggerNotification(
      "order_placed",
      "New Order Placed",
      `Order #${order.id} has been placed. Total amount: $${order.totalAmount}`
    ).catch(err => console.error("Notification trigger failed:", err))

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
    let { page, limit } = req.query

    let queryOptions = {
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
        {
          model: Reviews,
          as: "reviews",
        },
      ],
      order: [["createdAt", "DESC"]],
    }

    if (page && limit) {
      page = parseInt(page)
      limit = parseInt(limit)
      queryOptions.limit = limit
      queryOptions.offset = (page - 1) * limit

      const count = await Orders.count({ where: { userId } })
      const orders = await Orders.findAll(queryOptions)

      return sendResponse(res, {
        success: true,
        data: {
          records: orders,
          total: count,
        },
      })
    } else {
      const orders = await Orders.findAll(queryOptions)
      return sendResponse(res, {
        success: true,
        data: orders,
      })
    }
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
        {
          model: Reviews,
          as: "reviews",
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

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "cancelled by customer",
      "cancelled by seller",
      "cancelled by admin"
    ]
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

    let finalStatus = status
    if (status === "cancelled") {
      if (userType === "admin") {
        finalStatus = "cancelled by admin"
      } else if (userType === "seller") {
        finalStatus = "cancelled by seller"
      }
    }

    order.status = finalStatus
    await order.save()

    // Send status change email
    try {
      const customer = await Users.findByPk(order.userId)
      if (customer) {
        await sendMail({
          to: customer.email,
          subject: `Order Update - Order #${order.id}`,
          templateName: "order-status",
          context: {
            name: `${customer.firstName} ${customer.lastName}`,
            orderId: order.id,
            status: finalStatus
          }
        })
      }
    } catch (mailErr) {
      console.error("Order status update email failed to send:", mailErr)
    }

    if (finalStatus.startsWith("cancelled")) {
      triggerNotification(
        "order_cancelled",
        "Order Cancelled",
        `Order #${order.id} has been cancelled by ${userType}.`
      ).catch(err => console.error("Notification trigger failed:", err))
    }

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

// PUT /:id/cancel - cancel order (Customer/User only, if status is pending or processing)
router.put("/:id/cancel", async function (req, res, next) {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const order = await Orders.findOne({ where: { id, userId } })
    if (!order) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Order not found or does not belong to you.",
        },
        404
      )
    }

    if (order.status !== "pending" && order.status !== "processing") {
      return sendResponse(
        res,
        {
          success: false,
          message: `Cannot cancel order. Current status is '${order.status}'. Only pending or processing orders can be cancelled.`,
        },
        400
      )
    }

    order.status = "cancelled by customer"
    await order.save()

    // Send status change email
    try {
      const customer = await Users.findByPk(order.userId)
      if (customer) {
        await sendMail({
          to: customer.email,
          subject: `Order Cancelled - Order #${order.id}`,
          templateName: "order-status",
          context: {
            name: `${customer.firstName} ${customer.lastName}`,
            orderId: order.id,
            status: "cancelled by customer"
          }
        })
      }
    } catch (mailErr) {
      console.error("Order cancel email failed to send:", mailErr)
    }

    triggerNotification(
      "order_cancelled",
      "Order Cancelled",
      `Order #${order.id} has been cancelled by customer.`
    ).catch(err => console.error("Notification trigger failed:", err))

    return sendResponse(res, {
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    })
  } catch (error) {
    console.error("Cancel order error:", error)
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

// GET /track - track order details by orderId without authentication
router.get("/track", async function (req, res, next) {
  try {
    const { orderId } = req.query
    if (!orderId) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Order ID is required.",
        },
        400
      )
    }

    const order = await Orders.findOne({
      where: { id: orderId },
      include: [
        {
          model: Addresses,
          as: "address",
          // Mask sensitive details
          attributes: ["city", "state", "pinCode"],
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
    })

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

    return sendResponse(res, {
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Track order error:", error)
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
