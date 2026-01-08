const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying seeded courses...\n')

  try {
    // Get all courses with their IDs
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Total courses seeded: ${courses.length}\n`)

    console.log('📚 All seeded courses:')
    console.log('='.repeat(70))
    
    courses.forEach((course, index) => {
      console.log(`${String(index + 1).padStart(2, ' ')}. ${course.id.padEnd(30)} - ${course.title}`)
      console.log(`   Lessons: ${course._count.lessons}`)
      console.log('')
    })

    // Test a few expected course IDs from the API route
    console.log('\n🧪 Testing specific course IDs from API route:')
    console.log('='.repeat(70))

    const testIds = [
      'cr_english_mastery',
      'cr_indian_constitution',
      'python-masterclass',
      'web-development-bootcamp',
      'digital-marketing-complete'
    ]

    for (const id of testIds) {
      const course = await prisma.course.findUnique({
        where: { id }
      })
      
      if (course) {
        console.log(`✅ Found: ${id}`)
        console.log(`   Title: ${course.title}`)
        console.log(`   Lessons: ${course._count.lessons}`)
      } else {
        console.log(`❌ Missing: ${id}`)
      }
      console.log('')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
