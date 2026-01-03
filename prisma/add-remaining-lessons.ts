import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Adding remaining lessons to ADVANCED course...')

  // Check current lessons
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId: 'course_public_speaking' },
    orderBy: { order: 'asc' }
  })

  console.log(`Found ${existingLessons.length} lessons already`)

  // Find which orders are missing
  const existingOrders = existingLessons.map(l => l.order)
  const requiredOrders = [
    701, 702, 703, 704, 705, // Module 7
    801, 802, 803, 804, 805, // Module 8
    901, 902, 903, 904, 905, // Module 9
    1001, 1002, 1003, 1004, 1005 // Module 10
  ]

  // Module 7: The Art of Persuasion (5 lessons)
  const module7Lessons = [
    { order: 701, title: 'Ethos, Pathos, and Logos in Modern Presentations', duration: 18 },
    { order: 702, title: 'The Rule of Three and Rhetorical Devices', duration: 16 },
    { order: 703, title: 'Crafting Powerful Analogies and Metaphors', duration: 17 },
    { order: 704, title: 'Leveraging Social Proof and Authority', duration: 15 },
    { order: 705, title: 'Framing and Anchoring for Maximum Impact', duration: 16 },
  ]

  // Module 8: Handling the Unexpected (5 lessons)
  const module8Lessons = [
    { order: 801, title: 'Preparing for Q&A Sessions', duration: 14 },
    { order: 802, title: 'Bridging Techniques for Difficult Questions', duration: 16 },
    { order: 803, title: 'Managing Hostile Questions and Hecklers', duration: 15 },
    { order: 804, title: 'Recovering from Technical Difficulties', duration: 13 },
    { order: 805, title: 'Gracefully Handling the Unknown', duration: 12 },
  ]

  // Module 9: Virtual and Hybrid Presentations (5 lessons)
  const module9Lessons = [
    { order: 901, title: 'Camera Eye Contact for Virtual Impact', duration: 15 },
    { order: 902, title: 'Professional Lighting and Audio Setup', duration: 18 },
    { order: 903, title: 'Maintaining Engagement on Video Calls', duration: 16 },
    { order: 904, title: 'Screen Sharing and Virtual Presentation Tools', duration: 14 },
    { order: 905, title: 'Hybrid Presentation Mastery', duration: 17 },
  ]

  // Module 10: Professional Application and Capstone (5 lessons)
  const module10Lessons = [
    { order: 1001, title: 'Crafting the Perfect Elevator Pitch', duration: 15 },
    { order: 1002, title: 'Panel Discussion Participation and Moderation', duration: 18 },
    { order: 1003, title: 'Keynote Speaking Fundamentals', duration: 20 },
    { order: 1004, title: 'Building Your Personal Presentation Style', duration: 16 },
    { order: 1005, title: 'Creating Your Development Action Plan', duration: 12 },
  ]

  const allMissingLessons = [
    ...module7Lessons,
    ...module8Lessons,
    ...module9Lessons,
    ...module10Lessons
  ]

  let added = 0
  for (const lesson of allMissingLessons) {
    const exists = existingLessons.find(l => l.order === lesson.order)
    if (!exists) {
      await prisma.lesson.create({
        data: {
          id: `course_public_speaking_lesson_${lesson.order}`,
          courseId: 'course_public_speaking',
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          content: `Content for: ${lesson.title}`,
          isActive: true,
        }
      })
      added++
      console.log(`✅ Added: ${lesson.title}`)
    }
  }

  console.log(`\n📊 Final count: ${existingLessons.length + added} lessons`)

  const final = await prisma.course.findUnique({
    where: { id: 'course_public_speaking' },
    include: { _count: { select: { lessons: true } } }
  })

  console.log(`\n✅ Advanced course now has ${final?._count.lessons} lessons`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
