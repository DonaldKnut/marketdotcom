import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { PaystackService } from "@/lib/paystack"
import crypto from "crypto"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

export async function POST(request: Request) {
  try {
    const prisma = await getPrismaClient()

    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature') || ''

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    console.log('Paystack webhook received:', event.event)

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data, prisma)
        break

      case 'charge.failed':
        await handleFailedPayment(event.data, prisma)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ status: 'success' })

  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(data: any, prisma: any) {
  const { reference, amount, customer, metadata } = data

  try {
    // Find the order by transaction reference
    const order = await prisma.order.findFirst({
      where: { transactionId: reference },
      include: { user: true }
    })

    if (!order) {
      console.error('Order not found for reference:', reference)
      return
    }

    // Update order payment status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "COMPLETED",
        status: "CONFIRMED" // Move to confirmed status
      }
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        amount: amount / 100, // Convert from kobo to naira
        currency: "NGN",
        method: "PAYSTACK",
        status: "COMPLETED",
        transactionId: reference,
        gatewayResponse: data
      }
    })

    // Award loyalty points for successful payment
    const pointsEarned = Math.floor(order.finalAmount / 100) // 1 point per ₦100
    if (pointsEarned > 0) {
      await prisma.user.update({
        where: { id: order.userId },
        data: {
          points: { increment: pointsEarned }
        }
      })

      await prisma.reward.create({
        data: {
          userId: order.userId,
          points: pointsEarned,
          description: `Points earned from payment for order #${order.id}`,
          type: "PURCHASE",
          orderId: order.id
        }
      })
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: "Payment Successful",
        message: `Your payment of ₦${(amount / 100).toLocaleString()} for order #${order.id} has been processed successfully.`,
        type: "PAYMENT",
        orderId: order.id
      }
    })

    // Update inventory (if applicable)
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: { product: true }
    })

    // Here you could update product inventory if you track stock levels

    console.log('Payment processed successfully for order:', order.id)

  } catch (error: any) {
    console.error('Error processing successful payment:', error)
    throw error
  }
}

async function handleFailedPayment(data: any, prisma: any) {
  const { reference } = data

  try {
    // Find the order
    const order = await prisma.order.findFirst({
      where: { transactionId: reference }
    })

    if (!order) {
      console.error('Order not found for failed payment reference:', reference)
      return
    }

    // Update order payment status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
        status: "CANCELLED"
      }
    })

    // Create payment record for failed payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        amount: data.amount / 100,
        currency: "NGN",
        method: "PAYSTACK",
        status: "FAILED",
        transactionId: reference,
        gatewayResponse: data
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: "Payment Failed",
        message: `Your payment for order #${order.id} could not be processed. Please try again or contact support.`,
        type: "PAYMENT",
        orderId: order.id
      }
    })

    console.log('Payment failure processed for order:', order.id)

  } catch (error: any) {
    console.error('Error processing failed payment:', error)
    throw error
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}