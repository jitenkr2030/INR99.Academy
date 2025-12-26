import { NextRequest, NextResponse } from 'next/server'

// Simple static data for learning path categories - no file system dependencies
export async function GET(request: NextRequest) {
  try {
    // Static fallback data that works in any environment
    const learningPathCategories = [
      {
        id: '1',
        name: 'School Learning',
        slug: 'school-learning',
        description: 'Class 1-12 with all boards',
        icon: '🧒',
        color: 'bg-blue-500',
        sortOrder: 1,
        isFeatured: true,
        learningPaths: [
          { id: '1a', title: 'Primary (1-5)', description: 'Math, EVS, English', icon: '📚', color: 'bg-blue-100', courseCount: 15 },
          { id: '1b', title: 'Middle School (6-8)', description: 'Math, Science, Social', icon: '📖', color: 'bg-blue-100', courseCount: 20 },
          { id: '1c', title: 'Secondary (9-10)', description: 'Math, Science, English', icon: '📝', color: 'bg-blue-100', courseCount: 25 },
          { id: '1d', title: 'Senior Secondary (11-12)', description: 'Science, Commerce, Arts', icon: '🎓', color: 'bg-blue-100', courseCount: 30 }
        ]
      },
      {
        id: '2',
        name: 'College Foundation',
        slug: 'college-foundation',
        description: 'UG degrees and subjects',
        icon: '🎓',
        color: 'bg-green-500',
        sortOrder: 2,
        isFeatured: true,
        learningPaths: [
          { id: '2a', title: 'Commerce', description: 'Accounting, Business', icon: '💼', color: 'bg-green-100', courseCount: 18 },
          { id: '2b', title: 'Computer Science', description: 'Programming, CS fundamentals', icon: '💻', color: 'bg-green-100', courseCount: 22 },
          { id: '2c', title: 'Science', description: 'Physics, Chemistry, Biology', icon: '🔬', color: 'bg-green-100', courseCount: 16 },
          { id: '2d', title: 'Engineering', description: 'Math, Physics basics', icon: '⚙️', color: 'bg-green-100', courseCount: 14 }
        ]
      },
      {
        id: '3',
        name: 'Career Skills',
        slug: 'career-skills',
        description: 'Professional development',
        icon: '🧑‍💼',
        color: 'bg-purple-500',
        sortOrder: 3,
        isFeatured: true,
        learningPaths: [
          { id: '3a', title: 'Professional Skills', description: 'Communication, Leadership', icon: '💪', color: 'bg-purple-100', courseCount: 12 },
          { id: '3b', title: 'Technical Skills', description: 'Web dev, Data analysis', icon: '⚡', color: 'bg-purple-100', courseCount: 20 },
          { id: '3c', title: 'Soft Skills', description: 'Emotional intelligence, Problem solving', icon: '🧠', color: 'bg-purple-100', courseCount: 10 },
          { id: '3d', title: 'Digital Skills', description: 'AI, Automation basics', icon: '🤖', color: 'bg-purple-100', courseCount: 15 }
        ]
      },
      {
        id: '4',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy',
        icon: '💰',
        color: 'bg-orange-500',
        sortOrder: 4,
        isFeatured: true,
        learningPaths: [
          { id: '4a', title: 'Financial Literacy', description: 'Personal finance, Investment', icon: '📊', color: 'bg-orange-100', courseCount: 14 },
          { id: '4b', title: 'Business Fundamentals', description: 'Planning, Entrepreneurship', icon: '🚀', color: 'bg-orange-100', courseCount: 16 },
          { id: '4c', title: 'Investment & Trading', description: 'Stock market, Crypto', icon: '📈', color: 'bg-orange-100', courseCount: 12 },
          { id: '4d', title: 'E-commerce', description: 'Online business, Digital marketing', icon: '🛒', color: 'bg-orange-100', courseCount: 18 }
        ]
      }
    ]

    return NextResponse.json({
      success: true,
      learningPathCategories
    })

  } catch (error) {
    console.error('Get learning path categories error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}