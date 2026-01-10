import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vertical = searchParams.get('vertical') || 'school'

    // Fetch courses with class info
    const courses = await db.course.findMany({
      where: {
        isActive: true,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      count: courses.length,
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        classId: c.classId,
        class: c.class,
        learningPathId: c.learningPathId,
        learningPath: c.learningPath,
      })),
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
