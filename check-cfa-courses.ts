import { db } from '@/lib/db'

async function checkCFA() {
  try {
    // Check for existing courses with CFA in name/ID
    const cfaCourses = await db.course.findMany({
      where: {
        OR: [
          { id: { contains: 'cfa', mode: 'insensitive' } },
          { title: { contains: 'CFA', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            lessons: true,
            assessments: true,
            progress: true
          }
        }
      }
    })

    console.log('\n=== Existing CFA Courses ===')
    console.log(JSON.stringify(cfaCourses, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkCFA()
