import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificates = await db.certificate.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true,
            description: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if user has completed the course
    const courseProgress = await db.courseProgress.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
        completed: true
      }
    })

    if (!courseProgress) {
      return NextResponse.json({ error: 'Course not completed' }, { status: 400 })
    }

    // Check if certificate already exists
    const existingCertificate = await db.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: courseId
      }
    })

    if (existingCertificate) {
      return NextResponse.json({ error: 'Certificate already issued' }, { status: 400 })
    }

    // Generate certificate number
    const certificateNumber = `INR99-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-certificate/${certificateNumber}`

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        userId: user.id,
        courseId: courseId,
        certificateNumber: certificateNumber,
        verificationUrl: verificationUrl,
        verified: false
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true,
            description: true,
            difficulty: true
          }
        }
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}