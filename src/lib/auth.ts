import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getPrismaClient } from "./prisma"

export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter to avoid serverless issues - handle manually
  debug: true, // Enable debug in all environments to troubleshoot
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with email:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          throw new Error("Email and password are required")
        }

        // Get prisma client lazily
        const prisma = await getPrismaClient()
        console.log("Prisma client:", !!prisma, typeof prisma?.user?.findUnique)

        // Check if prisma is available (for development fallback)
        if (!prisma || typeof prisma.user?.findUnique !== 'function') {
          console.log("Database unavailable, checking demo credentials")
          // Development fallback for demo credentials
          if (credentials.email === "demo@marketdotcom.com" && credentials.password === "demo123") {
            console.log("Using demo credentials")
            return {
              id: "demo-user",
              email: "demo@marketdotcom.com",
              name: "Demo User",
              role: "CUSTOMER",
            }
          }
          console.log("Demo credentials not matched, throwing error")
          throw new Error("Database unavailable. Using demo credentials: demo@marketdotcom.com / demo123")
        }

        try {
          console.log("Looking up user:", credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log("User found:", !!user)

          if (!user) {
            console.log("No user found, throwing error")
            throw new Error("No account found with this email address. Please register first.")
          }

          if (!user.password) {
            console.log("User has no password, throwing error")
            throw new Error("Account setup incomplete. Please contact support.")
          }

          if (!user.emailVerified) {
            console.log("User email not verified, throwing error")
            throw new Error("Please verify your email address before signing in. Check your email for the verification link.")
          }

          console.log("Checking password...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Password invalid, throwing error")
            throw new Error("Invalid password. Please check and try again.")
          }

          console.log("Authentication successful, returning user")
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
            console.log("Database connection error detected")
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
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login" // Redirect auth errors back to login page
  }
}
