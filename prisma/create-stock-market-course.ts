import { db } from '../src/lib/db'

async function main() {
  console.log('Creating Stock Market Basics course...')

  // Check if course already exists
  const existingCourse = await db.course.findFirst({
    where: {
      id: 'stock-market-basics',
    },
  })

  if (existingCourse) {
    console.log('Course "Stock Market Basics" already exists!')
    return
  }

  // Find or create the instructor
  const instructor = await db.instructor.upsert({
    where: { id: 'inst-stock-market-faculty' },
    update: {},
    create: {
      id: 'inst-stock-market-faculty',
      name: 'Stock Market Faculty',
      bio: 'Expert faculty for stock market and investment courses',
    },
  })
  console.log(`✅ Instructor: ${instructor.name}`)

  // Create the Stock Market Basics course
  const course = await db.course.create({
    data: {
      id: 'stock-market-basics',
      title: 'Stock Market Basics',
      description: 'Learn the fundamentals of the Indian stock market, from understanding how markets work to making your first informed investment decisions.',
      difficulty: 'INTERMEDIATE',
      duration: 900, // 15 hours = 900 minutes
      isActive: true,
      thumbnail: '/assets/courses/stock-market-basics.svg',
      instructorId: instructor.id,
      learningPathId: 'investment-trading', // Investment & Trading path
    },
  })

  console.log(`Created course: ${course.id}`)

  // Create lessons grouped by modules
  const lessonsData = [
    // Module 1: Introduction to Stock Markets (orders 1-99)
    { title: 'What is the stock market?', order: 1, duration: 20, content: 'Introduction to stock markets and how they function in India.' },
    { title: 'History & evolution of stock markets', order: 2, duration: 20, content: 'The journey of stock markets from paper trading to digital platforms.' },
    { title: 'Role of NSE & BSE', order: 3, duration: 20, content: 'Understanding India\'s two major stock exchanges.' },
    { title: 'Primary vs Secondary market', order: 4, duration: 20, content: 'Difference between IPOs and trading on exchanges.' },
    { title: 'Why companies issue shares', order: 5, duration: 20, content: 'How companies raise capital through equity issuance.' },
    { title: 'How investors make money', order: 6, duration: 20, content: 'Capital gains, dividends, and wealth creation through stocks.' },

    // Module 2: Market Participants & Instruments (orders 100-199)
    { title: 'Retail investors, FIIs & DIIs', order: 101, duration: 25, content: 'Understanding different types of market participants.' },
    { title: 'Brokers, exchanges & regulators (SEBI)', order: 102, duration: 25, content: 'The role of intermediaries and regulatory bodies.' },
    { title: 'Shares, IPOs & bonus issues', order: 103, duration: 25, content: 'Types of equity instruments and corporate actions.' },
    { title: 'Indices (NIFTY, SENSEX)', order: 104, duration: 25, content: 'Understanding market indices as performance indicators.' },
    { title: 'Market capitalization', order: 105, duration: 20, content: 'How company size is measured in the stock market.' },

    // Module 3: Trading Basics (orders 200-299)
    { title: 'Demat & trading accounts', order: 201, duration: 30, content: 'Setting up accounts for investing in Indian markets.' },
    { title: 'Types of orders (Market, Limit, Stop-loss)', order: 202, duration: 30, content: 'Different order types and their uses.' },
    { title: 'Trading hours & settlement cycle', order: 203, duration: 30, content: 'Market timing and T+2 settlement process.' },
    { title: 'Intraday vs delivery trading', order: 204, duration: 30, content: 'Day trading versus long-term investing strategies.' },
    { title: 'Brokerage, taxes & charges', order: 205, duration: 30, content: 'Understanding the costs of trading and investing.' },

    // Module 4: Basics of Technical Analysis (orders 300-399)
    { title: 'Understanding price charts', order: 301, duration: 35, content: 'Introduction to reading stock charts and price action.' },
    { title: 'Candlestick patterns (basic)', order: 302, duration: 35, content: 'Common candlestick patterns for beginners.' },
    { title: 'Support & resistance', order: 303, duration: 35, content: 'Key price levels and market psychology.' },
    { title: 'Trend analysis', order: 304, duration: 35, content: 'Identifying market trends and their significance.' },
    { title: 'Introduction to indicators (Moving Average, RSI)', order: 305, duration: 35, content: 'Basic technical indicators for analysis.' },

    // Module 5: Basics of Fundamental Analysis (orders 400-499)
    { title: 'Understanding company financials', order: 401, duration: 35, content: 'Introduction to financial statements and reports.' },
    { title: 'Revenue, profit & balance sheet basics', order: 402, duration: 35, content: 'Key financial metrics for stock selection.' },
    { title: 'Valuation concepts (P/E, EPS)', order: 403, duration: 35, content: 'Common valuation ratios and their meaning.' },
    { title: 'Sector & industry analysis', order: 404, duration: 35, content: 'How to evaluate industries and sectors.' },
    { title: 'Long-term investing mindset', order: 405, duration: 35, content: 'Building wealth through patient investing.' },

    // Module 6: Risk Management & Beginner Strategies (orders 500-599)
    { title: 'Risk vs return', order: 501, duration: 20, content: 'Understanding the risk-reward relationship.' },
    { title: 'Diversification basics', order: 502, duration: 20, content: 'Portfolio diversification strategies.' },
    { title: 'Common beginner mistakes', order: 503, duration: 20, content: 'Pitfalls to avoid for new investors.' },
    { title: 'Long-term vs short-term strategies', order: 504, duration: 20, content: 'Choosing the right investment approach.' },
    { title: 'Ethical & disciplined investing', order: 505, duration: 20, content: 'Building good financial habits for success.' },
  ]

  // Create all lessons
  const createdLessons = []
  for (const lessonData of lessonsData) {
    const lesson = await db.lesson.create({
      data: {
        ...lessonData,
        courseId: course.id,
        isActive: true,
      },
    })
    createdLessons.push(lesson)
    console.log(`Created lesson: ${lesson.title}`)
  }

  // Create assessments
  const assessmentsData = [
    {
      title: 'Module 1-2 Quiz: Stock Market Fundamentals',
      type: 'QUIZ',
      order: 1,
    },
    {
      title: 'Module 3-4 Quiz: Trading & Technical Analysis',
      type: 'QUIZ',
      order: 2,
    },
    {
      title: 'Module 5-6 Quiz: Analysis & Risk Management',
      type: 'QUIZ',
      order: 3,
    },
    {
      title: 'Final Assessment: Stock Market Basics',
      type: 'PRACTICE',
      order: 4,
    },
  ]

  for (const assessment of assessmentsData) {
    await db.assessment.create({
      data: {
        ...assessment,
        courseId: course.id,
        isActive: true,
      },
    })
    console.log(`Created assessment: ${assessment.title}`)
  }

  console.log('Stock Market Basics course created successfully!')
  console.log(`Total lessons: ${createdLessons.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
