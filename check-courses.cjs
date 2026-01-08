const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database for courses...\n')

  try {
    // Count total courses
    const totalCourses = await prisma.course.count()
    console.log(`📊 Total courses in database: ${totalCourses}`)

    if (totalCourses === 0) {
      console.log('❌ Database is empty! Courses need to be seeded.')
      return
    }

    // Get first 10 courses with their IDs and titles
    const courses = await prisma.course.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        instructor: {
          select: {
            name: true
          }
        }
      }
    })

    console.log('\n📚 Sample courses from database:')
    console.log('='.repeat(60))
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course.id}`)
      console.log(`   Title: ${course.title}`)
      console.log(`   Instructor: ${course.instructor.name}`)
      console.log('')
    })

    // Check if any courses match expected IDs from the API route
    const expectedIds = [
      'ssc_mts', 'ssc_cgl', 'ssc_chsl', 'upsc_prelims', 'upsc_mains',
      'cr_english_mastery', 'cr_indian_constitution', 'college_bsc_pcm',
      'school_primary_1_5', 'python-masterclass'
    ]

    console.log('\n🔍 Checking for expected course IDs:')
    console.log('='.repeat(60))

    for (const id of expectedIds) {
      const course = await prisma.course.findUnique({
        where: { id }
      })
      
      if (course) {
        console.log(`✅ Found: ${id} - ${course.title}`)
      } else {
        console.log(`❌ Missing: ${id}`)
      }
    }

  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
