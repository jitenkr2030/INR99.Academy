import { db } from './lib/db'

async function checkCMAFinal() {
  try {
    // Check for existing CMA courses
    const cmaCourses = await db.course.findMany({
      where: {
        OR: [
          { id: { contains: 'cma', mode: 'insensitive' } },
          { title: { contains: 'CMA', mode: 'insensitive' } }
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

    console.log('\n=== Existing CMA Courses ===')
    console.log(JSON.stringify(cmaCourses, null, 2))

    // Specifically check for CMA Final
    const cmaFinal = await db.course.findFirst({
      where: {
        OR: [
          { id: 'cma_final' },
          { title: { contains: 'Final', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: {
            lessons: true,
            assessments: true
          }
        }
      }
    })

    console.log('\n=== CMA Final Course Check ===')
    console.log(JSON.stringify(cmaFinal, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkCMAFinal()
