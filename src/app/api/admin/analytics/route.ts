import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user || user.id !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get time period from query params (default: last 30 days)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Basic counts
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      activeCourses,
      totalDiscussions,
      totalSubscriptions,
      activeSubscriptions,
      totalCertificates,
      totalPayments
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.course.count(),
      db.course.count({ where: { isActive: true } }),
      db.discussion.count(),
      db.subscription.count(),
      db.subscription.count({ where: { status: 'ACTIVE' } }),
      db.certificate.count(),
      db.paymentRecord.count({ where: { status: 'COMPLETED' } })
    ])

    // Revenue data
    const payments = await db.paymentRecord.findMany({
      where: { 
        status: 'COMPLETED',
        createdAt: { gte: startDate }
      },
      select: {
        amount: true,
        createdAt: true,
        type: true
      },
      orderBy: { createdAt: 'asc' }
    })

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    
    // Group revenue by date for chart
    const revenueByDate = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, subscriptions: 0, certificates: 0 }
      }
      acc[date].revenue += payment.amount
      if (payment.type === 'SUBSCRIPTION') {
        acc[date].subscriptions += 1
      } else {
        acc[date].certificates += 1
      }
      return acc
    }, {} as Record<string, { date: string; revenue: number; subscriptions: number; certificates: number }>)

    // User growth by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userGrowth = await db.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: sixMonthsAgo } },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    })

    // Group user growth by month
    const usersByMonth = userGrowth.reduce((acc, record) => {
      const month = new Date(record.createdAt).toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += record._count.id
      return acc
    }, {} as Record<string, number>)

    // Course distribution by difficulty
    const coursesByDifficulty = await db.course.groupBy({
      by: ['difficulty'],
      _count: { id: true }
    })

    // Course distribution by category
    const coursesByCategory = await db.category.findMany({
      include: {
        courses: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Top courses by enrollment
    const topCourses = await db.courseProgress.groupBy({
      by: ['courseId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    const courseIds = topCourses.map(c => c.courseId)
    const courseDetails = await db.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, title: true }
    })

    const topCoursesData = topCourses.map(tc => ({
      courseId: tc.courseId,
      title: courseDetails.find(c => c.id === tc.courseId)?.title || 'Unknown',
      enrollments: tc._count.id
    }))

    // Top instructors by courses
    const instructorStats = await db.instructor.findMany({
      include: {
        courses: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    const instructorData = instructorStats.map(inst => ({
      id: inst.id,
      name: inst.name,
      courseCount: inst.courses.length
    }))

    // Subscription stats
    const subscriptionStats = await db.subscription.groupBy({
      by: ['status'],
      _count: { id: true }
    })

    // Recent activity (last 10 discussions)
    const recentDiscussions = await db.discussion.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
        _count: { select: { replies: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Daily active users (approximation based on last login)
    const dailyActiveUsers = await db.user.findMany({
      where: { lastLogin: { gte: startDate } },
      select: { lastLogin: true, name: true, email: true },
      orderBy: { lastLogin: 'desc' },
      take: 50
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalCourses,
        activeCourses,
        totalDiscussions,
        totalSubscriptions,
        activeSubscriptions,
        totalCertificates,
        totalPayments,
        totalRevenue
      },
      revenueChart: Object.values(revenueByDate),
      usersChart: Object.entries(usersByMonth).map(([month, count]) => ({ month, count })),
      coursesByDifficulty: coursesByDifficulty.map(c => ({ difficulty: c.difficulty, count: c._count.id })),
      coursesByCategory: coursesByCategory.map(c => ({ 
        name: c.name, 
        count: c.courses.length 
      })),
      topCourses: topCoursesData,
      instructors: instructorData,
      subscriptionStats: subscriptionStats.map(s => ({ status: s.status, count: s._count.id })),
      recentDiscussions,
      dailyActiveUsers: dailyActiveUsers.slice(0, 20)
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
