const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Get all courses
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { lessons: true, modules: true }
      }
    }
  })
  
  // Filter courses with 0 lessons or 0 modules
  const emptyCourses = courses.filter(c => c._count.lessons === 0 || c._count.modules === 0)
  
  console.log('='.repeat(80))
  console.log('COURSES WITH MISSING LESSONS OR MODULES')
  console.log('='.repeat(80))
  console.log('Total courses in database:', courses.length)
  console.log('Courses with 0 lessons:', courses.filter(c => c._count.lessons === 0).length)
  console.log('Courses with 0 modules:', courses.filter(c => c._count.modules === 0).length)
  console.log('')
  
  console.log('DETAILED LIST:')
  console.log('-'.repeat(80))
  
  for (const course of emptyCourses) {
    const lessonStatus = course._count.lessons === 0 ? '0 Lessons' : course._count.lessons + ' Lessons'
    const moduleStatus = course._count.modules === 0 ? '0 Modules' : course._count.modules + ' Modules'
    console.log('Course:', course.title)
    console.log('  ID:', course.id)
    console.log('  Lessons:', lessonStatus)
    console.log('  Modules:', moduleStatus)
    console.log('  Category ID:', course.categoryId || 'None')
    console.log('  Instructor ID:', course.instructorId || 'None')
    console.log('-'.repeat(80))
  }
  
  // Get categories for better grouping
  const categories = await prisma.category.findMany({ include: { courses: true } })
  const categoryMap = new Map(categories.map(c => [c.id, c.name]))
  
  console.log('')
  console.log('SUMMARY BY CATEGORY:')
  console.log('-'.repeat(80))
  
  const byCategory = {}
  for (const course of emptyCourses) {
    const catName = categoryMap.get(course.categoryId) || 'Unknown Category'
    if (!byCategory[catName]) {
      byCategory[catName] = []
    }
    byCategory[catName].push(course.title)
  }
  
  for (const [catName, catCourses] of Object.entries(byCategory)) {
    console.log(catName + ': ' + catCourses.length + ' courses')
    catCourses.forEach(c => console.log('  - ' + c))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
