import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Your platform domain
const PLATFORM_DOMAIN = 'inr99.academy'
const MAIN_HOSTNAMES = ['inr99.academy', 'www.inr99.academy', 'localhost', '127.0.0.1']

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip internal paths and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Extract hostname (remove port if present)
  const currentHostname = hostname.split(':')[0].toLowerCase()

  // Check if this is the main platform (no custom domain)
  const isMainPlatform = MAIN_HOSTNAMES.some(
    domain => currentHostname === domain
  )

  // If it's the main platform, continue normally without any rewriting
  if (isMainPlatform) {
    return NextResponse.next()
  }

  // For all other hostnames (subdomains or custom domains), 
  // we need to identify the tenant but NOT rewrite to non-existent routes
  // Just add headers for downstream use and continue
  
  // Check if this is a subdomain of the platform
  const isSubdomain = currentHostname.endsWith(`.${PLATFORM_DOMAIN}`)

  if (isSubdomain) {
    // Extract subdomain (e.g., "school" from "school.inr99.academy")
    const subdomain = currentHostname.split('.')[0]

    // Skip if subdomain is "www" or "api"
    if (subdomain === 'www' || subdomain === 'api') {
      return NextResponse.next()
    }

    // Add tenant info as headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', subdomain)
    response.headers.set('x-tenant-hostname', currentHostname)
    response.headers.set('x-tenant-type', 'subdomain')

    return response
  }

  // This is a custom domain - add headers for tenant identification
  const response = NextResponse.next()
  response.headers.set('x-tenant-domain', currentHostname)
  response.headers.set('x-tenant-hostname', currentHostname)
  response.headers.set('x-tenant-type', 'custom')

  return response
}

// Run middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
