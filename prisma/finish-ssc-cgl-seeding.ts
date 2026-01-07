import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Finishing SSC CGL Complete Preparation Course seeding...')

  const courseId = 'ssc_cgl'

  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: 'asc' } }
    }
  })

  if (!existingCourse) {
    console.log(`❌ Course "${courseId}" not found.`)
    return
  }

  const existingLessons = existingCourse.lessons || []
  const maxOrder = existingLessons.length > 0 
    ? Math.max(...existingLessons.map(l => l.order))
    : 0

  console.log(`📊 Course found with ${existingLessons.length} lessons (max order: ${maxOrder})`)

  // Final 3 lessons
  const remainingLessons = [
    { title: 'Understanding Marking Scheme', duration: 30, order: 165 },
    { title: 'Normalization Process Explained', duration: 30, order: 166 },
    { title: 'Final Mock Test - Full Simulation', duration: 60, order: 167 },
  ]

  let addedCount = 0
  for (const lessonData of remainingLessons) {
    const exists = existingLessons.some(l => l.order === lessonData.order)
    if (exists) {
      console.log(`⏭️  Skipping lesson ${lessonData.order} (already exists)`)
      continue
    }

    await prisma.lesson.create({
      data: {
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        course: { connect: { id: courseId } },
        content: `Content for ${lessonData.title}`,
        videoUrl: `https://example.com/videos/${courseId}/lesson-${lessonData.order}.mp4`,
      },
    })
    addedCount++
    console.log(`✅ Created lesson ${lessonData.order}: ${lessonData.title}`)
  }

  const finalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  })

  console.log(`\n🎉 SSC CGL Course seeding completed!`)
  console.log(`📊 Total lessons: ${finalCourse?.lessons?.length || 0}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
