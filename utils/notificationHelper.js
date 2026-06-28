/* eslint-disable @typescript-eslint/no-require-imports */
const { Users, Notifications } = require("../models/index")
const { Op } = require("sequelize")

/**
 * Creates notifications for target users based on type.
 * @param {string} type - 'order_placed', 'order_cancelled', 'new_seller', 'review_added'
 * @param {string} title - Notification title
 * @param {string} message - Notification message body
 * @param {object} [options] - Optional transaction or extra params
 */
async function triggerNotification(type, title, message, options = {}) {
  try {
    let whereClause = {}
    
    if (type === "new_seller") {
      // Only admins need to see a new seller registration request
      whereClause = { userType: "admin" }
    } else {
      // Order placed, order cancelled, and review added go to admins and active sellers
      whereClause = {
        [Op.or]: [
          { userType: "admin" },
          { userType: "seller", isActive: true }
        ]
      }
    }

    const targetUsers = await Users.findAll({
      where: whereClause,
      attributes: ["id"],
      transaction: options.transaction
    })

    if (targetUsers.length === 0) return

    const notificationsData = targetUsers.map(user => ({
      userId: user.id,
      title,
      message,
      type,
      isRead: false
    }))

    await Notifications.bulkCreate(notificationsData, {
      transaction: options.transaction
    })
  } catch (error) {
    console.error("Error triggering notifications:", error)
  }
}

module.exports = {
  triggerNotification
}
