import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPrismaClient } from "@/lib/prisma"
import { PaystackService, generateReference } from "@/lib/paystack"

export async function POST(request: Request) {
  try {
    const prisma = await getPrismaClient()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { orderId, amount, paymentMethod } = await request.json()

    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Order ID and valid amount are required" },
        { status: 400 }
      )
    }

    // Verify the order exists and belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        paymentStatus: "PENDING"
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or already paid" },
        { status: 404 }
      )
    }

    // Generate unique reference
    const reference = generateReference()

    // Update order with transaction reference
    await prisma.order.update({
      where: { id: orderId },
      data: {
        transactionId: reference,
        paymentMethod: paymentMethod || "paystack"
      }
    })

    // Initialize Paystack transaction
    const paystackResponse = await PaystackService.initializeTransaction({
      amount: amount,
      email: session.user.email || "",
      reference: reference,
      callback_url: `${process.env.NEXTAUTH_URL}/checkout?reference=${reference}`,
      metadata: {
        orderId: orderId,
        userId: session.user.id,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId
          }
        ]
      }
    })

    if (!paystackResponse.status) {
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reference: reference,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code
    })

  } catch (error: any) {
    console.error("Error initializing payment:", error)
    return NextResponse.json(
      { error: "Failed to initialize payment", details: error.message },
      { status: 500 }
    )
  }
}