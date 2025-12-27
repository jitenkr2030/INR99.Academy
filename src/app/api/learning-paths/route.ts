import { NextRequest, NextResponse } from 'next/server'

// Sample learning paths data for demo/fallback
const sampleLearningPaths = [
  {
    id: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    description: 'Master modern web development from frontend to backend with React, Node.js, and databases.',
    icon: '💻',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    courseCount: 5,
    totalDuration: 2400,
    totalLessons: 180,
    previewCourses: [
      {
        id: 'html-css-fundamentals',
        title: 'HTML & CSS Fundamentals',
        description: 'Build the foundation of modern web pages',
        difficulty: 'Beginner',
        duration: 240,
        lessonCount: 20,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'javascript-essentials',
        title: 'JavaScript Essentials',
        description: 'Learn JavaScript from scratch',
        difficulty: 'Beginner',
        duration: 360,
        lessonCount: 30,
        instructor: { id: 'inst-2', name: 'Mike Chen', avatar: null }
      },
      {
        id: 'react-mastery',
        title: 'React.js Mastery',
        description: 'Build dynamic single-page applications',
        difficulty: 'Intermediate',
        duration: 480,
        lessonCount: 40,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      }
    ]
  },
  {
    id: 'data-science-machine-learning',
    title: 'Data Science & Machine Learning',
    description: 'Dive into data analysis, visualization, and predictive modeling with Python.',
    icon: '📊',
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    courseCount: 6,
    totalDuration: 3000,
    totalLessons: 220,
    previewCourses: [
      {
        id: 'python-programming',
        title: 'Python Programming',
        description: 'Learn Python from the ground up',
        difficulty: 'Beginner',
        duration: 300,
        lessonCount: 25,
        instructor: { id: 'inst-4', name: 'Emma Watson', avatar: null }
      },
      {
        id: 'data-analysis-pandas',
        title: 'Data Analysis with Pandas',
        description: 'Master data manipulation and analysis',
        difficulty: 'Intermediate',
        duration: 400,
        lessonCount: 32,
        instructor: { id: 'inst-4', name: 'Emma Watson', avatar: null }
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description: 'Create compelling data visualizations',
        difficulty: 'Intermediate',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-5', name: 'David Park', avatar: null }
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Learn to create effective marketing campaigns across multiple digital channels.',
    icon: '📈',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    courseCount: 4,
    totalDuration: 1200,
    totalLessons: 90,
    previewCourses: [
      {
        id: 'seo-fundamentals',
        title: 'SEO Fundamentals',
        description: 'Master search engine optimization',
        difficulty: 'Beginner',
        duration: 280,
        lessonCount: 22,
        instructor: { id: 'inst-7', name: 'Rachel Green', avatar: null }
      },
      {
        id: 'social-media-marketing',
        title: 'Social Media Marketing',
        description: 'Build engaged communities on social platforms',
        difficulty: 'Beginner',
        duration: 320,
        lessonCount: 25,
        instructor: { id: 'inst-8', name: 'Tom Harris', avatar: null }
      },
      {
        id: 'content-marketing',
        title: 'Content Marketing Strategy',
        description: 'Create compelling content that converts',
        difficulty: 'Intermediate',
        duration: 300,
        lessonCount: 24,
        instructor: { id: 'inst-7', name: 'Rachel Green', avatar: null }
      }
    ]
  },
  {
    id: 'cloud-computing-devops',
    title: 'Cloud Computing & DevOps',
    description: 'Master cloud platforms, containerization, and CI/CD pipelines.',
    icon: '☁️',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    courseCount: 5,
    totalDuration: 2200,
    totalLessons: 165,
    previewCourses: [
      {
        id: 'cloud-foundations',
        title: 'Cloud Computing Foundations',
        description: 'Understand cloud concepts and services',
        difficulty: 'Beginner',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-3', name: 'Alex Kumar', avatar: null }
      },
      {
        id: 'aws-essentials',
        title: 'AWS Essential Services',
        description: 'Master core AWS services',
        difficulty: 'Intermediate',
        duration: 450,
        lessonCount: 35,
        instructor: { id: 'inst-3', name: 'Alex Kumar', avatar: null }
      },
      {
        id: 'docker-kubernetes',
        title: 'Docker & Kubernetes',
        description: 'Container orchestration mastery',
        difficulty: 'Intermediate',
        duration: 500,
        lessonCount: 40,
        instructor: { id: 'inst-9', name: 'James Wilson', avatar: null }
      }
    ]
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native and Flutter.',
    icon: '📱',
    color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    courseCount: 4,
    totalDuration: 1800,
    totalLessons: 140,
    previewCourses: [
      {
        id: 'react-native-basics',
        title: 'React Native Basics',
        description: 'Build your first mobile app',
        difficulty: 'Intermediate',
        duration: 400,
        lessonCount: 32,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'react-native-advanced',
        title: 'Advanced React Native',
        description: 'Complex app development',
        difficulty: 'Advanced',
        duration: 450,
        lessonCount: 36,
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: null }
      },
      {
        id: 'flutter-intro',
        title: 'Flutter Introduction',
        description: 'Dart and Flutter fundamentals',
        difficulty: 'Intermediate',
        duration: 450,
        lessonCount: 36,
        instructor: { id: 'inst-2', name: 'Mike Chen', avatar: null }
      }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Learn to design beautiful, user-centered interfaces and experiences.',
    icon: '🎨',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
    courseCount: 4,
    totalDuration: 1400,
    totalLessons: 110,
    previewCourses: [
      {
        id: 'design-principles',
        title: 'Design Principles',
        description: 'Core concepts of visual design',
        difficulty: 'Beginner',
        duration: 300,
        lessonCount: 24,
        instructor: { id: 'inst-10', name: 'Sophie Brown', avatar: null }
      },
      {
        id: 'figma-mastery',
        title: 'Figma Mastery',
        description: 'Professional UI design in Figma',
        difficulty: 'Beginner',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-10', name: 'Sophie Brown', avatar: null }
      },
      {
        id: 'ux-research',
        title: 'UX Research Methods',
        description: 'Understand your users deeply',
        difficulty: 'Intermediate',
        duration: 350,
        lessonCount: 28,
        instructor: { id: 'inst-11', name: 'Chris Taylor', avatar: null }
      }
    ]
  }
]

// GET /api/learning-paths - Get all learning paths
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathId = searchParams.get('id')
    const useDemo = searchParams.get('demo') === 'true'

    // Try to import database, fallback to sample data if not available
    let learningPathsData: any[] = []

    try {
      const { db } = await import('@/lib/db')
      
      if (pathId && !useDemo) {
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
          // Fallback to sample data
          const samplePath = sampleLearningPaths.find(p => p.id === pathId)
          if (samplePath) {
            return NextResponse.json({
              success: true,
              learningPaths: [samplePath]
            })
          }
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
      learningPathsData = learningPaths.map(path => {
        const totalDuration = path.courses.reduce((sum: number, course: any) => sum + course.duration, 0)
        const totalLessons = path.courses.reduce((sum: number, course: any) => sum + course._count.lessons, 0)

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
          previewCourses: path.courses.map((course: any) => ({
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

      // If no data found in database, use sample data
      if (learningPathsData.length === 0 || useDemo) {
        learningPathsData = sampleLearningPaths
      }
    } catch (dbError) {
      // If database import or query fails, use sample data
      console.log('Database not available, using sample learning paths')
      learningPathsData = sampleLearningPaths
    }

    return NextResponse.json({
      success: true,
      learningPaths: learningPathsData
    })

  } catch (error) {
    console.error('Get learning paths error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
