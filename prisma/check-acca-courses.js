const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking if ACCA courses exist...')
  
  try {
    const existingCourses = await prisma.course.findMany({
      where: {
        OR: [
          { id: { startsWith: 'acca', mode: 'insensitive' } },
          { title: { contains: 'ACCA', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        duration: true,
        _count: {
          select: { lessons: true }
        }
      }
    })
    
    if (existingCourses.length > 0) {
      console.log('❌ ACCA courses already exist!')
      existingCourses.forEach(course => {
        console.log(`  - ${course.id}: ${course.title} (${course.duration} mins, ${course._count.lessons} lessons)`)
      })
    } else {
      console.log('✅ No ACCA courses found - safe to create both Level 1 and Level 2')
    }
    
  } catch (error) {
    console.error('Error checking courses:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()