import { NextRequest, NextResponse } from 'next/server'
import { getCourses, getInstructors, getLearningPaths, getLessonsByCourseId } from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    // Get data from simple fallback database
    const courses = getCourses()
    const instructors = getInstructors()
    const learningPaths = getLearningPaths()
    const lessons = getLessonsByCourseId(courseId)

    // Find the course
    const course = courses.find(c => c.id === courseId && c.isActive)

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      )
    }

    // Get instructor and learning path info
    const instructor = instructors.find(i => i.id === course.instructorId)
    const learningPath = learningPaths.find(lp => lp.id === course.learningPathId)

    // Mock assessments for demo (can be enhanced later)
    const assessments = [
      {
        id: `assess-${courseId}-1`,
        title: 'Chapter Quiz',
        type: 'QUIZ',
        lessonId: lessons[0]?.id
      },
      {
        id: `assess-${courseId}-2`,
        title: 'Final Assessment',
        type: 'PRACTICE'
      }
    ]

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        instructor: instructor ? {
          id: instructor.id,
          name: instructor.name,
          bio: instructor.expertise,
          avatar: instructor.avatar,
          expertise: instructor.expertise
        } : null,
        learningPath: learningPath ? {
          id: learningPath.id,
          title: learningPath.title,
          description: learningPath.description,
          color: learningPath.color,
          icon: learningPath.icon
        } : null,
        lessons: lessons,
        assessments: assessments,
        totalLessons: lessons.length,
        totalAssessments: assessments.length,
        createdAt: course.createdAt
      }
    })

  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}