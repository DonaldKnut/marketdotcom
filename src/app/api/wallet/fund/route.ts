import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { amount, method } = await request.json()

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Minimum funding amount is ₦100" },
        { status: 400 }
      )
    }

    // In a real implementation, you would integrate with a payment gateway here
    // For now, we'll simulate successful payment and credit the wallet

    // Update wallet balance
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        walletBalance: {
          increment: amount
        }
      }
    })

    // Create wallet transaction record
    await prisma.walletTransaction.create({
      data: {
        userId: session.user.id,
        type: "CREDIT",
        amount,
        method,
        description: `Wallet funded via ${method}`,
        status: "COMPLETED",
        reference: `WF${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Wallet Funded Successfully",
        message: `Your wallet has been credited with ₦${amount.toLocaleString()}`,
        type: "WALLET"
      }
    })

    return NextResponse.json({
      message: "Wallet funded successfully",
      newBalance: updatedUser.walletBalance
    })

  } catch (error) {
    console.error("Error funding wallet:", error)
    return NextResponse.json(
      { error: "Failed to fund wallet" },
      { status: 500 }
    )
  }
}