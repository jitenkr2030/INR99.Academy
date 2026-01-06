import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FRM Part I Complete Course...\n');

  const courseId = 'frm_part1';

  // Module 1: Foundations of Risk Management (25 Hours)
  const module1Lessons = [
    { title: 'Risk Management Overview', order: 1 },
    { title: 'Types of Financial Risks', order: 2 },
    { title: 'Risk Governance & Culture', order: 3 },
    { title: 'Role of Risk Management in Firms', order: 4 },
    { title: 'Basel Regulations Overview', order: 5 },
    { title: 'Case Studies in Risk Failures', order: 6 },
    { title: 'Risk Management Framework', order: 7 },
    { title: 'Risk Appetite & Tolerance', order: 8 },
    { title: 'Risk Identification Process', order: 9 },
    { title: 'Risk Reporting & Communication', order: 10 },
    { title: 'Three Lines of Defense Model', order: 11 },
    { title: 'Enterprise Risk Management (ERM)', order: 12 },
    { title: 'Regulatory & Supervisory Structure', order: 13 },
    { title: 'Risk Decomposition Analysis', order: 14 },
    { title: 'Introduction to Credit Risk', order: 15 },
  ];

  // Module 2: Quantitative Analysis (35 Hours)
  const module2Lessons = [
    { title: 'Probability Theory Basics', order: 16 },
    { title: 'Descriptive Statistics', order: 17 },
    { title: 'Random Variables & Distributions', order: 18 },
    { title: 'Discrete Probability Distributions', order: 19 },
    { title: 'Continuous Probability Distributions', order: 20 },
    { title: 'Hypothesis Testing Fundamentals', order: 21 },
    { title: 'Confidence Intervals', order: 22 },
    { title: 'Correlation Analysis', order: 23 },
    { title: 'Simple Linear Regression', order: 24 },
    { title: 'Multiple Regression Analysis', order: 25 },
    { title: 'Regression Assumptions & Diagnostics', order: 26 },
    { title: 'Time Series Analysis Basics', order: 27 },
    { title: 'ARIMA Models', order: 28 },
    { title: 'Monte Carlo Simulation', order: 29 },
    { title: 'Value at Risk Simulation', order: 30 },
    { title: 'Bootstrapping Methods', order: 31 },
    { title: 'Volatility Estimation', order: 32 },
    { title: ' EWMA & GARCH Models', order: 33 },
    { title: 'Numerical Problem Practice 1', order: 34 },
    { title: 'Numerical Problem Practice 2', order: 35 },
    { title: 'Excel Applications in Quant', order: 36 },
  ];

  // Module 3: Financial Markets & Products (30 Hours)
  const module3Lessons = [
    { title: 'Structure of Financial Markets', order: 37 },
    { title: 'Money Markets', order: 38 },
    { title: 'Capital Markets', order: 39 },
    { title: 'Bonds & Interest Rate Instruments', order: 40 },
    { title: 'Bond Pricing & Yield Calculation', order: 41 },
    { title: 'Duration & Convexity', order: 42 },
    { title: 'Equity Markets & Instruments', order: 43 },
    { title: 'Stock Indices & Benchmarking', order: 44 },
    { title: 'Foreign Exchange Markets', order: 45 },
    { title: 'FX Rates & Cross Rates', order: 46 },
    { title: 'Derivatives Overview & Purpose', order: 47 },
    { title: 'Forward Contracts', order: 48 },
    { title: 'Futures Contracts', order: 49 },
    { title: 'Futures Pricing & Hedging', order: 50 },
    { title: 'Swap Contracts', order: 51 },
    { title: 'Interest Rate Swaps', order: 52 },
    { title: 'Currency Swaps', order: 53 },
    { title: 'Options Basics & Terminology', order: 54 },
    { title: 'Call & Put Options', order: 55 },
    { title: 'Option Payoff Diagrams', order: 56 },
    { title: 'Put-Call Parity', order: 57 },
    { title: 'Market Risk Case Studies', order: 58 },
  ];

  // Module 4: Valuation & Risk Models (35 Hours)
  const module4Lessons = [
    { title: 'Time Value of Money', order: 59 },
    { title: 'Discounted Cash Flow (DCF) Valuation', order: 60 },
    { title: 'Bond Valuation', order: 61 },
    { title: 'Option Valuation Basics', order: 62 },
    { title: 'Black-Scholes Model Introduction', order: 63 },
    { title: 'Value at Risk (VaR) Overview', order: 64 },
    { title: 'VaR Calculation Methods', order: 65 },
    { title: 'Parametric VaR (Variance-Covariance)', order: 66 },
    { title: 'Historical Simulation VaR', order: 67 },
    { title: 'Monte Carlo VaR', order: 68 },
    { title: 'VaR for Options & Portfolios', order: 69 },
    { title: 'Expected Shortfall (CVaR)', order: 70 },
    { title: 'Stress Testing Concepts', order: 71 },
    { title: 'Scenario Analysis Methods', order: 72 },
    { title: 'Historical Scenario Analysis', order: 73 },
    { title: 'Hypothetical Scenario Analysis', order: 74 },
    { title: 'Backtesting Risk Models', order: 75 },
    { title: 'Backtesting Framework & Tests', order: 76 },
    { title: 'Risk Model Limitations', order: 77 },
    { title: 'Model Risk Management', order: 78 },
    { title: 'Validation & Governance', order: 79 },
    { title: 'Quantitative Practice Problems', order: 80 },
  ];

  // Module 5: Market Risk Measurement & Management (10 Hours)
  const module5Lessons = [
    { title: 'Interest Rate Risk Measurement', order: 81 },
    { title: 'Gap Analysis', order: 82 },
    { title: 'Duration Gap Analysis', order: 83 },
    { title: 'Equity Risk Measurement', order: 84 },
    { title: 'Beta & Systematic Risk', order: 85 },
    { title: 'Foreign Exchange Risk', order: 86 },
    { title: 'FX Exposure Measurement', order: 87 },
    { title: 'Commodity Risk', order: 88 },
    { title: 'Commodity Exposure Management', order: 89 },
    { title: 'Risk Aggregation Methods', order: 90 },
  ];

  // Module 6: Probability & Statistics Applications (5 Hours)
  const module6Lessons = [
    { title: 'Practical Risk Calculations', order: 91 },
    { title: 'Data Interpretation Skills', order: 92 },
    { title: 'Statistical Inference in Risk', order: 93 },
    { title: 'Exam-Focused Numerical Practice 1', order: 94 },
    { title: 'Exam-Focused Numerical Practice 2', order: 95 },
  ];

  // Module 7: Integrated FRM Exam Practice (5 Hours)
  const module7Lessons = [
    { title: 'Topic-wise MCQ Practice Set 1', order: 96 },
    { title: 'Topic-wise MCQ Practice Set 2', order: 97 },
    { title: 'GARP-style Question Solving', order: 98 },
    { title: 'Formula Sheet Review', order: 99 },
    { title: 'Quick Revision Guide', order: 100 },
  ];

  // Module 8: Final Revision & Exam Strategy (5 Hours)
  const module8Lessons = [
    { title: '30-Day Study Plan', order: 101 },
    { title: '15-Day Intensive Review', order: 102 },
    { title: '7-Day Final Preparation', order: 103 },
    { title: 'Time Management Techniques', order: 104 },
    { title: 'Exam-Day Strategy & Tips', order: 105 },
    { title: 'Mock Exam Review', order: 106 },
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
  ];

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        order: lesson.order,
        courseId: courseId,
        duration: 90, // 90 minutes per lesson
        content: `# ${lesson.title}\n\nThis lesson covers the key concepts and applications of ${lesson.title} in FRM Part I curriculum.\n\n## Learning Objectives\n- Understand the fundamental concepts\n- Apply frameworks to real-world scenarios\n- Analyze numerical problems effectively\n\n## Key Topics\n1. Core principles and definitions\n2. Practical applications\n3. Numerical problem-solving techniques\n4. Integration with risk management`,
        videoUrl: `https://cdn.inr99.com/courses/frm_part1/lessons/${lesson.order}/video.mp4`,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${allLessons.length} lessons`);

  // Create assessments for each module
  const assessments = [
    { title: 'Foundations of Risk Management Test', type: 'SCENARIO' as const },
    { title: 'Quantitative Analysis Assessment', type: 'SCENARIO' as const },
    { title: 'Financial Markets & Products Test', type: 'SCENARIO' as const },
    { title: 'Valuation & Risk Models Assessment', type: 'SCENARIO' as const },
    { title: 'Market Risk Measurement Test', type: 'SCENARIO' as const },
    { title: 'Probability & Statistics Assessment', type: 'SCENARIO' as const },
    { title: 'FRM Exam Practice Test', type: 'SCENARIO' as const },
    { title: 'Final Revision Assessment', type: 'SCENARIO' as const },
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
        title: `FRM Part I Mock Exam ${i}`,
        type: 'PRACTICE',
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created 2 mock exams`);

  console.log('\n🎉 FRM Part I course seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
