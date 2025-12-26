import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Demo users for progress data
const demoProgress: Record<string, Array<{
  id: string
  userId: string
  courseId: string
  lessonId?: string
  progress: number
  timeSpent: number
  completed: boolean
  lastAccess: string
  course: {
    id: string
    title: string
    thumbnail?: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration: number
    instructor: {
      id: string
      name: string
      avatar?: string
    }
  }
  lesson?: {
    id: string
    title: string
    duration: number
    order: number
  }
}>> = {
  'student1@inr99.com': [
    {
      id: 'prog_1',
      userId: 'student1',
      courseId: 'course_react',
      progress: 65,
      timeSpent: 320,
      completed: false,
      lastAccess: new Date().toISOString(),
      course: {
        id: 'course_react',
        title: 'Complete React Course - From Zero to Hero',
        thumbnail: undefined,
        difficulty: 'INTERMEDIATE' as const,
        duration: 1200,
        instructor: { id: 'inst_1', name: 'John Instructor', avatar: undefined }
      }
    },
    {
      id: 'prog_2',
      userId: 'student1',
      courseId: 'course_js',
      progress: 30,
      timeSpent: 180,
      completed: false,
      lastAccess: new Date(Date.now() - 86400000).toISOString(),
      course: {
        id: 'course_js',
        title: 'Advanced JavaScript Mastery',
        thumbnail: undefined,
        difficulty: 'ADVANCED' as const,
        duration: 900,
        instructor: { id: 'inst_2', name: 'Jane Instructor', avatar: undefined }
      }
    },
    {
      id: 'prog_3',
      userId: 'student1',
      courseId: 'course_web',
      progress: 100,
      timeSpent: 600,
      completed: true,
      lastAccess: new Date(Date.now() - 604800000).toISOString(),
      course: {
        id: 'course_web',
        title: 'Web Development Basics',
        thumbnail: undefined,
        difficulty: 'BEGINNER' as const,
        duration: 600,
        instructor: { id: 'inst_3', name: 'Bob Instructor', avatar: undefined }
      }
    }
  ]
}

const updateProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string().optional(),
  progress: z.number().min(0).max(100),
  timeSpent: z.number().min(0).optional(),
  completed: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    // For demo mode, return mock data based on email
    if (email && demoProgress[email]) {
      const progressList = demoProgress[email]
      
      if (courseId) {
        const progress = progressList.find(p => p.courseId === courseId)
        return NextResponse.json({
          success: true,
          progress: progress || null
        })
      }

      return NextResponse.json({
        success: true,
        progress: progressList
      })
    }

    // If no demo data, return empty array
    return NextResponse.json({
      success: true,
      progress: []
    })

  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // For demo mode, just return success without saving
    console.log('Demo mode: Progress update received', body)
    
    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully (demo mode)',
      progress: body
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Update progress error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}