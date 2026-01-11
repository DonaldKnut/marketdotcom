import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering since this route handles request parameters
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Redirect auth errors to login page
  const url = new URL('/auth/login', request.url)
  const error = request.nextUrl.searchParams.get('error')

  // Pass the error as a query parameter to the login page
  if (error) {
    url.searchParams.set('error', error)
  }

  return NextResponse.redirect(url)
}