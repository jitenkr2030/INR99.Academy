import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    // Fetch course from database with all related data
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatar: true,
            expertise: true,
          },
        },
        learningPath: {
          select: {
            id: true,
            title: true,
            description: true,
            color: true,
            icon: true,
          },
        },
        lessons: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            videoUrl: true,
            content: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            assessments: true,
            progress: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      )
    }

    // Group lessons into modules based on lesson ID prefix
    // Lesson IDs follow pattern: cr_ecm_XXX where first digit(s) = module number
    // e.g., cr_ecm_101 -> module 1; cr_ecm_201 -> module 2; cr_ecm_1001 -> module 10
    
    const moduleNames: Record<string, string> = {
      '1': 'Foundation Building',
      '2': 'Grammar Mastery',
      '3': 'Speaking Confidence',
      '4': 'Vocabulary Building',
      '5': 'Professional Writing',
      '6': 'Interview Skills',
      '7': 'Presentation Skills',
      '8': 'Conversation Skills',
      '9': 'Business Communication',
      '10': 'Advanced Communication',
    }

    const moduleLessons: Record<string, typeof course.lessons> = {}
    
    for (const lesson of course.lessons) {
      // Extract module number from lesson ID
      // cr_ecm_101 -> module 1 (lesson 1); cr_ecm_201 -> module 2 (lesson 1); cr_ecm_1001 -> module 10 (lesson 1)
      let moduleNum = '1' // Default to module 1 for ECM lessons
      if (lesson.id.startsWith('cr_ecm_')) {
        const numericPart = lesson.id.replace('cr_ecm_', '')
        // Extract the first digit(s) before the last digit(s) to determine module
        // For 101-170: first digit is module (1); for 1001-1070: first two digits are module (10)
        if (numericPart.length >= 4 && numericPart.startsWith('10')) {
          // Module 10: cr_ecm_1001, cr_ecm_1002, etc.
          moduleNum = '10'
        } else if (numericPart.length >= 3 && numericPart.length < 4) {
          // Modules 1-9: cr_ecm_101, cr_ecm_102, etc. (3-digit numeric part)
          const firstDigit = numericPart.charAt(0)
          if (firstDigit !== '0') {
            moduleNum = firstDigit
          }
          // If firstDigit is '0', keep moduleNum as '1' (lessons 065-070 are extra Module 1 lessons)
        } else {
          // Fallback: extract all leading digits
          const match = numericPart.match(/^(\d+)/)
          if (match) {
            const num = parseInt(match[1])
            if (num >= 1000) {
              moduleNum = '10'
            } else if (num >= 100) {
              moduleNum = Math.floor(num / 100).toString()
            }
            // If num < 100 (like 065 = 65), keep as module 1
          }
        }
      }
      
      if (!moduleLessons[moduleNum]) {
        moduleLessons[moduleNum] = []
      }
      moduleLessons[moduleNum].push(lesson)
    }
    
    // Build modules array
    const modules = Object.entries(moduleLessons).map(([moduleNum, lessons]) => ({
      id: `module-${moduleNum}`,
      title: `Module ${moduleNum}: ${moduleNames[moduleNum] || 'Module ' + moduleNum}`,
      order: parseInt(moduleNum),
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        type: 'video' as const,
        isFree: false,
        videoUrl: lesson.videoUrl,
        content: lesson.content,
      })).sort((a, b) => a.order - b.order),
    })).sort((a, b) => a.order - b.order)

    // Generate assessments based on lessons
    const assessments = course.lessons.length > 0 ? [
      {
        id: `assess-${courseId}-1`,
        title: 'Chapter Quiz',
        type: 'QUIZ',
        lessonId: course.lessons[0]?.id
      },
      {
        id: `assess-${courseId}-2`,
        title: 'Final Assessment',
        type: 'PRACTICE'
      }
    ] : []

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        longDescription: course.description, // Using description as longDescription for now
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        duration: course.duration,
        price: 0, // Default to free for now
        originalPrice: 0,
        rating: 4.5, // Default rating
        reviewCount: 100, // Default review count
        tagline: `Master ${course.title} with our comprehensive course`,
        language: 'Hinglish',
        instructor: course.instructor,
        learningPath: course.learningPath,
        modules: modules,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          type: 'video' as const,
          isFree: false,
          videoUrl: lesson.videoUrl,
          content: lesson.content,
        })),
        lessonCount: course._count.lessons,
        moduleCount: modules.length,
        assessments: assessments,
        totalLessons: course._count.lessons,
        totalAssessments: assessments.length,
        enrollmentCount: course._count.progress || 0,
        outcomes: [
          `Understand ${course.title} fundamentals`,
          `Build real-world projects`,
          `Apply concepts in practical scenarios`,
          `Gain confidence in ${course.title}`,
        ],
        requirements: [
          'Basic understanding of the subject',
          'A computer with internet access',
          'Willingness to learn',
        ],
        createdAt: course.createdAt,
        updatedAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}