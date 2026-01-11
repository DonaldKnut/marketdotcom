import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getPrismaClient } from "./prisma"

export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter to avoid serverless issues - handle manually
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Get prisma client lazily
        const prisma = await getPrismaClient()

        // Check if prisma is available (for development fallback)
        if (!prisma || typeof prisma.user?.findUnique !== 'function') {
          // Development fallback for demo credentials
          if (credentials.email === "demo@marketdotcom.com" && credentials.password === "demo123") {
            return {
              id: "demo-user",
              email: "demo@marketdotcom.com",
              name: "Demo User",
              role: "CUSTOMER",
            }
          }
          throw new Error("Database unavailable. Using demo credentials: demo@marketdotcom.com / demo123")
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            throw new Error("No account found with this email address. Please register first.")
          }

          if (!user.password) {
            throw new Error("Account setup incomplete. Please contact support.")
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email address before signing in. Check your email for the verification link.")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid password. Please check and try again.")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error: any) {
          console.error("Auth error:", error)

          // If it's a Prisma error, the database might be unavailable
          if (error.message?.includes("Prisma") || error.message?.includes("connect") || error.message?.includes("ECONNREFUSED")) {
            // Provide demo credentials in development
            if (process.env.NODE_ENV === "development") {
              throw new Error("Database unavailable. Use demo credentials: demo@marketdotcom.com / demo123")
            } else {
              throw new Error("Service temporarily unavailable. Please try again later.")
            }
          }

          // Re-throw the original error message
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For credentials provider, user creation is handled in authorize function
      // For other providers, you might need to handle user creation here
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login"
  }
}
