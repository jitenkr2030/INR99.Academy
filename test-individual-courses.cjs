const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Testing individual course API functionality...\n')

  try {
    // Test courses that should now work
    const testCases = [
      { expected: 'upsc_prelims', mapped: 'upsc_prelims', name: 'UPSC Prelims' },
      { expected: 'ssc_mts', mapped: 'ssc_mts', name: 'SSC MTS' },
      { expected: 'career2', mapped: 'python-masterclass', name: 'Python Masterclass (via mapping)' },
      { expected: 'career1', mapped: 'web-development-bootcamp', name: 'Web Development (via mapping)' },
      { expected: 'cr_english', mapped: 'cr_english_mastery', name: 'English Mastery (via mapping)' },
      { expected: 'course-ca-foundation', mapped: 'course-ca-foundation', name: 'CA Foundation' }
    ]

    for (const test of testCases) {
      // Simulate what the API route does
      let courseId = test.mapped
      
      // Check if mapping exists (like the API route does)
      const mapping = {
        'python-masterclass': 'career2',
        'web-development-bootcamp': 'career1',
        'cr_english_mastery': 'cr_english'
      }
      
      if (mapping[courseId]) {
        courseId = mapping[courseId]
      }

      const course = await prisma.course.findFirst({
        where: { id: courseId, isActive: true }
      })

      if (course) {
        console.log(`✅ ${test.name}: Found course "${course.title}"`)
      } else {
        console.log(`❌ ${test.name}: Not found`)
      }
    }

    console.log('\n📊 All seeded courses with their IDs:')
    console.log('='.repeat(70))
    
    const courses = await prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
      take: 50
    })
    
    courses.forEach((course, i) => {
      console.log(`${String(i + 1).padStart(2)}. ${course.id.padEnd(25)} - ${course.title}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
