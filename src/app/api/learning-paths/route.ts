import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/learning-paths - Get all learning paths
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathId = searchParams.get('id')

    if (pathId) {
      // Get a specific learning path with its courses
      const learningPath = await db.learningPath.findUnique({
        where: { id: pathId },
        include: {
          courses: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              },
              _count: {
                select: {
                  lessons: true
                }
              }
            }
          },
          _count: {
            select: {
              courses: true
            }
          }
        }
      })

      if (!learningPath) {
        return NextResponse.json(
          { success: false, message: 'Learning path not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        learningPath: {
          ...learningPath,
          courseCount: learningPath.courses.length
        }
      })
    }

    // Get all learning paths with preview courses
    const learningPaths = await db.learningPath.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            courses: true
          }
        },
        courses: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          take: 3,
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      }
    })

    // Transform the response
    const learningPathsWithDetails = learningPaths.map(path => {
      const totalDuration = path.courses.reduce((sum, course) => sum + course.duration, 0)
      const totalLessons = path.courses.reduce((sum, course) => sum + course._count.lessons, 0)

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        sortOrder: path.sortOrder,
        isActive: path.isActive,
        courseCount: path._count.courses,
        totalDuration,
        totalLessons,
        previewCourses: path.courses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          duration: course.duration,
          thumbnail: course.thumbnail,
          lessonCount: course._count.lessons,
          instructor: course.instructor
        }))
      }
    })

    return NextResponse.json({
      success: true,
      learningPaths: learningPathsWithDetails
    })

  } catch (error) {
    console.error('Get learning paths error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
