import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!prisma || typeof prisma.user?.findFirst !== 'function') {
      return NextResponse.json(
        { message: "Password reset temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token. Please request a new password reset link." },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Reset password error:", error)

    if (error.message?.includes("Prisma") || error.message?.includes("connect")) {
      return NextResponse.json(
        { message: "Database connection error. Please try again later." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { message: "Password reset failed. Please try again." },
      { status: 500 }
    )
  }
}