import { db } from '@/lib/db'

async function checkCFALevel2Course() {
  try {
    console.log('🔍 Checking for CFA Level II course in database...')
    
    // Check for CFA Level II course
    const course = await db.course.findFirst({
      where: {
        id: 'cfa_level2',
        isActive: true,
      },
      include: {
        _count: {
          select: {
            lessons: true,
            assessments: true,
          },
        },
      },
    })
    
    if (course) {
      console.log('✅ Found existing course:')
      console.log(`   ID: ${course.id}`)
      console.log(`   Title: ${course.title}`)
      console.log(`   Description: ${course.description}`)
      console.log(`   Lessons count: ${course._count.lessons}`)
      console.log(`   Assessments count: ${course._count.assessments}`)
      console.log(`   Duration: ${course.duration} hours`)
    } else {
      console.log('❌ No course found with ID: cfa_level2')
      
      // Let's search for any CFA-related courses
      console.log('\n🔍 Searching for any CFA-related courses...')
      const allCourses = await db.course.findMany({
        where: {
          OR: [
            { id: { contains: 'cfa', mode: 'insensitive' } },
            { title: { contains: 'cfa', mode: 'insensitive' } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          duration: true,
        },
      })
      
      if (allCourses.length > 0) {
        console.log('Found CFA-related courses:')
        allCourses.forEach(c => {
          console.log(`   - ID: ${c.id}, Title: ${c.title}, Duration: ${c.duration}`)
        })
      } else {
        console.log('No CFA-related courses found in database.')
      }
    }
    
  } catch (error) {
    console.error('Error checking courses:', error)
  } finally {
    await db.$disconnect()
  }
}

checkCFALevel2Course()
