import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalDiscussions,
      totalSubscriptions,
      activeSubscriptions,
      totalCertificates,
      totalPayments
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.course.count({ where: { isActive: true } }),
      db.discussion.count({ where: { isActive: true } }),
      db.subscription.count(),
      db.subscription.count({ where: { status: 'ACTIVE' } }),
      db.certificate.count(),
      db.paymentRecord.count({ where: { status: 'COMPLETED' } })
    ])

    // Get revenue data
    const payments = await db.paymentRecord.findMany({
      where: { status: 'COMPLETED' },
      select: {
        amount: true,
        createdAt: true
      }
    })

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
    
    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlyPayments = payments.filter(payment => 
      new Date(payment.createdAt) >= thirtyDaysAgo
    )
    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0)

    // Get user growth data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const userGrowth = await db.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Get course popularity
    const coursePopularity = await db.courseProgress.groupBy({
      by: ['courseId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    // Get course details for popularity
    const courseIds = coursePopularity.map(cp => cp.courseId)
    const courses = await db.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    })

    const courseStats = coursePopularity.map(cp => {
      const course = courses.find(c => c.id === cp.courseId)
      return {
        courseId: cp.courseId,
        title: course?.title || 'Unknown Course',
        enrollments: cp._count.id
      }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments,
        totalRevenue,
        monthlyRevenue
      },
      userGrowth,
      courseStats
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}