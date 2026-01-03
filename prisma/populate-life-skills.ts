import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for Life Skills Category courses...')

  // Life2: Investment & Wealth Building (INTERMEDIATE, 200 min) - 2 modules x 100 lessons each
  const life2 = await prisma.course.findUnique({ where: { id: 'life2' } })
  if (life2) {
    console.log('Creating lessons for life2: Investment & Wealth Building...')
    await prisma.lesson.deleteMany({ where: { courseId: life2.id } })
    
    const modules = [
      { name: 'Investment Fundamentals & Market Basics', order: 100 },
      { name: 'Advanced Wealth Building Strategies', order: 200 },
    ]
    
    const lessons = []
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessons.push({
          courseId: life2.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering essential concepts in ${module.name.toLowerCase()}. This lesson provides detailed explanations of investment strategies, market analysis techniques, and wealth accumulation principles for building long-term financial security.`,
          videoUrl: 'https://example.com/video',
          duration: 2,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 200 lessons for Investment & Wealth Building')
  }

  // Life3: Tax Planning & Insurance (INTERMEDIATE, 180 min) - 2 modules x 100 lessons each
  const life3 = await prisma.course.findUnique({ where: { id: 'life3' } })
  if (life3) {
    console.log('Creating lessons for life3: Tax Planning & Insurance...')
    await prisma.lesson.deleteMany({ where: { courseId: life3.id } })
    
    const modules = [
      { name: 'Tax Planning & Compliance', order: 100 },
      { name: 'Insurance Planning & Risk Management', order: 200 },
    ]
    
    const lessons = []
    
    for (const module of modules) {
      for (let i = 1; i <= 100; i++) {
        lessons.push({
          courseId: life3.id,
          title: `${module.name} - Lesson ${i}`,
          content: `Comprehensive lesson covering critical aspects of ${module.name.toLowerCase()}. This lesson explores tax optimization strategies, legal compliance requirements, insurance product selection, and risk management techniques for comprehensive financial planning.`,
          videoUrl: 'https://example.com/video',
          duration: 2,
          order: module.order + i,
          isActive: true,
        })
      }
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 200 lessons for Tax Planning & Insurance')
  }

  // Life4: Nutrition & Healthy Living (BEGINNER, 120 min) - 1 module x 100 lessons + 1 module x 20 lessons
  const life4 = await prisma.course.findUnique({ where: { id: 'life4' } })
  if (life4) {
    console.log('Creating lessons for life4: Nutrition & Healthy Living...')
    await prisma.lesson.deleteMany({ where: { courseId: life4.id } })
    
    const modules = [
      { name: 'Nutrition Fundamentals', order: 100 },
      { name: 'Healthy Living Practices', order: 200 },
    ]
    
    const lessons = []
    
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: life4.id,
        title: `${modules[0].name} - Lesson ${i}`,
        content: `Comprehensive lesson covering essential concepts in ${modules[0].name.toLowerCase()}. This lesson provides detailed information about macronutrients, micronutrients, meal planning, and dietary guidelines for maintaining optimal health and wellness.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: modules[0].order + i,
        isActive: true,
      })
    }
    
    // Module 2: 20 lessons
    for (let i = 1; i <= 20; i++) {
      lessons.push({
        courseId: life4.id,
        title: `${modules[1].name} - Lesson ${i}`,
        content: `Comprehensive lesson covering practical aspects of ${modules[1].name.toLowerCase()}. This lesson explores healthy lifestyle habits, exercise routines, stress management, and holistic wellness approaches for sustainable health improvement.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: modules[1].order + i,
        isActive: true,
      })
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 120 lessons for Nutrition & Healthy Living')
  }

  // Life5: Fitness & Exercise (BEGINNER, 140 min) - 1 module x 100 lessons + 1 module x 40 lessons
  const life5 = await prisma.course.findUnique({ where: { id: 'life5' } })
  if (life5) {
    console.log('Creating lessons for life5: Fitness & Exercise...')
    await prisma.lesson.deleteMany({ where: { courseId: life5.id } })
    
    const modules = [
      { name: 'Fitness Fundamentals', order: 100 },
      { name: 'Exercise Programming', order: 200 },
    ]
    
    const lessons = []
    
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: life5.id,
        title: `${modules[0].name} - Lesson ${i}`,
        content: `Comprehensive lesson covering foundational knowledge of ${modules[0].name.toLowerCase()}. This lesson provides detailed explanations of exercise physiology, strength training principles, cardiovascular conditioning, and flexibility exercises for all fitness levels.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: modules[0].order + i,
        isActive: true,
      })
    }
    
    // Module 2: 40 lessons
    for (let i = 1; i <= 40; i++) {
      lessons.push({
        courseId: life5.id,
        title: `${modules[1].name} - Lesson ${i}`,
        content: `Comprehensive lesson covering practical applications of ${modules[1].name.toLowerCase()}. This lesson explores workout program design, progressive overload techniques, recovery strategies, and sport-specific training methodologies for achieving fitness goals.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: modules[1].order + i,
        isActive: true,
      })
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 140 lessons for Fitness & Exercise')
  }

  // Life6: Mental Health & Mindfulness (BEGINNER, 100 min) - 1 module x 100 lessons
  const life6 = await prisma.course.findUnique({ where: { id: 'life6' } })
  if (life6) {
    console.log('Creating lessons for life6: Mental Health & Mindfulness...')
    await prisma.lesson.deleteMany({ where: { courseId: life6.id } })
    
    const modules = [
      { name: 'Mental Health & Mindfulness Basics', order: 100 },
    ]
    
    const lessons = []
    
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: life6.id,
        title: `${modules[0].name} - Lesson ${i}`,
        content: `Comprehensive lesson covering essential concepts in ${modules[0].name.toLowerCase()}. This lesson provides detailed information about psychological well-being, meditation techniques, stress reduction strategies, and emotional intelligence development for improved mental health.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: modules[0].order + i,
        isActive: true,
      })
    }
    
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 100 lessons for Mental Health & Mindfulness')
  }

  console.log('All Life Skills Category courses have been populated!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
