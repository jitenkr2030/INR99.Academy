import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Continuing SSC MTS (Multi-Tasking Staff) Preparation seeding...')

  const courseId = 'ssc_mts'

  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' } } }
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

  // Module 5: Mock Tests, Exam Strategy & Tips (lessons 67-83)
  const module5Lessons = [
    { title: 'Full-Length Mock Test 1 - Paper I', duration: 60, order: 67 },
    { title: 'Mock Test 1 - Detailed Discussion', duration: 30, order: 68 },
    { title: 'Full-Length Mock Test 2 - Paper I', duration: 60, order: 69 },
    { title: 'Mock Test 2 - Detailed Discussion', duration: 30, order: 70 },
    { title: 'Full-Length Mock Test 3 - Paper I', duration: 60, order: 71 },
    { title: 'Mock Test 3 - Detailed Discussion', duration: 30, order: 72 },
    { title: 'Paper II - Descriptive Writing Tips', duration: 30, order: 73 },
    { title: 'Paper II - Typing Practice', duration: 30, order: 74 },
    { title: 'Section-wise Performance Analysis', duration: 30, order: 75 },
    { title: 'Time Management Strategies', duration: 30, order: 76 },
    { title: 'Attempt Order & Technique', duration: 30, order: 77 },
    { title: 'Common Pitfalls to Avoid', duration: 30, order: 78 },
    { title: 'Negative Marking Strategy', duration: 20, order: 79 },
    { title: 'Quick Revision Tips', duration: 20, order: 80 },
    { title: 'Exam-Day Preparation', duration: 20, order: 81 },
    { title: 'Final Exam Checklist', duration: 20, order: 82 },
    { title: 'Confidence Building Techniques', duration: 20, order: 83 },
  ]

  let addedCount = 0
  for (const lessonData of module5Lessons) {
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

  console.log(`\n🎉 SSC MTS Course seeding completed!`)
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
