import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed No-Code Algo Trading Course...')

  const courseId = 'no-code-algo-trading'

  // Check if course already exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (existingCourse) {
    console.log(`⚠️ Course "${courseId}" already exists. Deleting old data...`)
    
    // Delete associated lessons first
    await prisma.lesson.deleteMany({
      where: { courseId: courseId },
    })
    
    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    })
    
    console.log('🗑️ Old course data deleted.')
  }

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { isActive: true },
  })
  
  const instructorId = instructor?.id || 'inst-stock-market-faculty'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      title: 'No-Code Algo Trading Course',
      description: 'Learn to design, test, deploy, and monitor algorithmic trading strategies using no-code platforms without any programming knowledge.',
      thumbnail: '/assets/courses/no-code-algo-trading.svg',
      difficulty: 'ADVANCED',
      duration: 1800, // 30 hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons
  const modules = [
    {
      moduleNum: 1,
      title: 'Algo Trading Fundamentals',
      duration: 240, // 4 hours
      lessons: [
        { title: 'Introduction to Algo Trading', duration: 30, order: 1 },
        { title: 'What is Algorithmic Trading', duration: 30, order: 2 },
        { title: 'Manual vs Automated Trading', duration: 30, order: 3 },
        { title: 'Advantages of Algo Trading', duration: 30, order: 4 },
        { title: 'Risks and Limitations', duration: 30, order: 5 },
        { title: 'Market Suitability for Algo Trading', duration: 30, order: 6 },
        { title: 'Regulatory Overview in India', duration: 30, order: 7 },
        { title: 'Setting Expectations', duration: 30, order: 8 },
      ]
    },
    {
      moduleNum: 2,
      title: 'No-Code Algo Platforms Overview',
      duration: 240, // 4 hours
      lessons: [
        { title: 'Popular No-Code Platforms', duration: 30, order: 9 },
        { title: 'Platform Comparison Overview', duration: 30, order: 10 },
        { title: 'Strategy Builders Explained', duration: 30, order: 11 },
        { title: 'Logic Blocks and Components', duration: 30, order: 12 },
        { title: 'Broker API Integration', duration: 30, order: 13 },
        { title: 'Data Feeds and Execution Flow', duration: 30, order: 14 },
        { title: 'Platform Limitations to Consider', duration: 30, order: 15 },
        { title: 'Choosing Your Platform', duration: 30, order: 16 },
      ]
    },
    {
      moduleNum: 3,
      title: 'Strategy Logic & Rule Design',
      duration: 300, // 5 hours
      lessons: [
        { title: 'Entry Rule Building Basics', duration: 30, order: 17 },
        { title: 'Exit Rule Building Basics', duration: 30, order: 18 },
        { title: 'Indicator-Based Logic', duration: 30, order: 19 },
        { title: 'Price Action Logic', duration: 30, order: 20 },
        { title: 'Volume-Based Signals', duration: 30, order: 21 },
        { title: 'Time-Based Conditions', duration: 30, order: 22 },
        { title: 'Combining Multiple Conditions', duration: 30, order: 23 },
        { title: 'Logical Operators in No-Code', duration: 30, order: 24 },
        { title: 'Avoiding Over-Optimization', duration: 30, order: 25 },
        { title: 'Strategy Documentation', duration: 30, order: 26 },
      ]
    },
    {
      moduleNum: 4,
      title: 'Backtesting & Optimization',
      duration: 300, // 5 hours
      lessons: [
        { title: 'Understanding Backtesting', duration: 30, order: 27 },
        { title: 'Historical Data Requirements', duration: 30, order: 28 },
        { title: 'Backtesting Metrics Explained', duration: 30, order: 29 },
        { title: 'Win Rate and Profit Factor', duration: 30, order: 30 },
        { title: 'Drawdown Analysis', duration: 30, order: 31 },
        { title: 'Expectancy Calculation', duration: 30, order: 32 },
        { title: 'Parameter Optimization', duration: 30, order: 33 },
        { title: 'Walk-Forward Analysis', duration: 30, order: 34 },
        { title: 'Curve-Fitting Traps', duration: 30, order: 35 },
        { title: 'Realistic Backtesting Practices', duration: 30, order: 36 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Risk Management for Algos',
      duration: 240, // 4 hours
      lessons: [
        { title: 'Position Sizing Rules', duration: 30, order: 37 },
        { title: 'Fixed Fractional Sizing', duration: 30, order: 38 },
        { title: 'Maximum Loss Rules', duration: 30, order: 39 },
        { title: 'Daily Stop Logic', duration: 30, order: 40 },
        { title: 'Risk-Reward Automation', duration: 30, order: 41 },
        { title: 'Fail-Safe Mechanisms', duration: 30, order: 42 },
        { title: 'Kill-Switch Design', duration: 30, order: 43 },
        { title: 'Risk Policy Integration', duration: 30, order: 44 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Live Deployment & Execution',
      duration: 240, // 4 hours
      lessons: [
        { title: 'Paper Trading Introduction', duration: 30, order: 45 },
        { title: 'Paper vs Live Trading', duration: 30, order: 46 },
        { title: 'Live Deployment Checklist', duration: 30, order: 47 },
        { title: 'Order Types in Algo Trading', duration: 30, order: 48 },
        { title: 'Execution Timing', duration: 30, order: 49 },
        { title: 'Slippage Control', duration: 30, order: 50 },
        { title: 'Latency Management', duration: 30, order: 51 },
        { title: 'Monitoring Live Trades', duration: 30, order: 52 },
      ]
    },
    {
      moduleNum: 7,
      title: 'Algo Monitoring & Improvement',
      duration: 120, // 2 hours
      lessons: [
        { title: 'Performance Review Basics', duration: 30, order: 53 },
        { title: 'Strategy Degradation Detection', duration: 30, order: 54 },
        { title: 'Parameter Re-calibration', duration: 30, order: 55 },
        { title: 'When to Stop an Algo', duration: 30, order: 56 },
      ]
    },
    {
      moduleNum: 8,
      title: 'Build Your No-Code Algo System',
      duration: 120, // 2 hours
      lessons: [
        { title: 'Strategy Selection Process', duration: 30, order: 57 },
        { title: 'Platform Setup Guide', duration: 30, order: 58 },
        { title: 'Risk Policy Integration', duration: 30, order: 59 },
        { title: 'Deployment Roadmap', duration: 30, order: 60 },
      ]
    },
  ]

  // Create all lessons
  let lessonCount = 0
  for (const moduleData of modules) {
    for (const lessonData of moduleData.lessons) {
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
      lessonCount++
    }
    console.log(`✅ Created module: ${moduleData.title} (${moduleData.lessons.length} lessons)`)
  }

  console.log(`🎉 Successfully created ${lessonCount} lessons across ${modules.length} modules`)
  console.log('✨ No-Code Algo Trading Course seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
