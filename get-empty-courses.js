const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Get all courses
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { lessons: true }
      }
    }
  })
  
  // Filter courses with 0 lessons
  const emptyCourses = courses.filter(c => c._count.lessons === 0)
  
  console.log('='.repeat(80))
  console.log('COMPLETE LIST OF COURSES WITH 0 LESSONS')
  console.log('='.repeat(80))
  console.log('Total courses in database:', courses.length)
  console.log('Courses with 0 lessons:', emptyCourses.length)
  console.log('')
  
  // Get categories for better grouping
  const categories = await prisma.category.findMany({ include: { courses: true } })
  const categoryMap = new Map(categories.map(c => [c.id, c.name]))
  
  console.log('DETAILED LIST:')
  console.log('-'.repeat(80))
  
  for (const course of emptyCourses) {
    const catName = categoryMap.get(course.categoryId) || 'No Category'
    console.log('Course:', course.title)
    console.log('  ID:', course.id)
    console.log('  Category:', catName)
    console.log('  Lessons: 0')
    console.log('-'.repeat(80))
  }
  
  console.log('')
  console.log('SUMMARY BY CATEGORY:')
  console.log('-'.repeat(80))
  
  const byCategory = {}
  for (const course of emptyCourses) {
    const catName = categoryMap.get(course.categoryId) || 'Unknown Category'
    if (!byCategory[catName]) {
      byCategory[catName] = []
    }
    byCategory[catName].push({ id: course.id, title: course.title })
  }
  
  for (const [catName, catCourses] of Object.entries(byCategory)) {
    console.log(catName + ': ' + catCourses.length + ' courses')
    catCourses.forEach(c => console.log('  - ' + c.id + ': ' + c.title))
  }
  
  console.log('')
  console.log('JSON OUTPUT FOR SCRIPTING:')
  console.log(JSON.stringify(emptyCourses.map(c => ({
    id: c.id,
    title: c.title,
    categoryId: c.categoryId
  })), null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
