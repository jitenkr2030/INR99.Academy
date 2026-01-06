const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding US CMA Part 2 Complete Course...\n');

  const courseId = 'us_cma_part2';

  // Module 1: Financial Statement Analysis (25 Hours)
  const module1Lessons = [
    { title: 'Financial Ratios & Trend Analysis', order: 1 },
    { title: 'Vertical & Horizontal Analysis', order: 2 },
    { title: 'Cash Flow Analysis & Forecasting', order: 3 },
    { title: 'Profitability Evaluation Methods', order: 4 },
    { title: 'Liquidity Assessment Techniques', order: 5 },
    { title: 'Solvency Analysis & Coverage Ratios', order: 6 },
    { title: 'Interpretation for Decision-Making', order: 7 },
    { title: 'Common Size Financial Statements', order: 8 },
    { title: 'Benchmarking Against Industry Standards', order: 9 },
    { title: 'Financial Statement Quality Analysis', order: 10 },
    { title: 'Predictive Analytics in Financial Statements', order: 11 },
    { title: 'Working Capital Analysis', order: 12 },
    { title: 'Asset Quality Assessment', order: 13 },
    { title: 'Liability & Equity Structure Analysis', order: 14 },
    { title: 'Case-Based Financial Analysis Exercise 1', order: 15 },
    { title: 'Case-Based Financial Analysis Exercise 2', order: 16 },
    { title: 'Case-Based Financial Analysis Exercise 3', order: 17 },
    { title: 'Practice Questions - Module 1', order: 18 },
    { title: 'Quick Revision - Module 1', order: 19 },
    { title: 'Module Assessment Preparation', order: 20 },
  ];

  // Module 2: Corporate Finance (30 Hours)
  const module2Lessons = [
    { title: 'Time Value of Money Concepts', order: 21 },
    { title: 'Net Present Value (NPV) Analysis', order: 22 },
    { title: 'Internal Rate of Return (IRR) Calculations', order: 23 },
    { title: 'Cost of Capital: WACC Calculation', order: 24 },
    { title: 'Cost of Debt & Cost of Equity', order: 25 },
    { title: 'Capital Budgeting Decision Rules', order: 26 },
    { title: 'Capital Structure Theories', order: 27 },
    { title: 'Leverage Analysis: DFL & DOL', order: 28 },
    { title: 'Optimal Capital Structure Planning', order: 29 },
    { title: 'Dividend Policy Fundamentals', order: 30 },
    { title: 'Dividend Theories & Clientele Effect', order: 31 },
    { title: 'Shareholder Value Creation', order: 32 },
    { title: 'Working Capital Management Overview', order: 33 },
    { title: 'Cash Conversion Cycle Optimization', order: 34 },
    { title: 'Inventory Management Techniques', order: 35 },
    { title: 'Receivables Management Strategies', order: 36 },
    { title: 'Payables & Short-Term Financing', order: 37 },
    { title: 'Corporate Finance Case Study 1', order: 38 },
    { title: 'Corporate Finance Case Study 2', order: 39 },
    { title: 'Corporate Finance Case Study 3', order: 40 },
    { title: 'Practice Questions - Module 2', order: 41 },
    { title: 'Quick Revision - Module 2', order: 42 },
    { title: 'Module Assessment Preparation', order: 43 },
  ];

  // Module 3: Decision Analysis & Risk Management (25 Hours)
  const module3Lessons = [
    { title: 'Short-Term Decision-Making Framework', order: 44 },
    { title: 'Long-Term Strategic Decisions', order: 45 },
    { title: 'Cost-Volume-Profit Analysis (Advanced)', order: 46 },
    { title: 'Contribution Margin Analysis', order: 47 },
    { title: 'Relevant Cost Concepts', order: 48 },
    { title: 'Make vs Buy Decisions', order: 49 },
    { title: 'Special Order Decisions', order: 50 },
    { title: 'Drop or Add Segment Analysis', order: 51 },
    { title: 'Sell or Process Further Analysis', order: 52 },
    { title: 'Risk Assessment Fundamentals', order: 53 },
    { title: 'Risk Identification & Quantification', order: 54 },
    { title: 'Sensitivity Analysis Techniques', order: 55 },
    { title: 'Scenario Analysis & Planning', order: 56 },
    { title: 'Decision Trees in Business', order: 57 },
    { title: 'Expected Value Calculations', order: 58 },
    { title: 'Real Options Analysis', order: 59 },
    { title: 'Risk Response Strategies', order: 60 },
    { title: 'Decision Analysis Case Exercises 1', order: 61 },
    { title: 'Decision Analysis Case Exercises 2', order: 62 },
    { title: 'Practice Questions - Module 3', order: 63 },
    { title: 'Quick Revision - Module 3', order: 64 },
    { title: 'Module Assessment Preparation', order: 65 },
  ];

  // Module 4: Investment & Portfolio Decisions (25 Hours)
  const module4Lessons = [
    { title: 'Capital Budgeting Techniques Overview', order: 66 },
    { title: 'Discounted Cash Flow Methods Deep Dive', order: 67 },
    { title: 'Payback Period & Discounted Payback', order: 68 },
    { title: 'Profitability Index Calculations', order: 69 },
    { title: 'Risk-Adjusted Return Metrics', order: 70 },
    { title: 'CAPM & Cost of Equity Integration', order: 71 },
    { title: 'Project Risk Assessment', order: 72 },
    { title: 'Country Risk in International Projects', order: 73 },
    { title: 'Project Ranking Methods', order: 74 },
    { title: 'Mutually Exclusive Projects Analysis', order: 75 },
    { title: 'Capital Rationing Decisions', order: 76 },
    { title: 'Lease vs Buy Analysis', order: 77 },
    { title: 'Replacement Decision Analysis', order: 78 },
    { title: 'Sensitivity & Monte Carlo Simulation', order: 79 },
    { title: 'Investment Case Analysis 1', order: 80 },
    { title: 'Investment Case Analysis 2', order: 81 },
    { title: 'Investment Case Analysis 3', order: 82 },
    { title: 'Practice Questions - Module 4', order: 83 },
    { title: 'Quick Revision - Module 4', order: 84 },
    { title: 'Module Assessment Preparation', order: 85 },
  ];

  // Module 5: Professional Ethics & Governance (20 Hours)
  const module5Lessons = [
    { title: 'CMA Code of Ethics Overview', order: 86 },
    { title: 'Principles of Professional Conduct', order: 87 },
    { title: 'Ethical Decision-Making Framework', order: 88 },
    { title: 'Governance Structures & Best Practices', order: 89 },
    { title: 'Board Responsibilities & Oversight', order: 90 },
    { title: 'Risk Management Governance', order: 91 },
    { title: 'Internal Control Framework', order: 92 },
    { title: 'Fraud Prevention Fundamentals', order: 93 },
    { title: 'Fraud Detection Techniques', order: 94 },
    { title: 'Whistleblower Protections', order: 95 },
    { title: 'Conflicts of Interest Management', order: 96 },
    { title: 'Confidentiality & Data Protection', order: 97 },
    { title: 'Ethical Dilemmas in Finance 1', order: 98 },
    { title: 'Ethical Dilemmas in Finance 2', order: 99 },
    { title: 'Corporate Ethics Case Studies 1', order: 100 },
    { title: 'Corporate Ethics Case Studies 2', order: 101 },
    { title: 'Practice Questions - Module 5', order: 102 },
    { title: 'Quick Revision - Module 5', order: 103 },
    { title: 'Module Assessment Preparation', order: 104 },
  ];

  // Module 6: Strategic Decision-Making & Exam Practice (25 Hours)
  const module6Lessons = [
    { title: 'Integrated Financial Planning & Analysis', order: 105 },
    { title: 'Strategic Management Decision Frameworks', order: 106 },
    { title: 'Balanced Scorecard Implementation', order: 107 },
    { title: 'Value Chain Analysis', order: 108 },
    { title: 'Competitive Advantage Strategies', order: 109 },
    { title: 'Scenario & Contingency Planning', order: 110 },
    { title: 'Environmental Scanning Techniques', order: 111 },
    { title: 'SWOT Analysis Integration', order: 112 },
    { title: 'Corporate Strategy Formulation', order: 113 },
    { title: 'Implementation & Control', order: 114 },
    { title: 'Practice MCQs Set 1', order: 115 },
    { title: 'Practice MCQs Set 2', order: 116 },
    { title: 'Scenario-Based Practice Questions 1', order: 117 },
    { title: 'Scenario-Based Practice Questions 2', order: 118 },
    { title: 'Mock Exam 1 - Part 1', order: 119 },
    { title: 'Mock Exam 1 - Part 2', order: 120 },
    { title: 'Mock Exam 2 - Part 1', order: 121 },
    { title: 'Mock Exam 2 - Part 2', order: 122 },
    { title: 'Exam Strategy & Time Management', order: 123 },
    { title: 'Final Revision - Key Concepts', order: 124 },
    { title: 'Final Revision - Formulas & Terms', order: 125 },
  ];

  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
  ];

  console.log(`Total lessons to create: ${allLessons.length}`);

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        order: lesson.order,
        courseId: courseId,
        duration: 60, // 60 minutes per lesson
        content: `# ${lesson.title}\n\nThis lesson covers the key concepts and applications of ${lesson.title} in US CMA Part 2 curriculum.\n\n## Learning Objectives\n- Understand the fundamental concepts\n- Apply frameworks to real-world scenarios\n- Analyze case studies effectively\n\n## Key Topics\n1. Core principles and definitions\n2. Practical applications\n3. Integration with other topics\n4. Exam-focused practice`,
        videoUrl: `https://cdn.inr99.com/courses/us_cma_part2/lessons/${lesson.order}/video.mp4`,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${allLessons.length} lessons`);

  // Create assessments for each module 1-5
  const moduleAssessments = [
    { title: 'Financial Statement Analysis Assessment', type: 'SCENARIO' },
    { title: 'Corporate Finance Assessment', type: 'SCENARIO' },
    { title: 'Decision Analysis & Risk Management Test', type: 'SCENARIO' },
    { title: 'Investment & Portfolio Decisions Assessment', type: 'SCENARIO' },
    { title: 'Professional Ethics & Governance Test', type: 'SCENARIO' },
  ];

  for (const assessment of moduleAssessments) {
    await prisma.assessment.create({
      data: {
        title: assessment.title,
        type: assessment.type,
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${moduleAssessments.length} module assessments`);

  // Create 2 comprehensive mock exams in Module 6
  for (let i = 1; i <= 2; i++) {
    await prisma.assessment.create({
      data: {
        title: `US CMA Part 2 Mock Exam ${i}`,
        type: 'PRACTICE',
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created 2 mock exams`);

  console.log('\n🎉 US CMA Part 2 course seeding completed successfully!');
  console.log(`Total: ${allLessons.length} lessons + ${moduleAssessments.length + 2} assessments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
