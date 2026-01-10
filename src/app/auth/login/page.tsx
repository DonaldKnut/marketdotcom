"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import toast from "react-hot-toast"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes("Prisma") || result.error.includes("database")) {
          toast.error("Database connection error. Please try again later.", {
            duration: 6000,
            style: {
              background: 'rgba(239, 68, 68, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          })
        } else if (result.error === "CredentialsSignin") {
          toast.error("Invalid email or password. Please check your credentials.", {
            duration: 4000,
            style: {
              background: 'rgba(239, 68, 68, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          })
        } else {
          toast.error(result.error || "Login failed. Please try again.", {
            duration: 4000,
            style: {
              background: 'rgba(239, 68, 68, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          })
        }
      } else {
        toast.success("Login successful! Redirecting...", {
          duration: 2000,
          style: {
            background: 'rgba(34, 197, 94, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }
        })

        // Small delay to show success toast
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message?.includes("Prisma") || error.message?.includes("database")) {
        toast.error("Database connection error. Please contact support.", {
          duration: 6000,
          style: {
            background: 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }
        })
      } else {
        toast.error("Network error. Please check your connection and try again.", {
          duration: 4000,
          style: {
            background: 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Marketdotcom account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg backdrop-blur-sm">
            <p className="text-green-800 text-sm">{message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base border-0"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-orange-600 hover:text-orange-500 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base pr-12 border-0"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-orange-600 hover:text-orange-500 font-semibold">
            Create one now
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Demo Credentials:</strong><br />
          Email: demo@marketdotcom.com<br />
          Password: demo123
        </p>
      </div>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
