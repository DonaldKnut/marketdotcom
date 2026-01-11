import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering since this route handles request parameters
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Get error details from URL parameters
  const error = request.nextUrl.searchParams.get('error')
  const error_description = request.nextUrl.searchParams.get('error_description')

  // Redirect auth errors to login page with error details
  const url = new URL('/auth/login', request.url)

  // Pass the error as a query parameter to the login page
  if (error) {
    url.searchParams.set('auth_error', error)
  }
  if (error_description) {
    url.searchParams.set('auth_error_description', error_description)
  }

  console.log("Auth error redirect:", { error, error_description })

  return NextResponse.redirect(url)
}