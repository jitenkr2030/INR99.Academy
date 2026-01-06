import { db } from '@/lib/db'

async function updateCFALevel1Course() {
  console.log('🌱 Starting CFA Level 1 course update...')

  // Find the CFA Level 1 course
  const course = await db.course.findFirst({
    where: {
      OR: [
        { id: 'cfa_level1' },
        { title: { contains: 'CFA Level 1', mode: 'insensitive' } }
      ]
    }
  })

  if (!course) {
    console.log('❌ CFA Level 1 course not found in database')
    return
  }

  console.log(`✅ Course found: ${course.title}`)
  console.log(`   Course ID: ${course.id}`)

  // Delete existing lessons for this course
  const deletedLessons = await db.lesson.deleteMany({
    where: { courseId: course.id }
  })
  console.log(`🧹 Cleaned up ${deletedLessons.count} existing lessons`)

  // Delete existing assessments for this course
  const deletedAssessments = await db.assessment.deleteMany({
    where: { courseId: course.id }
  })
  console.log(`🧹 Cleaned up ${deletedAssessments.count} existing assessments`)

  // Define lessons for CFA Level 1 (10 modules, 200 hours)
  const lessons = [
    // Module 1: Ethical & Professional Standards - 30 Hours - Orders 1-99
    { title: 'Ethics & Trust in Capital Markets', duration: 180, order: 1, content: 'Understanding the role of ethics in investment management and building trust in capital markets through ethical behavior.' },
    { title: 'CFA Institute Code of Ethics', duration: 180, order: 2, content: 'Comprehensive study of the CFA Institute Code of Ethics and its application in professional practice.' },
    { title: 'Standards of Professional Conduct', duration: 200, order: 3, content: 'Detailed examination of the seven Standards of Professional Conduct for CFA charterholders.' },
    { title: 'Guidance for Standards I-VII', duration: 220, order: 4, content: 'Practical guidance and application examples for each of the seven standards of professional conduct.' },
    { title: 'Ethical Decision-Making Framework', duration: 180, order: 5, content: 'Structured framework for making ethical decisions in complex professional situations.' },
    { title: 'GIPS Standards – Basics', duration: 180, order: 6, content: 'Introduction to Global Investment Performance Standards (GIPS) and their requirements.' },
    { title: 'Ethics Case Studies & Exam Practice', duration: 200, order: 7, content: 'Real-world case studies and practice questions focusing on ethics and professional conduct.' },
    
    // Module 2: Quantitative Methods - 35 Hours - Orders 100-199
    { title: 'Time Value of Money', duration: 200, order: 101, content: 'Mastering TVM concepts including present value, future value, annuities, and perpetuities.' },
    { title: 'Discounted Cash Flow Applications', duration: 180, order: 102, content: 'Applying DCF methods to investment analysis and valuation problems.' },
    { title: 'Statistical Concepts & Probability', duration: 200, order: 103, content: 'Fundamental statistical concepts including measures of central tendency, dispersion, and probability theory.' },
    { title: 'Descriptive Statistics', duration: 180, order: 104, content: 'Understanding and interpreting descriptive statistics for data analysis.' },
    { title: 'Probability Distributions', duration: 200, order: 105, content: 'Study of probability distributions including normal, binomial, and other distributions.' },
    { title: 'Sampling & Estimation', duration: 180, order: 106, content: 'Techniques for sampling data and estimating population parameters from samples.' },
    { title: 'Hypothesis Testing', duration: 220, order: 107, content: 'Conducting and interpreting hypothesis tests for investment decision making.' },
    { title: 'Correlation & Regression Analysis', duration: 200, order: 108, content: 'Analyzing relationships between variables using correlation and regression techniques.' },
    
    // Module 3: Economics - 25 Hours - Orders 200-299
    { title: 'Microeconomics – Demand & Supply', duration: 180, order: 201, content: 'Understanding supply and demand dynamics and their impact on market prices.' },
    { title: 'Consumer & Producer Theory', duration: 180, order: 202, content: 'Analyzing consumer behavior and production decisions in microeconomic contexts.' },
    { title: 'Market Structures', duration: 180, order: 203, content: 'Study of different market structures including perfect competition, monopoly, and oligopoly.' },
    { title: 'Macroeconomics – GDP, Inflation, Cycles', duration: 200, order: 204, content: 'Understanding macroeconomic indicators and their impact on investment decisions.' },
    { title: 'Fiscal & Monetary Policy', duration: 200, order: 205, content: 'Analyzing the effects of fiscal and monetary policy on financial markets.' },
    { title: 'International Trade', duration: 150, order: 206, content: 'Understanding international trade concepts, benefits, and barriers.' },
    { title: 'Currency Exchange Rates', duration: 180, order: 207, content: 'Study of exchange rate determination and their impact on international investments.' },
    
    // Module 4: Financial Statement Analysis - 35 Hours - Orders 300-399
    { title: 'Financial Reporting Standards (IFRS & US GAAP)', duration: 220, order: 301, content: 'Comparison of IFRS and US GAAP standards and their application in financial reporting.' },
    { title: 'Income Statement Analysis', duration: 200, order: 302, content: 'Analyzing income statements to assess company profitability and performance.' },
    { title: 'Balance Sheet Analysis', duration: 180, order: 303, content: 'Understanding balance sheet components and their implications for financial health.' },
    { title: 'Cash Flow Statement', duration: 200, order: 304, content: 'Analyzing cash flow statements to understand company liquidity and cash generation.' },
    { title: 'Financial Ratios & Interpretation', duration: 220, order: 305, content: 'Calculating and interpreting key financial ratios for investment analysis.' },
    { title: 'Inventories & Long-lived Assets', duration: 200, order: 306, content: 'Accounting treatment and analysis of inventories and long-lived assets.' },
    { title: 'Income Taxes', duration: 180, order: 307, content: 'Understanding the impact of income taxes on financial statements and valuation.' },
    { title: 'Financial Reporting Quality', duration: 180, order: 308, content: 'Assessing quality of financial reports and identifying red flags in reporting.' },
    
    // Module 5: Corporate Issuers (Corporate Finance) - 20 Hours - Orders 400-499
    { title: 'Corporate Governance', duration: 180, order: 401, content: 'Understanding corporate governance frameworks and their impact on firm value.' },
    { title: 'Capital Budgeting', duration: 200, order: 402, content: 'Techniques for evaluating and selecting long-term investment projects.' },
    { title: 'Cost of Capital', duration: 180, order: 403, content: 'Calculating and applying weighted average cost of capital in valuation.' },
    { title: 'Leverage & Capital Structure', duration: 180, order: 404, content: 'Analyzing the effects of financial leverage and capital structure decisions.' },
    { title: 'Working Capital Management', duration: 150, order: 405, content: 'Managing short-term assets and liabilities for optimal liquidity.' },
    { title: 'Dividend & Share Repurchase Policies', duration: 150, order: 406, content: 'Understanding corporate distribution policies and their implications.' },
    
    // Module 6: Equity Investments - 20 Hours - Orders 500-599
    { title: 'Market Organization & Structure', duration: 150, order: 501, content: 'Understanding how equity markets are organized and how they function.' },
    { title: 'Equity Securities', duration: 180, order: 502, content: 'Types and characteristics of equity securities and their valuation.' },
    { title: 'Industry & Company Analysis', duration: 200, order: 503, content: 'Frameworks for analyzing industries and individual companies.' },
    { title: 'Equity Valuation Concepts', duration: 180, order: 504, content: 'Fundamental concepts and approaches to equity valuation.' },
    { title: 'Dividend Discount Models', duration: 180, order: 505, content: 'Applying DDM and its variations to equity valuation.' },
    { title: 'Price Multiples', duration: 180, order: 506, content: 'Using price multiples for relative valuation of equity securities.' },
    
    // Module 7: Fixed Income - 20 Hours - Orders 600-699
    { title: 'Fixed Income Instruments', duration: 180, order: 601, content: 'Understanding characteristics and features of fixed income securities.' },
    { title: 'Bond Pricing & Yield Measures', duration: 200, order: 602, content: 'Calculating bond prices and various yield measures for analysis.' },
    { title: 'Yield Curve Analysis', duration: 180, order: 603, content: 'Analyzing the yield curve and its implications for interest rates.' },
    { title: 'Credit Risk & Ratings', duration: 180, order: 604, content: 'Understanding credit analysis, bond ratings, and credit risk assessment.' },
    { title: 'Bond Duration & Convexity', duration: 180, order: 605, content: 'Measuring and managing interest rate risk in fixed income portfolios.' },
    
    // Module 8: Derivatives - 15 Hours - Orders 700-799
    { title: 'Derivative Markets & Instruments', duration: 150, order: 701, content: 'Overview of derivative markets and types of derivative instruments.' },
    { title: 'Forwards & Futures', duration: 180, order: 702, content: 'Understanding forward and futures contracts and their applications.' },
    { title: 'Options', duration: 200, order: 703, content: 'Options markets, pricing models, and trading strategies.' },
    { title: 'Swaps', duration: 150, order: 704, content: 'Understanding swap agreements and their uses in risk management.' },
    { title: 'Risk Management Applications', duration: 150, order: 705, content: 'Applying derivatives for hedging and risk management purposes.' },
    
    // Module 9: Alternative Investments - 10 Hours - Orders 800-899
    { title: 'Real Estate Investments', duration: 120, order: 801, content: 'Understanding real estate as an investment vehicle and valuation methods.' },
    { title: 'Private Equity', duration: 120, order: 802, content: 'Characteristics and valuation of private equity investments.' },
    { title: 'Hedge Funds', duration: 120, order: 803, content: 'Understanding hedge fund strategies and performance evaluation.' },
    { title: 'Commodities', duration: 100, order: 804, content: 'Analyzing commodity investments and their role in portfolios.' },
    { title: 'Infrastructure & Digital Assets', duration: 100, order: 805, content: 'Alternative investments in infrastructure and emerging digital asset classes.' },
    
    // Module 10: Portfolio Management & Wealth Planning - 10 Hours - Orders 900-999
    { title: 'Portfolio Risk & Return', duration: 120, order: 901, content: 'Measuring and analyzing risk-return characteristics of portfolios.' },
    { title: 'Modern Portfolio Theory', duration: 120, order: 902, content: 'Understanding MPT and its application in portfolio construction.' },
    { title: 'CAPM & Factor Models', duration: 120, order: 903, content: 'Applying CAPM and multi-factor models for expected returns.' },
    { title: 'Investment Policy Statement', duration: 100, order: 904, content: 'Developing IPS for individual and institutional investors.' },
    { title: 'Behavioral Finance Basics', duration: 100, order: 905, content: 'Understanding behavioral biases and their impact on investment decisions.' },
    
    // Module 11: Exam & Revision - 20 Hours - Orders 1000-1099
    { title: 'CFA Curriculum Question Practice', duration: 180, order: 1001, content: 'Comprehensive question practice covering all curriculum areas.' },
    { title: 'LOS-wise MCQ Solving', duration: 200, order: 1002, content: 'Learning Outcome Statement-based multiple choice question practice.' },
    { title: 'Ethics-weighted Mock Exams', duration: 220, order: 1003, content: 'Full-length mock exams with emphasis on ethics and professional standards.' },
    { title: 'Formula Sheets & Quick Revision', duration: 180, order: 1004, content: 'Quick reference formula sheets and key concepts for revision.' },
    { title: 'Exam-Day Strategy (CBT Focus)', duration: 150, order: 1005, content: 'Strategies for computer-based testing and time management.' },
    { title: '90-Day / 60-Day / 30-Day Study Plans', duration: 200, order: 1006, content: 'Structured study plans for different preparation timelines.' },
  ]

  // Create lessons
  console.log(`📝 Creating ${lessons.length} lessons across 11 modules...`)
  
  for (const lessonData of lessons) {
    await db.lesson.create({
      data: {
        ...lessonData,
        courseId: course.id,
        videoUrl: '', // Empty for now
        isActive: true,
      }
    })
    console.log(`✅ Lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Create assessments
  console.log('📊 Creating assessments...')
  
  const assessments = [
    {
      title: 'Ethics & Standards Mock Test',
      type: 'PRACTICE' as const,
    },
    {
      title: 'Quantitative Methods Assessment',
      type: 'PRACTICE' as const,
    },
    {
      title: 'Financial Statement Analysis Quiz',
      type: 'PRACTICE' as const,
    },
    {
      title: 'CFA Level I Full Mock Exam',
      type: 'PRACTICE' as const,
    },
    {
      title: 'CFA Level I Final Assessment',
      type: 'PRACTICE' as const,
    },
  ]

  for (const assessmentData of assessments) {
    await db.assessment.create({
      data: {
        ...assessmentData,
        courseId: course.id,
        isActive: true,
      }
    })
    console.log(`✅ Assessment: ${assessmentData.title}`)
  }

  // Calculate total duration
  const totalMinutes = lessons.reduce((sum, l) => sum + l.duration, 0)
  const totalHours = Math.floor(totalMinutes / 60)

  console.log(`
============================================================
🎉 CFA Level 1 Complete Course updated successfully!
============================================================
📖 Course: ${course.title}
📁 Course ID: ${course.id}
📊 Structure Summary:
   📚 Total Modules: 11 (10 Core + 1 Exam Prep)
   📝 Total Lessons: ${lessons.length}
   ⏱️ Total Duration: ${totalHours} hours
   📝 Total Assessments: ${assessments.length}
📚 Modules Breakdown:
   1. Ethical & Professional Standards (7 lessons, 30h)
   2. Quantitative Methods (8 lessons, 35h)
   3. Economics (7 lessons, 25h)
   4. Financial Statement Analysis (8 lessons, 35h)
   5. Corporate Issuers (6 lessons, 20h)
   6. Equity Investments (6 lessons, 20h)
   7. Fixed Income (5 lessons, 20h)
   8. Derivatives (5 lessons, 15h)
   9. Alternative Investments (5 lessons, 10h)
   10. Portfolio Management & Wealth Planning (5 lessons, 10h)
   11. Exam & Revision (6 lessons, 20h)
✅ Ready to publish!
`)
}

updateCFALevel1Course()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
