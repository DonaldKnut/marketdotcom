import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmailVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!prisma || typeof prisma.user?.findUnique !== 'function') {
      return NextResponse.json(
        { message: "Email verification temporarily unavailable. Please try again later." },
        { status: 503 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: "If an account with this email exists, we've sent a new verification link." },
        { status: 200 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Your email is already verified. You can sign in to your account." },
        { status: 200 }
      )
    }

    // Generate new 6-digit verification code
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with new code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: emailVerificationCode,
        resetTokenExpiry: codeExpiry, // Reuse this field for code expiry
      }
    })

    // Send verification email
    try {
      await sendEmailVerificationEmail(user.email, emailVerificationCode)

      return NextResponse.json(
        { message: "Verification email sent successfully. Please check your inbox." },
        { status: 200 }
      )
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)

      // Don't reveal email sending failure for security
      return NextResponse.json(
        { message: "If an account with this email exists, we've sent a new verification link." },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error("Resend verification error:", error)

    if (error.message?.includes("Prisma") || error.message?.includes("connect")) {
      return NextResponse.json(
        { message: "Database connection error. Please try again later." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { message: "Failed to resend verification email. Please try again." },
      { status: 500 }
    )
  }
}