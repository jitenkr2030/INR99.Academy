import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
]

// Routes that should be accessible only to unauthenticated users
const authRoutes = [
  '/auth/login',
  '/auth/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.endsWith('/*')) {
      const baseRoute = route.slice(0, -2)
      return pathname.startsWith(baseRoute)
    }
    return pathname === route
  })

  // Check if this is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Get session - simple approach
  let isAuthenticated = false
  try {
    const session = await auth(request)
    isAuthenticated = !!session?.user
  } catch (error) {
    // If there's an error checking session, don't block access
    // This prevents the redirect loop issue
    isAuthenticated = false
  }

  // If on login/register page and already logged in, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If on protected route and not logged in, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth/logout).*)',
  ],
}
