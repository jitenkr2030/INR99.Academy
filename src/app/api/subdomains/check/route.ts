import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const domain = searchParams.get('name')

  if (!domain) {
    return NextResponse.json(
      { error: 'Domain name is required' },
      { status: 400 }
    )
  }

  // Validate domain format
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/
  if (!domainRegex.test(domain.toLowerCase())) {
    return NextResponse.json(
      {
        available: false,
        error: 'Please enter a valid domain name (e.g., schoolname.com)',
      },
      { status: 400 }
    )
  }

  // Check minimum and maximum length
  if (domain.length < 4 || domain.length > 253) {
    return NextResponse.json(
      {
        available: false,
        error: 'Domain must be between 4 and 253 characters.',
      },
      { status: 400 }
    )
  }

  const db = createClient()

  // Check if domain exists in tenant domains
  const existingDomain = await db.tenantDomain.findFirst({
    where: { domain: domain.toLowerCase() },
    select: { id: true },
  })

  if (existingDomain) {
    return NextResponse.json({
      available: false,
      error: 'This domain is already registered.',
    })
  }

  // Generate slug from domain
  const slug = domain.toLowerCase().replace(/\./g, '-').replace(/[^a-z0-9-]/g, '')

  return NextResponse.json({
    available: true,
    domain: domain.toLowerCase(),
    slug: slug,
  })
}
