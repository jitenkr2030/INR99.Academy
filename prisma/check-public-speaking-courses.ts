import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking Public Speaking courses in database...\n')

  // Find all courses related to public speaking
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: 'Public Speaking', mode: 'insensitive' } },
        { title: { contains: 'speaking', mode: 'insensitive' } },
      ],
      isActive: true,
    },
    include: {
      _count: {
        select: { lessons: true }
      },
      instructor: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${courses.length} courses:\n`)
  
  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`)
    console.log(`   ID: ${course.id}`)
    console.log(`   Difficulty: ${course.difficulty}`)
    console.log(`   Lessons: ${course._count.lessons}`)
    console.log(`   Duration: ${course.duration} minutes`)
    console.log(`   Instructor: ${course.instructor.name}`)
    console.log('')
  })

  if (courses.length === 0) {
    console.log('No public speaking courses found.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
