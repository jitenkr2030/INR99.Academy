import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Let NextAuth handle authentication via auth.ts authorized callback
  return NextResponse.next()
}

// Only run on specific routes to avoid unnecessary processing
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}
