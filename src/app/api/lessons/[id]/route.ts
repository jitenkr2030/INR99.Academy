import { NextRequest, NextResponse } from 'next/server'
import { getLessonById, getLessonsByCourseId, getCourses, getInstructors } from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const lessonId = (await params).id
  
  try {
    const lesson = getLessonById(lessonId)

    if (!lesson || !lesson.isActive) {
      return NextResponse.json(
        { success: false, message: 'Lesson not found' },
        { status: 404 }
      )
    }

    const courses = getCourses()
    const instructors = getInstructors()
    const course = courses.find(c => c.id === lesson.courseId)
    const instructor = instructors.find(i => i.id === course?.instructorId)

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      )
    }

    const allLessons = getLessonsByCourseId(lesson.courseId)

    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const assessments = [
      {
        id: `assess-${lessonId}-1`,
        title: 'Lesson Quiz',
        type: 'QUIZ'
      }
    ]

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        audioUrl: lesson.audioUrl,
        pdfUrl: lesson.pdfUrl,
        duration: lesson.duration,
        order: lesson.order,
        course: {
          id: course.id,
          title: course.title,
          instructor: instructor ? {
            id: instructor.id,
            name: instructor.name,
            avatar: instructor.avatar
          } : null
        },
        assessments: assessments,
        navigation: {
          previous: previousLesson,
          next: nextLesson,
          currentIndex: currentIndex + 1,
          totalLessons: allLessons.length
        }
      }
    })

  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
