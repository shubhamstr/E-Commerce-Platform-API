/* eslint-disable @typescript-eslint/no-require-imports */
const nodemailer = require("nodemailer")
const { EmailLogs } = require("../models")

/**
 * Generate SMTP transporter
 */
function getTransporter() {
  // If SMTP variables are missing, it will attempt to use a mock/fallback Ethereal SMTP or local mock
  const host = process.env.SMTP_HOST || "smtp.ethereal.email"
  const port = parseInt(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER || ""
  const pass = process.env.SMTP_PASS || ""

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })
}

/**
 * Compile template HTML
 */
function compileTemplate(templateName, context) {
  const brandColor = "#4F46E5" // Modern indigo
  const darkColor = "#1F2937"
  const lightColor = "#F9FAFB"
  const grayColor = "#6B7280"

  const header = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notification</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${lightColor}; margin: 0; padding: 20px; color: ${darkColor}; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }
        .header { background: ${darkColor}; padding: 30px 20px; text-align: center; color: #ffffff; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: ${grayColor}; border-top: 1px solid #E5E7EB; }
        .btn { display: inline-block; padding: 12px 24px; background-color: ${brandColor}; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: ${brandColor}; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }
        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }
        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }
        .text-right { text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">E-COMMERCE PLATFORM</a>
        </div>
        <div class="content">
  `

  const footer = `
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
          <p>You received this email because you registered on our platform.</p>
        </div>
      </div>
    </body>
    </html>
  `

  let body = ""

  if (templateName === "forgot-password") {
    const { name, resetLink } = context
    body = `
      <h2 style="margin-top: 0; font-size: 22px;">Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password for your E-Commerce account. Click the button below to choose a new password. This link will expire shortly.</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
      </div>
      <p style="color: ${grayColor}; font-size: 14px;">If you did not request a password reset, you can safely ignore this email.</p>
      <p style="color: ${grayColor}; font-size: 12px; word-break: break-all;">Or copy and paste this link in your browser:<br>${resetLink}</p>
    `
  } else if (templateName === "order-place") {
    const { name, orderId, items, totalAmount, shippingAddress } = context
    const itemsRows = (items || []).map(item => `
      <tr>
        <td>
          <div style="font-weight: 600;">${item.productName}</div>
          <div style="font-size: 12px; color: ${grayColor};">${item.color ? 'Color: ' + item.color : ''} ${item.size ? 'Size: ' + item.size : ''}</div>
        </td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">$${parseFloat(item.price).toFixed(2)}</td>
        <td class="text-right">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("")

    body = `
      <h2 style="margin-top: 0; color: #10B981; font-size: 22px;">Order Placed Successfully!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for shopping with us! Your order <strong>#${orderId}</strong> has been received and is now being processed.</p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">Shipping Address:</div>
        <div style="font-size: 14px; color: ${grayColor};">
          ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
          ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? ', ' + shippingAddress.addressLine2 : ''}<br>
          ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pinCode}<br>
          Phone: ${shippingAddress.mobileNumber}
        </div>
      </div>

      <h3 style="font-size: 16px; margin-top: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Order Summary</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <td colspan="3" style="font-weight: bold; padding-top: 15px;" class="text-right">Total Amount:</td>
            <td style="font-weight: bold; color: ${brandColor}; padding-top: 15px;" class="text-right">$${parseFloat(totalAmount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <div style="text-align: center;">
        <a href="${process.env.WEBSITE_URL || 'http://localhost:3000'}/track-order?orderId=${orderId}" class="btn">Track Your Order</a>
      </div>
    `
  } else if (templateName === "order-status") {
    const { name, orderId, status } = context
    const displayStatus = status.toUpperCase()
    let statusDescription = `Your order status has been updated.`
    if (status === "shipped") {
      statusDescription = `Exciting news! Your order has been shipped and is on its way to you.`
    } else if (status === "delivered") {
      statusDescription = `Your order has been delivered. We hope you enjoy your purchase!`
    } else if (status.startsWith("cancelled")) {
      statusDescription = `Your order has been cancelled.`
    }

    body = `
      <h2 style="margin-top: 0; font-size: 22px;">Order Status Update</h2>
      <p>Hello ${name},</p>
      <p>The status of your order <strong>#${orderId}</strong> has been updated to:</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <span class="badge" style="font-size: 16px; padding: 8px 20px; background-color: #EEF2F6; color: ${brandColor}; border: 1px solid #D1D5DB;">
          ${displayStatus}
        </span>
      </div>

      <p>${statusDescription}</p>

      <div style="text-align: center;">
        <a href="${process.env.WEBSITE_URL || 'http://localhost:3000'}/track-order?orderId=${orderId}" class="btn">Track Order</a>
      </div>
    `
  } else if (templateName === "seller-approved") {
    const { name, dashboardLink } = context
    body = `
      <h2 style="margin-top: 0; color: #10B981; font-size: 22px;">Congratulations! Your Account is Approved</h2>
      <p>Hello ${name},</p>
      <p>We are excited to inform you that your seller account has been approved and activated by our administrator team!</p>
      <p>You can now log in to the Seller dashboard to manage your shop, upload products, view orders, and track your business growth.</p>
      
      <div style="text-align: center;">
        <a href="${dashboardLink || 'http://localhost:3001'}" class="btn">Go to Dashboard</a>
      </div>
      
      <p>If you have any questions or require support setting up your store, feel free to reply to this email.</p>
    `
  } else {
    // Generic fallback
    body = `<p>${JSON.stringify(context)}</p>`
  }

  return header + body + footer
}

/**
 * Send email flow and log to database
 */
async function sendMail({ to, subject, templateName, context }) {
  const htmlContent = compileTemplate(templateName, context)
  
  // 1. Create a pending log in database
  const log = await EmailLogs.create({
    toEmail: to,
    subject,
    templateName,
    body: htmlContent,
    status: "pending",
  })

  try {
    const transporter = getTransporter()
    
    // 2. Deliver email
    const mailOptions = {
      from: process.env.SMTP_FROM || '"E-Commerce Platform" <no-reply@ecom.com>',
      to,
      subject,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Email successfully sent to ${to} (MessageID: ${info.messageId})`)

    // 3. Update log status to success
    log.status = "success"
    await log.save()
    return { success: true, logId: log.id }
  } catch (error) {
    console.error(`Email delivery to ${to} failed:`, error)

    // 4. Update log status to failed
    log.status = "failed"
    log.errorMessage = error.message
    await log.save()
    return { success: false, logId: log.id, error: error.message }
  }
}

module.exports = {
  sendMail,
  compileTemplate
}
