import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import * as ejs from 'ejs'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Resend (if API key available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Initialize Nodemailer transporter (Gmail fallback)
const nodemailerTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // App-specific password, not regular password
  }
})

// Email templates directory
const templatesDir = path.join(process.cwd(), 'src', 'templates', 'email')

// Helper function to render EJS templates
async function renderTemplate(templateName: string, data: any): Promise<string> {
  try {
    const templatePath = path.join(templatesDir, `${templateName}.ejs`)
    const template = fs.readFileSync(templatePath, 'utf8')
    return ejs.render(template, data)
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error)
    throw error
  }
}

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    unit: string
  }>
  total: number
  deliveryAddress: string
  deliveryDate: string
  deliveryTime: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity} ${item.unit}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.quantity * item.price).toLocaleString()}</td>
      </tr>
    `).join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - Marketdotcom</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Marketdotcom</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
          </div>

          <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 10px 10px; padding: 30px;">
            <h2 style="color: #f97316; margin-top: 0;">Thank you for your order!</h2>
            <p>Hi ${data.customerName},</p>
            <p>Your order has been successfully placed and confirmed. Here are the details:</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
              <p><strong>Delivery Time:</strong> ${data.deliveryTime}</p>
            </div>

            <h3 style="color: #333;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6;">Grand Total:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6; color: #f97316;">₦${data.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1976d2;">Delivery Information</h4>
              <p><strong>Delivery Address:</strong><br>${data.deliveryAddress}</p>
              <p style="color: #666; font-size: 14px;">Your order will be delivered within 4 hours of your selected delivery time. You'll receive a tracking update once your order is on the way.</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                If you have any questions about your order, please contact our support team at
                <a href="mailto:support@marketdotcom.com" style="color: #f97316;">support@marketdotcom.com</a>
              </p>
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                Thank you for choosing Marketdotcom!
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Try Resend first (if API key is available)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Sending order confirmation email via Resend...')

        const result = await resend.emails.send({
          from: 'Marketdotcom <onboarding@resend.dev>',
          to: data.customerEmail,
          subject: `Order Confirmation - ${data.orderId}`,
          html: emailHtml,
        })

        console.log('✅ Order confirmation email sent successfully via Resend')
        return result
      } catch (resendError) {
        console.warn('⚠️  Resend failed, falling back to Nodemailer:', resendError instanceof Error ? resendError.message : String(resendError))
      }
    }

    // Fallback to Nodemailer with Gmail
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log('📧 Sending order confirmation email via Gmail...')

        const mailOptions = {
          from: `"Marketdotcom" <${process.env.GMAIL_USER}>`,
          to: data.customerEmail,
          subject: `Order Confirmation - ${data.orderId}`,
          html: emailHtml,
        }

        const result = await nodemailerTransporter.sendMail(mailOptions)
        console.log('✅ Order confirmation email sent successfully via Gmail')
        return result
      } catch (nodemailerError) {
        console.error('❌ Nodemailer failed:', nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError))
        throw nodemailerError
      }
    }

    // If neither service is configured, throw an error
    throw new Error('No email service configured. Please set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD')
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

export async function sendAdminOrderNotification(data: OrderEmailData) {
  try {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity} ${item.unit}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.quantity * item.price).toLocaleString()}</td>
      </tr>
    `).join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Received - Marketdotcom</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Marketdotcom</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Order Received</p>
          </div>

          <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 10px 10px; padding: 30px;">
            <h2 style="color: #f97316; margin-top: 0;">New Order Alert!</h2>
            <p>A new order has been placed on Marketdotcom. Please process it promptly.</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
              <p><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
              <p><strong>Delivery Time:</strong> ${data.deliveryTime}</p>
            </div>

            <h3 style="color: #333;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Unit Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8f9fa; font-weight: bold;">
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6;">Grand Total:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6; color: #f97316;">₦${data.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1976d2;">Delivery Information</h4>
              <p><strong>Delivery Address:</strong><br>${data.deliveryAddress}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Orders</a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                Please ensure timely processing and delivery of this order.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send to admin email (you should configure this in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@marketdotcom.com'

    // Try Resend first (if API key is available)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Sending admin order notification via Resend...')

    const result = await resend.emails.send({
      from: 'Marketdotcom <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Order Received - ${data.orderId}`,
      html: emailHtml,
    })

        console.log('✅ Admin order notification sent successfully via Resend')
        return result
      } catch (resendError) {
        console.warn('⚠️  Resend failed, falling back to Nodemailer:', resendError instanceof Error ? resendError.message : String(resendError))
      }
    }

    // Fallback to Nodemailer with Gmail
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log('📧 Sending admin order notification via Gmail...')

        const mailOptions = {
          from: `"Marketdotcom" <${process.env.GMAIL_USER}>`,
          to: adminEmail,
          subject: `New Order Received - ${data.orderId}`,
          html: emailHtml,
        }

        const result = await nodemailerTransporter.sendMail(mailOptions)
        console.log('✅ Admin order notification sent successfully via Gmail')
        return result
      } catch (nodemailerError) {
        console.error('❌ Nodemailer failed:', nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError))
        throw nodemailerError
      }
    }

    // If neither service is configured, throw an error
    throw new Error('No email service configured. Please set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD')
  } catch (error) {
    console.error('Error sending admin order notification:', error)
    throw error
  }
}

