import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CFA Level III Complete Course...\n');

  const courseId = 'cfa_level3';

  // Module 1: Wealth Management
  const module1Lessons = [
    { title: 'Portfolio Management Process Overview', order: 1 },
    { title: 'Investment Policy Statement (IPS) Development', order: 2 },
    { title: 'Strategic Asset Allocation', order: 3 },
    { title: 'Tactical Asset Allocation Strategies', order: 4 },
    { title: 'Asset-Liability Management (ALM)', order: 5 },
    { title: 'Surplus Management Strategies', order: 6 },
    { title: 'Liability-Driven Investing', order: 7 },
    { title: 'Dynamic Risk Management', order: 8 },
    { title: 'Portfolio Execution & Trading', order: 9 },
    { title: 'Wealth Management Technology', order: 10 },
  ];

  // Module 2: Individual Wealth Management
  const module2Lessons = [
    { title: 'Personal Financial Planning Process', order: 11 },
    { title: 'Financial Goal Setting & Prioritization', order: 12 },
    { title: 'Cash Flow Management', order: 13 },
    { title: 'Capital Needs Analysis', order: 14 },
    { title: 'Education Planning Strategies', order: 15 },
    { title: 'Retirement Income Planning', order: 16 },
    { title: 'Tax Efficiency Strategies', order: 17 },
    { title: 'Estate Planning Fundamentals', order: 18 },
    { title: 'Bequit Planning & Wealth Transfer', order: 19 },
    { title: 'Charitable Giving Strategies', order: 20 },
  ];

  // Module 3: Institutional Wealth Management
  const module3Lessons = [
    { title: 'Pension Fund Management', order: 21 },
    { title: 'Defined Benefit vs Defined Contribution', order: 22 },
    { title: 'Endowment Management', order: 23 },
    { title: 'Foundation Investment Management', order: 24 },
    { title: 'Insurance Company Investment Policy', order: 25 },
    { title: 'Bank Asset-Liability Management', order: 26 },
    { title: 'Sovereign Wealth Fund Strategies', order: 27 },
    { title: 'Corporate Treasury Management', order: 28 },
    { title: 'Family Office Wealth Management', order: 29 },
    { title: 'Multi-Family Office Services', order: 30 },
  ];

  // Module 4: Behavioral Finance & Private Wealth
  const module4Lessons = [
    { title: 'Behavioral Biases Overview', order: 31 },
    { title: 'Cognitive vs Emotional Biases', order: 32 },
    { title: 'Loss Aversion & Framing Effects', order: 33 },
    { title: 'Overconfidence & Self-Attribution Bias', order: 34 },
    { title: 'Herding & Market Bubbles', order: 35 },
    { title: 'Behavioral Alpha Strategies', order: 36 },
    { title: 'Client Risk Profiling', order: 37 },
    { title: 'Behavioral Coaching Techniques', order: 38 },
    { title: 'Private Client Risk Assessment', order: 39 },
    { title: 'Psychology of Wealth Management', order: 40 },
  ];

  // Module 5: Alternative Investments
  const module5Lessons = [
    { title: 'Alternative Investment Overview', order: 41 },
    { title: 'Hedge Fund Strategies Deep Dive', order: 42 },
    { title: 'Private Equity Fund Structure', order: 43 },
    { title: 'Private Equity Valuation Methods', order: 44 },
    { title: 'Real Estate Investment Analysis', order: 45 },
    { title: 'REITs vs Direct Real Estate', order: 46 },
    { title: 'Infrastructure Investing', order: 47 },
    { title: 'Commodities Investment Strategies', order: 48 },
    { title: 'Alternative Risk Premia', order: 49 },
    { title: 'Alt Investment Due Diligence', order: 50 },
  ];

  // Module 6: Capital Market Expectations
  const module6Lessons = [
    { title: 'Economic Analysis Framework', order: 51 },
    { title: 'GDP Growth Forecasting', order: 52 },
    { title: 'Inflation Expectations Modeling', order: 53 },
    { title: 'Interest Rate Forecasting', order: 54 },
    { title: 'Equity Risk Premium Estimation', order: 55 },
    { title: 'Currency Exchange Rate Projections', order: 56 },
    { title: 'Building a Macroeconomic Dashboard', order: 57 },
    { title: 'Black-Litterman Model Applications', order: 58 },
    { title: 'Factor Model Integration', order: 59 },
    { title: 'Scenario Analysis for Returns', order: 60 },
  ];

  // Module 7: Asset Allocation
  const module7Lessons = [
    { title: 'Asset Allocation Process', order: 61 },
    { title: 'Mean-Variance Optimization', order: 62 },
    { title: 'Black-Litterman Model Implementation', order: 63 },
    { title: 'Resampling & Monte Carlo Methods', order: 64 },
    { title: 'Risk Parity Strategy', order: 65 },
    { title: 'Strategic vs Tactical Allocation', order: 66 },
    { title: 'Multi-Asset Class Factor Models', order: 67 },
    { title: 'Tax-Aware Asset Location', order: 68 },
    { title: 'Rebalancing Strategies', order: 69 },
    { title: 'Dynamic Asset Allocation', order: 70 },
  ];

  // Module 8: Fixed Income & Derivatives
  const module8Lessons = [
    { title: 'Fixed Income Portfolio Management', order: 71 },
    { title: 'Yield Curve Strategies', order: 72 },
    { title: 'Credit Portfolio Management', order: 73 },
    { title: 'Interest Rate Derivatives', order: 74 },
    { title: 'Credit Derivatives Strategies', order: 75 },
    { title: 'Option Strategies in Portfolios', order: 76 },
    { title: 'Structured Products Analysis', order: 77 },
    { title: 'Duration & Convexity Management', order: 78 },
    { title: 'Fixed Income Attribution', order: 79 },
    { title: 'LDI Strategies for Pensions', order: 80 },
  ];

  // Module 9: Equity & Alternative Strategies
  const module9Lessons = [
    { title: 'Equity Portfolio Strategies', order: 81 },
    { title: 'Growth vs Value Investing', order: 82 },
    { title: 'Factor-Based Equity Investing', order: 83 },
    { title: 'Quantitative Equity Strategies', order: 84 },
    { title: 'Alternative Beta Strategies', order: 85 },
    { title: 'Long-Short Equity Strategies', order: 86 },
    { title: 'Market Neutral Strategies', order: 87 },
    { title: 'Volatility-Based Strategies', order: 88 },
    { title: 'Multi-Strategy Approaches', order: 89 },
    { title: 'Alternative Implementation', order: 90 },
  ];

  // Module 10: Portfolio Execution & Monitoring
  const module10Lessons = [
    { title: 'Performance Measurement', order: 91 },
    { title: 'Performance Attribution', order: 92 },
    { title: 'Benchmark Selection', order: 93 },
    { title: 'Risk Performance Analytics', order: 94 },
    { title: 'GIPS Compliance', order: 95 },
    { title: 'Manager Selection & Monitoring', order: 96 },
    { title: 'Due Diligence Process', order: 97 },
    { title: 'Operational Risk Monitoring', order: 98 },
    { title: 'Portfolio Reporting Standards', order: 99 },
    { title: 'Regulatory Compliance', order: 100 },
  ];

  // Integrated Practice Lessons
  const practiceLessons = [
    { title: 'Integrated Wealth Management Case 1', order: 101 },
    { title: 'Integrated Wealth Management Case 2', order: 102 },
    { title: 'Portfolio Construction Workshop', order: 103 },
    { title: 'Behavioral Finance Application', order: 104 },
    { title: 'Alternative Investment Workshop', order: 105 },
    { title: 'Vignette Practice Set 1', order: 106 },
    { title: 'Vignette Practice Set 2', order: 107 },
    { title: 'Vignette Practice Set 3', order: 108 },
    { title: 'Mock Exam Strategy', order: 109 },
    { title: 'Final Revision - All Modules', order: 110 },
  ];

  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
    ...module7Lessons,
    ...module8Lessons,
    ...module9Lessons,
    ...module10Lessons,
    ...practiceLessons,
  ];

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        order: lesson.order,
        courseId: courseId,
        duration: 90, // 90 minutes per lesson
        content: `# ${lesson.title}\n\nThis lesson covers the key concepts and applications of ${lesson.title} in CFA Level III curriculum.\n\n## Learning Objectives\n- Understand the fundamental concepts\n- Apply frameworks to real-world scenarios\n- Analyze case studies effectively\n\n## Key Topics\n1. Core principles and definitions\n2. Practical applications\n3. Integration with other topics`,
        videoUrl: `https://cdn.inr99.com/courses/cfa_level3/lessons/${lesson.order}/video.mp4`,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${allLessons.length} lessons`);

  // Create assessments for each module
  const assessments = [
    { title: 'Wealth Management Module Test', type: 'SCENARIO' as const, moduleIndex: 1 },
    { title: 'Individual Wealth Management Test', type: 'SCENARIO' as const, moduleIndex: 2 },
    { title: 'Institutional Wealth Management Test', type: 'SCENARIO' as const, moduleIndex: 3 },
    { title: 'Behavioral Finance Assessment', type: 'SCENARIO' as const, moduleIndex: 4 },
    { title: 'Alternative Investments Test', type: 'SCENARIO' as const, moduleIndex: 5 },
    { title: 'Capital Market Expectations Test', type: 'SCENARIO' as const, moduleIndex: 6 },
    { title: 'Asset Allocation Assessment', type: 'SCENARIO' as const, moduleIndex: 7 },
    { title: 'Fixed Income & Derivatives Test', type: 'SCENARIO' as const, moduleIndex: 8 },
    { title: 'Equity & Strategies Assessment', type: 'SCENARIO' as const, moduleIndex: 9 },
    { title: 'Portfolio Execution Final Test', type: 'SCENARIO' as const, moduleIndex: 10 },
  ];

  for (const assessment of assessments) {
    await prisma.assessment.create({
      data: {
        title: assessment.title,
        type: assessment.type,
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${assessments.length} module assessments`);

  // Create 2 comprehensive mock exams
  for (let i = 1; i <= 2; i++) {
    await prisma.assessment.create({
      data: {
        title: `CFA Level III Mock Exam ${i}`,
        type: 'PRACTICE',
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created 2 mock exams`);

  console.log('\n🎉 CFA Level III course seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
