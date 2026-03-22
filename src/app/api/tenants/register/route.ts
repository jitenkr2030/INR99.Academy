import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'
import { hash } from 'bcryptjs'

// Pricing tiers based on student count
const PRICING_TIERS = [
  { maxStudents: 500, pricePerStudent: 199, name: 'Starter' },
  { maxStudents: 750, pricePerStudent: 149, name: 'Growth' },
  { maxStudents: null, pricePerStudent: 99, name: 'Enterprise' }
]

// Helper function to get pricing tier
function getPricingTier(studentCount: number) {
  return PRICING_TIERS.find(tier => tier.maxStudents === null || studentCount <= tier.maxStudents) || PRICING_TIERS[PRICING_TIERS.length - 1]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      institutionName, 
      email, 
      phone, 
      customDomain, 
      adminName, 
      adminPassword,
      studentCount 
    } = body

    // Validate required fields
    if (!institutionName || !email || !customDomain || !adminName || !adminPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate student count
    if (!studentCount || isNaN(studentCount) || studentCount < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid number of students (minimum 10)' },
        { status: 400 }
      )
    }

    // Determine pricing tier based on student count
    const pricingTier = getPricingTier(studentCount)
    
    // Calculate monthly subscription cost
    const monthlySubscription = studentCount * pricingTier.pricePerStudent

    // Validate custom domain format
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/
    if (!domainRegex.test(customDomain.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid domain format. Please enter a valid domain (e.g., schoolname.com)' },
        { status: 400 }
      )
    }

    if (customDomain.length < 4 || customDomain.length > 253) {
      return NextResponse.json(
        { error: 'Domain must be between 4 and 253 characters' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Check if custom domain is already registered in database
    const existingDomain = await db.tenantDomain.findFirst({
      where: { domain: customDomain.toLowerCase() },
    })

    if (existingDomain) {
      return NextResponse.json(
        { error: 'This domain is already registered' },
        { status: 400 }
      )
    }

    // Generate a slug from the domain for internal use
    const slug = customDomain.toLowerCase().replace(/\./g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if email is already registered
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(adminPassword, 12)

    // Create the tenant and admin user in a transaction
    const tenant = await db.tenant.create({
      data: {
        name: institutionName,
        slug: slug,
        status: 'PENDING',
        subscriptionTier: pricingTier.name.toUpperCase(),
        maxUsers: studentCount,
        studentCount: studentCount,
        pricingTier: pricingTier.name,
        pricePerStudent: pricingTier.pricePerStudent,
        monthlySubscription: monthlySubscription,
        branding: {
          create: {
            primaryColor: '#3b82f6',
            secondaryColor: '#1e40af',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            fontFamily: 'Inter',
          },
        },
        domains: {
          create: {
            domain: customDomain.toLowerCase(),
            type: 'CUSTOM',
            status: 'PENDING', // DNS verification required
            dnsProvisioned: false,
          },
        },
        settings: {
          create: {
            allowRegistration: true,
            requireApproval: false,
            defaultUserRole: 'STUDENT',
            maxCoursesPerUser: 10,
            enableLiveSessions: true,
            enableCertificates: true,
            enableDiscussion: true,
            enableAnalytics: true,
          },
        },
      },
    })

    // Create admin user
    const user = await db.user.create({
      data: {
        email,
        name: adminName,
        password: hashedPassword,
        mobileNumber: phone,
        role: 'ADMIN',
        isActive: true,
        isVerified: false,
      },
    })

    // Link user to tenant as owner
    await db.tenantUser.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        email,
        name: adminName,
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: new Date(),
      },
    })

    // Return success with domain and pricing details
    return NextResponse.json({
      success: true,
      message: 'Institution registered successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        customDomain: customDomain.toLowerCase(),
        domainStatus: 'PENDING',
        studentCount: studentCount,
        pricingTier: pricingTier.name,
        pricePerStudent: pricingTier.pricePerStudent,
        monthlySubscription: monthlySubscription,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      dnsConfiguration: {
        type: 'CNAME',
        name: '@',
        value: 'cname.inr99.academy',
        ttl: 3600,
      },
    })
  } catch (error) {
    console.error('Tenant registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register institution' },
      { status: 500 }
    )
  }
}