export async function sendEmailVerificationEmail(email: string, verificationCode: string) {
  try {
    // Prepare template data
    const templateData = {
      verificationCode,
      email,
      appName: 'Marketdotcom',
      currentYear: new Date().getFullYear()
    }

    // Try Gmail first (more reliable for sending to any email)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log('📧 Sending email via Gmail...')

        // Render EJS template
        const emailHtml = await renderTemplate('email-verification', templateData)

        const mailOptions = {
          from: `"Marketdotcom" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: '🔐 Your Verification Code - Marketdotcom',
          html: emailHtml,
        }

        const result = await nodemailerTransporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully via Gmail')
        return result
      } catch (nodemailerError) {
        console.error('❌ Gmail failed, falling back to Resend:', nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError))
      }
    }

    // Fallback to Resend (if API key is available)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Sending email via Resend...')

        // Render EJS template
        const emailHtml = await renderTemplate('email-verification', templateData)

        const result = await resend.emails.send({
          from: 'Marketdotcom <onboarding@resend.dev>',
          to: email,
          subject: '🔐 Your Verification Code - Marketdotcom',
          html: emailHtml,
        })

        console.log('✅ Email sent successfully via Resend')
        return result
      } catch (resendError) {
        console.warn('⚠️  Resend failed:', resendError instanceof Error ? resendError.message : String(resendError))
        throw resendError
      }
    }

    // If neither service is configured, throw an error
    throw new Error('No email service configured. Please set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD')

  } catch (error) {
    console.error('❌ Error sending email verification:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    // Prepare template data
    const templateData = {
      resetUrl,
      email,
      appName: 'Marketdotcom'
    }

    // Try Resend first (if API key is available)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Sending password reset email via Resend...')

        // Render EJS template
        const emailHtml = await renderTemplate('password-reset', templateData)

        const result = await resend.emails.send({
          from: 'Marketdotcom <onboarding@resend.dev>',
          to: email,
          subject: 'Reset Your Password - Marketdotcom',
          html: emailHtml,
        })

        console.log('✅ Password reset email sent successfully via Resend')
        return result
      } catch (resendError) {
        console.warn('⚠️  Resend failed, falling back to Nodemailer:', resendError instanceof Error ? resendError.message : String(resendError))
      }
    }

    // Fallback to Nodemailer with Gmail
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log('📧 Sending password reset email via Gmail...')

        // Render EJS template
        const emailHtml = await renderTemplate('password-reset', templateData)

        const mailOptions = {
          from: `"Marketdotcom" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Reset Your Password - Marketdotcom',
          html: emailHtml,
        }

        const result = await nodemailerTransporter.sendMail(mailOptions)
        console.log('✅ Password reset email sent successfully via Gmail')
        return result
      } catch (nodemailerError) {
        console.error('❌ Nodemailer failed:', nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError))
        throw nodemailerError
      }
    }

    // If neither service is configured, throw an error
    throw new Error('No email service configured. Please set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD')

  } catch (error) {
    console.error('❌ Error sending password reset email:', error)
    throw error
  }
}

export async function sendOrderStatusUpdateEmail(
  orderId: string,
  customerEmail: string,
  customerName: string,
  status: string,
  deliveryInfo?: {
    date: string
    time: string
    address: string
  }
) {
  try {
    const statusMessages = {
      confirmed: {
        title: "Order Confirmed",
        message: "Your order has been confirmed and is being prepared.",
        color: "#22c55e"
      },
      processing: {
        title: "Order Processing",
        message: "Your order is currently being processed and packaged.",
        color: "#3b82f6"
      },
      shipped: {
        title: "Order Shipped",
        message: "Your order has been shipped and is on its way to you.",
        color: "#8b5cf6"
      },
      delivered: {
        title: "Order Delivered",
        message: "Your order has been successfully delivered. Enjoy your fresh products!",
        color: "#10b981"
      }
    }

    const statusInfo = statusMessages[status as keyof typeof statusMessages] || {
      title: "Order Update",
      message: `Your order status has been updated to: ${status}`,
      color: "#6b7280"
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${statusInfo.title} - Marketdotcom</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Marketdotcom</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Status Update</p>
          </div>

          <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 10px 10px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: ${statusInfo.color}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">✓</span>
              </div>
              <h2 style="color: ${statusInfo.color}; margin: 0;">${statusInfo.title}</h2>
            </div>

            <p>Hi ${customerName},</p>
            <p>${statusInfo.message}</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
              ${deliveryInfo ? `
                <p><strong>Delivery Date:</strong> ${deliveryInfo.date}</p>
                <p><strong>Delivery Time:</strong> ${deliveryInfo.time}</p>
                <p><strong>Delivery Address:</strong> ${deliveryInfo.address}</p>
              ` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                Thank you for choosing Marketdotcom!
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Try Resend first (if API key is available)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Sending order status update via Resend...')

    const result = await resend.emails.send({
      from: 'Marketdotcom <onboarding@resend.dev>',
      to: customerEmail,
      subject: `${statusInfo.title} - Order ${orderId}`,
      html: emailHtml,
    })

        console.log('✅ Order status update sent successfully via Resend')
        return result
      } catch (resendError) {
        console.warn('⚠️  Resend failed, falling back to Nodemailer:', resendError instanceof Error ? resendError.message : String(resendError))
      }
    }

    // Fallback to Nodemailer with Gmail
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log('📧 Sending order status update via Gmail...')

        const mailOptions = {
          from: `"Marketdotcom" <${process.env.GMAIL_USER}>`,
          to: customerEmail,
          subject: `${statusInfo.title} - Order ${orderId}`,
          html: emailHtml,
        }

        const result = await nodemailerTransporter.sendMail(mailOptions)
        console.log('✅ Order status update sent successfully via Gmail')
        return result
      } catch (nodemailerError) {
        console.error('❌ Nodemailer failed:', nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError))
        throw nodemailerError
      }
    }

    // If neither service is configured, throw an error
    throw new Error('No email service configured. Please set RESEND_API_KEY or GMAIL_USER/GMAIL_APP_PASSWORD')
  } catch (error) {
    console.error('Error sending order status update email:', error)
    throw error
  }
}