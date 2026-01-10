import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',
        GMAIL_USER: process.env.GMAIL_USER ? 'SET' : 'MISSING',
        GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'MISSING',
      },
      netlify: {
        CONTEXT: process.env.CONTEXT,
        DEPLOY_ID: process.env.DEPLOY_ID,
        SITE_NAME: process.env.SITE_NAME,
      }
    }

    // Test database connection if DATABASE_URL is set
    let dbStatus = 'NOT_TESTED'
    if (process.env.DATABASE_URL) {
      try {
        // Import prisma dynamically to avoid build issues
        const { prisma } = await import('@/lib/prisma')
        await prisma.$connect()
        dbStatus = 'CONNECTED'
      } catch (dbError: any) {
        dbStatus = `ERROR: ${dbError.message}`
      }
    }

    return NextResponse.json({
      ...envCheck,
      database: dbStatus,
      status: 'OK'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      status: 'ERROR'
    }, { status: 500 })
  }
}