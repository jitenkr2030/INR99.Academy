import { NextRequest, NextResponse } from 'next/server'
import { getLearningPaths, getCourses } from '@/lib/simple-db'

export async function GET(request: NextRequest) {
  try {
    // Get data from simple fallback database
    const learningPaths = getLearningPaths().filter(path => path.isActive)
    const courses = getCourses()

    // Map learning paths with course counts and preview courses
    const learningPathsWithDetails = learningPaths.map(path => {
      const pathCourses = courses.filter(course => 
        course.learningPathId === path.id && course.isActive
      )

      const previewCourses = pathCourses.slice(0, 3).map(course => ({
        id: course.id,
        title: course.title,
        difficulty: course.difficulty,
        duration: course.duration,
        thumbnail: course.thumbnail
      }))

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        courseCount: pathCourses.length,
        previewCourses
      }
    })

    return NextResponse.json({
      success: true,
      learningPaths: learningPathsWithDetails
    })

  } catch (error) {
    console.error('Get learning paths error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}