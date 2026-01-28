import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// Application status enum for type safety
type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'REJECTED'

// POST - Submit new job application (Public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      position,
      department,
      fullName,
      email,
      phone,
      linkedin,
      experience,
      coverLetter,
      resumeUrl,
      portfolioUrl
    } = body

    // Validation
    if (!position || !fullName || !email || !resumeUrl) {
      return NextResponse.json(
        { error: 'Required fields are missing: position, fullName, email, and resumeUrl are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create job application record
    const application = await db.jobApplication.create({
      data: {
        position,
        department: department || null,
        fullName,
        email,
        phone: phone || null,
        linkedin: linkedin || null,
        experience: experience || null,
        coverLetter: coverLetter || null,
        resumeUrl,
        portfolioUrl: portfolioUrl || null,
        status: 'PENDING'
      }
    })

    // Log the application (optional - could be sent to Slack, email, etc.)
    console.log(`New job application received: ${application.id} - ${fullName} for ${position}`)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        data: {
          id: application.id,
          position: application.position,
          fullName: application.fullName,
          status: application.status,
          createdAt: application.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error submitting job application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}

// GET - Fetch applications (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const position = searchParams.get('position')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }
    
    if (position) {
      where.position = { contains: position, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch applications with pagination
    const [applications, total] = await Promise.all([
      db.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          position: true,
          department: true,
          fullName: true,
          email: true,
          phone: true,
          linkedin: true,
          experience: true,
          coverLetter: true,
          resumeUrl: true,
          portfolioUrl: true,
          status: true,
          notes: true,
          reviewedBy: true,
          reviewedAt: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      db.jobApplication.count({ where })
    ])

    // Get status counts for dashboard stats
    const statusCounts = await db.jobApplication.groupBy({
      by: ['status'],
      _count: true
    })

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Error fetching job applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
