import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Price Action-Only Trading Course...')

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { name: { contains: 'INR99', mode: 'insensitive' } }
  })

  const instructorId = instructor?.id || 'inst-stock-market-faculty'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: 'price-action-trading' },
    update: {},
    create: {
      id: 'price-action-trading',
      title: 'Price Action-Only Trading Course',
      description: 'Master raw price behavior without relying on indicators. Learn market structure, support/resistance, supply-demand zones, candlestick psychology, and institutional price movement.',
      thumbnail: '/assets/courses/price-action-trading.svg',
      difficulty: 'ADVANCED',
      duration: 2100, // 35 hours in minutes
      instructorId: instructorId,
      learningPathId: null,
      isActive: true,
    },
  })

  console.log(`Course created: ${course.id}`)

  // Delete existing lessons for this course
  await prisma.lesson.deleteMany({
    where: { courseId: course.id }
  })

  // Delete existing assessments for this course
  await prisma.assessment.deleteMany({
    where: { courseId: course.id }
  })

  // Module 1: Price Action Philosophy & Mindset (3 hours = 180 minutes, 8 lessons)
  const module1Lessons = [
    { title: 'Introduction to Price Action Trading', duration: 20, order: 1 },
    { title: 'What is Price Action Trading', duration: 22, order: 2 },
    { title: 'Why Indicators Lag Price', duration: 25, order: 3 },
    { title: 'Professional Trader Mindset', duration: 28, order: 4 },
    { title: 'Price vs Emotion', duration: 24, order: 5 },
    { title: 'Market Logic vs Prediction', duration: 25, order: 6 },
    { title: 'Setting Up Price Action Workspace', duration: 20, order: 7 },
    { title: 'Price Action Trading Principles', duration: 16, order: 8 },
  ]

  // Module 2: Candlestick Psychology (6 hours = 360 minutes, 12 lessons)
  const module2Lessons = [
    { title: 'Candlestick Anatomy & Structure', duration: 25, order: 101 },
    { title: 'Understanding Buyer-Seller Conflict', duration: 28, order: 102 },
    { title: 'Reading Candle Wicks & Bodies', duration: 30, order: 103 },
    { title: 'Candle Rejection Signals', duration: 32, order: 104 },
    { title: 'Candle Acceptance Patterns', duration: 28, order: 105 },
    { title: 'Momentum Candles Identification', duration: 30, order: 106 },
    { title: 'False Signals & Traps', duration: 32, order: 107 },
    { title: 'Confluence in Candlestick Patterns', duration: 30, order: 108 },
    { title: 'Single Candlestick Reversal Signals', duration: 32, order: 109 },
    { title: 'Multi-Candlestick Continuation Patterns', duration: 30, order: 110 },
    { title: 'Reading Candles on Live Charts', duration: 33, order: 111 },
    { title: 'Candlestick Practice Exercises', duration: 30, order: 112 },
  ]

  // Module 3: Market Structure & Trend Analysis (5 hours = 300 minutes, 10 lessons)
  const module3Lessons = [
    { title: 'Understanding Higher Highs & Higher Lows', duration: 28, order: 201 },
    { title: 'Lower Highs & Lower Lows Analysis', duration: 28, order: 202 },
    { title: 'Break of Structure (BOS) Explained', duration: 32, order: 203 },
    { title: 'Trend Continuation Signals', duration: 30, order: 204 },
    { title: 'Trend Reversal Identification', duration: 32, order: 205 },
    { title: 'Range-Bound Market Dynamics', duration: 30, order: 206 },
    { title: 'Market Phases Analysis', duration: 32, order: 207 },
    { title: 'Swing Highs & Swing Lows', duration: 28, order: 208 },
    { title: 'Structure Timeframe Analysis', duration: 30, order: 209 },
    { title: 'Market Structure Trading Exercise', duration: 30, order: 210 },
  ]

  // Module 4: Support, Resistance & Supply-Demand (6 hours = 360 minutes, 12 lessons)
  const module4Lessons = [
    { title: 'Understanding Support Levels', duration: 28, order: 301 },
    { title: 'Understanding Resistance Levels', duration: 28, order: 302 },
    { title: 'Strong vs Weak Levels', duration: 32, order: 303 },
    { title: 'Introduction to Supply Zones', duration: 30, order: 304 },
    { title: 'Introduction to Demand Zones', duration: 30, order: 305 },
    { title: 'Zone Creation Logic', duration: 32, order: 306 },
    { title: 'Fresh vs Tested Zones', duration: 30, order: 307 },
    { title: 'Weakness vs Strength in Zones', duration: 30, order: 308 },
    { title: 'Institutional Footprints in Zones', duration: 32, order: 309 },
    { title: 'Drawing Supply-Demand Zones', duration: 28, order: 310 },
    { title: 'Zone Trading Strategies', duration: 30, order: 311 },
    { title: 'Supply-Demand Practice Session', duration: 30, order: 312 },
  ]

  // Module 5: High-Probability Price Action Setups (6 hours = 360 minutes, 12 lessons)
  const module5Lessons = [
    { title: 'Breakout & Retest Strategy', duration: 28, order: 401 },
    { title: 'Pullback Entry Techniques', duration: 32, order: 402 },
    { title: 'Rejection-Based Entry Signals', duration: 30, order: 403 },
    { title: 'Range Trading Setups', duration: 30, order: 404 },
    { title: 'Trap & Fakeout Detection', duration: 32, order: 405 },
    { title: 'Liquidity Sweep Strategies', duration: 30, order: 406 },
    { title: 'Order Block Trading', duration: 32, order: 407 },
    { title: 'Fair Value Gap Trading', duration: 30, order: 408 },
    { title: 'Change of Character (CHoCH) Signals', duration: 32, order: 409 },
    { title: 'Market Structure Shift Entries', duration: 30, order: 410 },
    { title: 'Combining Multiple Confluences', duration: 32, order: 411 },
    { title: 'Price Action Setup Practice', duration: 32, order: 412 },
  ]

  // Module 6: Risk Management Using Price Action (4 hours = 240 minutes, 8 lessons)
  const module6Lessons = [
    { title: 'Logical Stop-Loss Placement', duration: 28, order: 501 },
    { title: 'Stop-Loss Beyond Structure', duration: 30, order: 502 },
    { title: 'Risk-Reward Ratio Planning', duration: 32, order: 503 },
    { title: 'Position Sizing Calculations', duration: 30, order: 504 },
    { title: 'Drawdown Control Strategies', duration: 30, order: 505 },
    { title: 'Trade Invalidation Points', duration: 32, order: 506 },
    { title: 'Risk Per Trade Management', duration: 28, order: 507 },
    { title: 'Risk Management Case Studies', duration: 30, order: 508 },
  ]

  // Module 7: Multi-Timeframe Price Action (3 hours = 180 minutes, 6 lessons)
  const module7Lessons = [
    { title: 'Higher Timeframe Bias Analysis', duration: 28, order: 601 },
    { title: 'Lower Timeframe Execution', duration: 32, order: 602 },
    { title: 'Entry Refinement Techniques', duration: 30, order: 603 },
    { title: 'Trade Filtering with MTF', duration: 30, order: 604 },
    { title: 'Precision Timing Strategies', duration: 32, order: 605 },
    { title: 'Multi-Timeframe Practice Session', duration: 28, order: 606 },
  ]

  // Module 8: Build Your Price Action Trading System (2 hours = 120 minutes, 4 lessons)
  const module8Lessons = [
    { title: 'Defining Strategy Rules', duration: 28, order: 801 },
    { title: 'Creating Entry-Exit Checklist', duration: 30, order: 802 },
    { title: 'Trading Journal Template Design', duration: 32, order: 803 },
    { title: 'Backtesting Your Price Action Strategy', duration: 30, order: 804 },
  ]

  // Combine all lessons
  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
    ...module7Lessons,
    ...module8Lessons,
  ]

  console.log(`Creating ${allLessons.length} lessons...`)

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: lesson.title,
        content: `Content for ${lesson.title}`,
        duration: lesson.duration,
        order: lesson.order,
        videoUrl: null,
        isActive: true,
      },
    })
  }

  console.log('Lessons created successfully!')

  // Create assessments
  const assessments = [
    { title: 'Price Action Fundamentals Quiz', type: 'QUIZ' as const },
    { title: 'Candlestick Psychology Assessment', type: 'QUIZ' as const },
    { title: 'Market Structure & Analysis Quiz', type: 'QUIZ' as const },
    { title: 'Price Action Trading System Project', type: 'SCENARIO' as const },
    { title: 'Final Certification Assessment', type: 'PRACTICE' as const },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: assessment.title,
        type: assessment.type,
        isActive: true,
      },
    })
  }

  console.log('Assessments created successfully!')
  console.log('Price Action-Only Trading Course setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
