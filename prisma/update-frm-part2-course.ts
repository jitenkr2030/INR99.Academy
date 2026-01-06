import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FRM Part II Complete Course...\n');

  const courseId = 'frm_part2';

  // Module 1: Market Risk Measurement & Management (Advanced) - 30 Hours
  const module1Lessons = [
    { title: 'Advanced Value at Risk (VaR) Techniques', order: 1 },
    { title: 'Parametric VaR Methods', order: 2 },
    { title: 'Non-Parametric VaR Approaches', order: 3 },
    { title: 'Monte Carlo VaR Implementation', order: 4 },
    { title: 'VaR for Options & Derivatives', order: 5 },
    { title: 'VaR Backtesting Framework', order: 6 },
    { title: 'VaR Model Validation Techniques', order: 7 },
    { title: 'Stress Testing Concepts', order: 8 },
    { title: 'Scenario Analysis Methods', order: 9 },
    { title: 'Historical Scenario Analysis', order: 10 },
    { title: 'Hypothetical Scenario Analysis', order: 11 },
    { title: 'Interest Rate Risk Measurement', order: 12 },
    { title: 'Duration & Convexity Analysis', order: 13 },
    { title: 'FX Risk Measurement', order: 14 },
    { title: 'Commodity Risk Assessment', order: 15 },
    { title: 'Hedging Strategies for Market Risk', order: 16 },
    { title: 'Case-Based Market Risk Applications 1', order: 17 },
    { title: 'Case-Based Market Risk Applications 2', order: 18 },
    { title: 'Market Risk Integration & Aggregation', order: 19 },
    { title: 'Advanced Risk Metrics Beyond VaR', order: 20 },
  ];

  // Module 2: Credit Risk Measurement & Management - 30 Hours
  const module2Lessons = [
    { title: 'Credit Risk Fundamentals', order: 21 },
    { title: 'Credit Exposure Measurement', order: 22 },
    { title: 'Default Probability Estimation', order: 23 },
    { title: 'Recovery Rates & Loss Given Default', order: 24 },
    { title: 'Credit Risk Models Overview', order: 25 },
    { title: 'Merton Structural Model', order: 26 },
    { title: 'KMV Model Implementation', order: 27 },
    { title: 'CreditMetrics Framework', order: 28 },
    { title: 'CreditPortfolioView Model', order: 29 },
    { title: 'Reduced Form Credit Models', order: 30 },
    { title: 'Credit Derivatives Basics', order: 31 },
    { title: 'Credit Default Swaps (CDS)', order: 32 },
    { title: 'Credit Linked Notes (CLN)', order: 33 },
    { title: 'Collateralized Debt Obligations (CDO)', order: 34 },
    { title: 'Structured Credit Products', order: 35 },
    { title: 'Credit Portfolio Management', order: 36 },
    { title: 'Credit Risk Diversification', order: 37 },
    { title: 'Stress Testing Credit Portfolios', order: 38 },
    { title: 'Credit Risk Case Studies 1', order: 39 },
    { title: 'Credit Risk Case Studies 2', order: 40 },
  ];

  // Module 3: Operational & Liquidity Risk - 25 Hours
  const module3Lessons = [
    { title: 'Operational Risk Fundamentals', order: 41 },
    { title: 'Types of Operational Risk', order: 42 },
    { title: 'Risk Identification Processes', order: 43 },
    { title: 'Loss Data Collection & Analysis', order: 44 },
    { title: 'Scenario Analysis for Operational Risk', order: 45 },
    { title: 'Key Risk Indicators (KRIs)', order: 46 },
    { title: 'Operational Risk Assessment', order: 47 },
    { title: 'Liquidity Risk Fundamentals', order: 48 },
    { title: 'Funding Liquidity Risk', order: 49 },
    { title: 'Market Liquidity Risk', order: 50 },
    { title: 'Liquidity Measurement Metrics', order: 51 },
    { title: 'Liquidity Stress Testing', order: 52 },
    { title: 'Liquidity Risk Mitigation', order: 53 },
    { title: 'Operational Risk Mitigation Techniques', order: 54 },
    { title: 'Insurance & Risk Transfer', order: 55 },
    { title: 'Basel II Operational Risk Framework', order: 56 },
    { title: 'Basel III Liquidity Requirements', order: 57 },
    { title: 'Operational Risk Case Studies 1', order: 58 },
    { title: 'Operational Risk Case Studies 2', order: 59 },
    { title: 'Liquidity Risk Case Studies', order: 60 },
  ];

  // Module 4: Investment & Portfolio Risk Management - 30 Hours
  const module4Lessons = [
    { title: 'Portfolio Theory Refresher', order: 61 },
    { title: 'Efficient Frontier Analysis', order: 62 },
    { title: 'Capital Market Theory', order: 63 },
    { title: 'Risk-Adjusted Return Measures', order: 64 },
    { title: 'Sharpe Ratio Applications', order: 65 },
    { title: 'Treynor Ratio & Information Ratio', order: 66 },
    { title: 'Jensen Alpha & Performance Attribution', order: 67 },
    { title: 'Factor Models Introduction', order: 68 },
    { title: 'Single Factor Models', order: 69 },
    { title: 'Multi-Factor Models', order: 70 },
    { title: 'Fama-French Three Factor Model', order: 71 },
    { title: 'Multi-Asset Class Risk Analysis', order: 72 },
    { title: 'Portfolio Optimization with Constraints', order: 73 },
    { title: 'Black-Litterman Model', order: 74 },
    { title: 'Risk Budgeting Approaches', order: 75 },
    { title: 'Asset Allocation Strategies', order: 76 },
    { title: 'Hedging Strategies in Portfolios', order: 77 },
    { title: 'Alternative Investment Risks', order: 78 },
    { title: 'Hedge Fund Risk Management', order: 79 },
    { title: 'Case-Based Portfolio Applications 1', order: 80 },
    { title: 'Case-Based Portfolio Applications 2', order: 81 },
  ];

  // Module 5: Risk Models & Quantitative Applications - 25 Hours
  const module5Lessons = [
    { title: 'Advanced Regression Analysis', order: 82 },
    { title: 'Multiple Regression Extensions', order: 83 },
    { title: 'Time Series Analysis Basics', order: 84 },
    { title: 'AR Models', order: 85 },
    { title: 'MA Models', order: 86 },
    { title: 'ARMA Models', order: 87 },
    { title: 'Unit Root Testing', order: 88 },
    { title: 'Cointegration Analysis', order: 89 },
    { title: 'Volatility Modeling', order: 90 },
    { title: 'ARCH Models', order: 91 },
    { title: 'GARCH Models', order: 92 },
    { title: 'GARCH Extensions (EGARCH, GJR-GARCH)', order: 93 },
    { title: 'Extreme Value Theory Basics', order: 94 },
    { title: 'Peak Over Threshold (POT) Method', order: 95 },
    { title: 'Credit Risk Model Implementation', order: 96 },
    { title: 'Market Risk Model Implementation', order: 97 },
    { title: 'Monte Carlo Simulation Techniques', order: 98 },
    { title: 'Importance Sampling & Variance Reduction', order: 99 },
    { title: 'Integrated Quantitative Case Studies 1', order: 100 },
    { title: 'Integrated Quantitative Case Studies 2', order: 101 },
  ];

  // Module 6: Current Issues in Financial Risk - 15 Hours
  const module6Lessons = [
    { title: 'Regulatory Changes Overview', order: 102 },
    { title: 'Basel III Framework Updates', order: 103 },
    { title: 'Basel IV Finalization', order: 104 },
    { title: 'Capital Requirement Calculations', order: 105 },
    { title: 'IFRS 9 Overview', order: 106 },
    { title: 'Expected Credit Loss (ECL) Modeling', order: 107 },
    { title: 'IFRS 9 Staging & Impairment', order: 108 },
    { title: 'Systemic Risk Concepts', order: 109 },
    { title: 'Systemic Risk Measurement', order: 110 },
    { title: 'Stress Testing Regulations', order: 111 },
    { title: 'Enterprise Risk Management Trends', order: 112 },
    { title: 'Climate Risk in Finance', order: 113 },
    { title: 'Cyber Risk Management', order: 114 },
    { title: 'Emerging Risk Case Studies 1', order: 115 },
    { title: 'Emerging Risk Case Studies 2', order: 116 },
  ];

  // Module 7: Integrated Risk Management & ERM - 25 Hours
  const module7Lessons = [
    { title: 'Enterprise Risk Management Framework', order: 117 },
    { title: 'ERM Process & Methodology', order: 118 },
    { title: 'Risk Appetite Definition', order: 119 },
    { title: 'Risk Appetite Statement Development', order: 120 },
    { title: 'Risk Tolerance Setting', order: 121 },
    { title: 'Risk Culture Development', order: 122 },
    { title: 'Three Lines of Defense Model', order: 123 },
    { title: 'Risk Reporting Standards', order: 124 },
    { title: 'Key Risk Indicators (KRIs) Design', order: 125 },
    { title: 'Dashboard & Visualization', order: 126 },
    { title: 'Risk Aggregation Methods', order: 127 },
    { title: 'Strategic Risk Planning', order: 128 },
    { title: 'Risk-adjusted Performance Measurement', order: 129 },
    { title: 'Economic Capital Framework', order: 130 },
    { title: 'RAROC Applications', order: 131 },
    { title: 'Risk Governance Structure', order: 132 },
    { title: 'Board Risk Oversight', order: 133 },
    { title: 'Case-Based ERM Exercises 1', order: 134 },
    { title: 'Case-Based ERM Exercises 2', order: 135 },
    { title: 'Case-Based ERM Exercises 3', order: 136 },
  ];

  // Module 8: Exam Practice & Mock Tests - 10 Hours
  const module8Lessons = [
    { title: 'Topic-wise MCQ Practice Set 1', order: 137 },
    { title: 'Topic-wise MCQ Practice Set 2', order: 138 },
    { title: 'Topic-wise MCQ Practice Set 3', order: 139 },
    { title: 'GARP-style Question Solving 1', order: 140 },
    { title: 'GARP-style Question Solving 2', order: 141 },
    { title: 'GARP-style Question Solving 3', order: 142 },
    { title: 'Formula Quick Revision 1', order: 143 },
    { title: 'Formula Quick Revision 2', order: 144 },
    { title: 'Concept Quick Review 1', order: 145 },
    { title: 'Concept Quick Review 2', order: 146 },
  ];

  // Module 9: Final Revision & Exam Strategy - 10 Hours
  const module9Lessons = [
    { title: '30-Day Study Plan', order: 147 },
    { title: '15-Day Intensive Review', order: 148 },
    { title: '7-Day Final Preparation', order: 149 },
    { title: 'Exam-Taking Techniques for Multiple Choice', order: 150 },
    { title: 'Exam-Taking Techniques for Quant Questions', order: 151 },
    { title: 'Time Management Strategies', order: 152 },
    { title: 'Stress Control & Mental Preparation', order: 153 },
    { title: 'FRM Part II CBT Exam Interface Walkthrough', order: 154 },
    { title: 'Last-Minute Tips & Tricks', order: 155 },
    { title: 'Mock Exam Review & Analysis', order: 156 },
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
  ];

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        order: lesson.order,
        courseId: courseId,
        duration: 90, // 90 minutes per lesson
        content: `# ${lesson.title}\n\nThis lesson covers the key concepts and applications of ${lesson.title} in FRM Part II curriculum.\n\n## Learning Objectives\n- Understand advanced risk management concepts\n- Apply quantitative techniques to real-world scenarios\n- Analyze complex risk cases effectively\n\n## Key Topics\n1. Core principles and definitions\n2. Advanced quantitative applications\n3. Case study analysis\n4. Regulatory and practical considerations`,
        videoUrl: `https://cdn.inr99.com/courses/frm_part2/lessons/${lesson.order}/video.mp4`,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${allLessons.length} lessons`);

  // Create assessments for each module
  const assessments = [
    { title: 'Market Risk Assessment', type: 'SCENARIO' as const },
    { title: 'Credit Risk Management Test', type: 'SCENARIO' as const },
    { title: 'Operational & Liquidity Risk Assessment', type: 'SCENARIO' as const },
    { title: 'Portfolio Risk Management Test', type: 'SCENARIO' as const },
    { title: 'Quantitative Risk Models Assessment', type: 'SCENARIO' as const },
    { title: 'Current Issues in Risk Test', type: 'SCENARIO' as const },
    { title: 'ERM Integration Assessment', type: 'SCENARIO' as const },
    { title: 'Exam Practice Test', type: 'SCENARIO' as const },
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
        title: `FRM Part II Mock Exam ${i}`,
        type: 'PRACTICE',
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created 2 mock exams`);

  console.log('\n🎉 FRM Part II course seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
