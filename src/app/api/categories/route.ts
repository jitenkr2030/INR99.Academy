import { NextRequest, NextResponse } from 'next/server'

// Simple static data for categories - no file system dependencies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const includeSubcategories = searchParams.get('includeSubcategories') !== 'false'

    // Static fallback data that works in any environment
    const categoriesData = [
      {
        id: '1',
        name: 'School Learning',
        slug: 'school-learning',
        description: 'Class 1-12 with all boards',
        icon: '🧒',
        color: 'bg-blue-100',
        isFeatured: true,
        subcategories: includeSubcategories ? [
          { id: '1a', name: 'Primary (1-5)', slug: 'primary' },
          { id: '1b', name: 'Middle School (6-8)', slug: 'middle' },
          { id: '1c', name: 'Secondary (9-10)', slug: 'secondary' },
          { id: '1d', name: 'Senior Secondary (11-12)', slug: 'senior' }
        ] : []
      },
      {
        id: '2',
        name: 'College Foundation',
        slug: 'college-foundation',
        description: 'UG degrees and subjects',
        icon: '🎓',
        color: 'bg-green-100',
        isFeatured: true,
        subcategories: includeSubcategories ? [
          { id: '2a', name: 'Commerce', slug: 'commerce' },
          { id: '2b', name: 'Computer Science', slug: 'cs' },
          { id: '2c', name: 'Science', slug: 'science' },
          { id: '2d', name: 'Engineering', slug: 'engineering' }
        ] : []
      },
      {
        id: '3',
        name: 'Career Skills',
        slug: 'career-skills',
        description: 'Professional development',
        icon: '🧑‍💼',
        color: 'bg-purple-100',
        isFeatured: true,
        subcategories: includeSubcategories ? [
          { id: '3a', name: 'Professional Skills', slug: 'professional' },
          { id: '3b', name: 'Technical Skills', slug: 'technical' },
          { id: '3c', name: 'Soft Skills', slug: 'soft' },
          { id: '3d', name: 'Digital Skills', slug: 'digital' }
        ] : []
      },
      {
        id: '4',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy',
        icon: '💰',
        color: 'bg-orange-100',
        isFeatured: true,
        subcategories: includeSubcategories ? [
          { id: '4a', name: 'Financial Literacy', slug: 'financial' },
          { id: '4b', name: 'Business Fundamentals', slug: 'business' },
          { id: '4c', name: 'Investment & Trading', slug: 'investment' },
          { id: '4d', name: 'E-commerce', slug: 'ecommerce' }
        ] : []
      }
    ]

    // Filter categories based on featured parameter
    const filteredCategories = featured 
      ? categoriesData.filter(cat => cat.isFeatured)
      : categoriesData

    return NextResponse.json(filteredCategories)

  } catch (error) {
    console.error('Get categories error:', error)
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