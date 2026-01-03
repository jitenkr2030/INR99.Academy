import { db } from '@/lib/db'

async function checkEmptyCourses() {
  try {
    // Get all courses with their lesson count
    const courses = await db.course.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            lessons: true,
            assessments: true,
            progress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('=== All Courses Status ===\n')
    console.log(`Total active courses: ${courses.length}\n`)

    // Separate courses by lesson count
    const coursesWithLessons = courses.filter(c => c._count.lessons > 0)
    const emptyCourses = courses.filter(c => c._count.lessons === 0)

    console.log(`✓ Courses WITH lessons: ${coursesWithLessons.length}`)
    coursesWithLessons.forEach(course => {
      console.log(`  - ${course.id}: ${course.title} (${course._count.lessons} lessons)`)
    })

    console.log(`\n✗ Courses WITHOUT lessons: ${emptyCourses.length}`)
    emptyCourses.forEach(course => {
      console.log(`  - ${course.id}: ${course.title}`)
      console.log(`    Difficulty: ${course.difficulty || 'N/A'}`)
      console.log(`    Duration: ${course.duration || 'N/A'}`)
      console.log(`    Created: ${course.createdAt}`)
      console.log()
    })

    // Summary
    console.log('=== Summary ===')
    console.log(`Total courses: ${courses.length}`)
    console.log(`Courses with content: ${coursesWithLessons.length}`)
    console.log(`Empty courses: ${emptyCourses.length}`)

    // Show all course IDs with lesson counts
    console.log('\n=== Complete Course List ===')
    courses.forEach(course => {
      const status = course._count.lessons > 0 ? `✓ ${course._count.lessons} lessons` : '✗ Empty'
      console.log(`${status} | ${course.id} | ${course.title}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkEmptyCourses()
