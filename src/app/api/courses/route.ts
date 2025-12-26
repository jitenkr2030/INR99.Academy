import { NextRequest, NextResponse } from 'next/server'
import { getCourses, getInstructors, getLearningPaths } from '@/lib/simple-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const learningPathId = searchParams.get('learningPathId')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Get data from simple fallback database
    const courses = getCourses()
    const instructors = getInstructors()
    const learningPaths = getLearningPaths()

    // Filter courses based on parameters
    let filteredCourses = courses.filter(course => course.isActive)

    if (learningPathId) {
      filteredCourses = filteredCourses.filter(course => course.learningPathId === learningPathId)
    }

    if (difficulty && ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
      filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty)
    }

    // Apply pagination
    const paginatedCourses = filteredCourses.slice(offset, offset + limit)

    // Map courses with instructor and learning path info
    const coursesWithDetails = paginatedCourses.map(course => {
      const instructor = instructors.find(i => i.id === course.instructorId)
      const learningPath = learningPaths.find(lp => lp.id === course.learningPathId)

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        instructor: instructor ? {
          id: instructor.id,
          name: instructor.name,
          avatar: instructor.avatar,
          expertise: instructor.expertise
        } : null,
        learningPath: learningPath ? {
          id: learningPath.id,
          title: learningPath.title,
          color: learningPath.color,
          icon: learningPath.icon
        } : null,
        lessonCount: 5, // Mock data
        assessmentCount: 2, // Mock data
        createdAt: course.createdAt
      }
    })

    const total = filteredCourses.length

    return NextResponse.json({
      success: true,
      courses: coursesWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}