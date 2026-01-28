import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

// PATCH - Update application status (Admin only)
export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { applicationId, status, notes } = body

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'applicationId and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: PENDING, REVIEWING, INTERVIEW, OFFER, REJECTED' },
        { status: 400 }
      )
    }

    // Update application
    const application = await db.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        notes: notes || null,
        reviewedBy: user.id,
        reviewedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Application status updated',
      data: {
        id: application.id,
        status: application.status,
        reviewedAt: application.reviewedAt
      }
    })

  } catch (error) {
    console.error('Error updating job application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an application (Admin only)
export async function DELETE(request: NextRequest) {
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
    const applicationId = searchParams.get('id')

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    await db.jobApplication.delete({
      where: { id: applicationId }
    })

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting job application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
