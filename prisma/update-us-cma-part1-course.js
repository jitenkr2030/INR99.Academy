const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding US CMA Part 1 Complete Course...\n');

  const courseId = 'us_cma_part1';

  // Module 1: External Financial Reporting Decisions (25 Hours)
  const module1Lessons = [
    { title: 'Financial Statement Concepts & Standards', order: 1 },
    { title: 'Income Statement Analysis', order: 2 },
    { title: 'Balance Sheet Analysis', order: 3 },
    { title: 'Cash Flow Statement Analysis', order: 4 },
    { title: 'Revenue Recognition Principles', order: 5 },
    { title: 'Revenue Measurement Techniques', order: 6 },
    { title: 'Expense Recognition Concepts', order: 7 },
    { title: 'Inventory Valuation Methods', order: 8 },
    { title: 'Financial Statement Adjustments', order: 9 },
    { title: 'IFRS vs US GAAP Comparison', order: 10 },
    { title: 'Financial Statement Analysis Framework', order: 11 },
    { title: 'Case-Based Financial Statement Analysis 1', order: 12 },
    { title: 'Case-Based Financial Statement Analysis 2', order: 13 },
    { title: 'Practice Questions - Module 1', order: 14 },
    { title: 'Quick Revision - Module 1', order: 15 },
  ];

  // Module 2: Planning, Budgeting, and Forecasting (35 Hours)
  const module2Lessons = [
    { title: 'Strategic Planning Process Overview', order: 16 },
    { title: 'Mission, Vision & Objectives', order: 17 },
    { title: 'SWOT & Environmental Analysis', order: 18 },
    { title: 'Strategy Formulation & Implementation', order: 19 },
    { title: 'Annual Operating Plans', order: 20 },
    { title: 'Budgeting Methodologies Overview', order: 21 },
    { title: 'Static Budgeting', order: 22 },
    { title: 'Flexible Budgeting', order: 23 },
    { title: 'Zero-Based Budgeting (ZBB)', order: 24 },
    { title: 'Activity-Based Budgeting', order: 25 },
    { title: 'Forecasting Techniques & Models', order: 26 },
    { title: 'Regression Analysis in Forecasting', order: 27 },
    { title: 'Time Series Forecasting', order: 28 },
    { title: 'Rolling Forecasts', order: 29 },
    { title: 'Budgeting for Service Organizations', order: 30 },
    { title: 'Budgeting for Manufacturing', order: 31 },
    { title: 'Variance Analysis Basics', order: 32 },
    { title: 'Flexible Budget Variances', order: 33 },
    { title: 'Sales Variances', order: 34 },
    { title: 'Direct Cost Variances', order: 35 },
    { title: 'Indirect Cost Variances', order: 36 },
    { title: 'Performance Monitoring & Reporting', order: 37 },
    { title: 'Case-Based Budgeting Exercises 1', order: 38 },
    { title: 'Case-Based Budgeting Exercises 2', order: 39 },
    { title: 'Practice Questions - Module 2', order: 40 },
    { title: 'Quick Revision - Module 2', order: 41 },
  ];

  // Module 3: Performance Management (30 Hours)
  const module3Lessons = [
    { title: 'Cost-Volume-Profit (CVP) Analysis Basics', order: 42 },
    { title: 'Contribution Margin Analysis', order: 43 },
    { title: 'Break-Even Analysis', order: 44 },
    { title: 'Target Profit Analysis', order: 45 },
    { title: 'Operating Leverage', order: 46 },
    { title: 'Responsibility Accounting Concepts', order: 47 },
    { title: 'Cost Centers, Profit Centers & Investment Centers', order: 48 },
    { title: 'Transfer Pricing', order: 49 },
    { title: 'Performance Metrics & KPIs', order: 50 },
    { title: 'Balanced Scorecard Overview', order: 51 },
    { title: 'Financial Perspective', order: 52 },
    { title: 'Customer Perspective', order: 53 },
    { title: 'Internal Process Perspective', order: 54 },
    { title: 'Learning & Growth Perspective', order: 55 },
    { title: 'Benchmarking Fundamentals', order: 56 },
    { title: 'Competitive Benchmarking', order: 57 },
    { title: 'Internal Benchmarking', order: 58 },
    { title: 'Variance Analysis in Performance', order: 59 },
    { title: 'Management Performance Evaluation', order: 60 },
    { title: 'Business Performance Evaluation', order: 61 },
    { title: 'Case-Based Performance Exercises 1', order: 62 },
    { title: 'Case-Based Performance Exercises 2', order: 63 },
    { title: 'Practice Questions - Module 3', order: 64 },
    { title: 'Quick Revision - Module 3', order: 65 },
  ];

  // Module 4: Cost Management (25 Hours)
  const module4Lessons = [
    { title: 'Cost Concepts & Classifications', order: 66 },
    { title: 'Direct vs Indirect Costs', order: 67 },
    { title: 'Fixed vs Variable Costs', order: 68 },
    { title: 'Product vs Period Costs', order: 69 },
    { title: 'Activity-Based Costing (ABC) Overview', order: 70 },
    { title: 'ABC Cost Pools & Drivers', order: 71 },
    { title: 'Implementing ABC', order: 72 },
    { title: 'ABC in Service Organizations', order: 73 },
    { title: 'Job Order Costing System', order: 74 },
    { title: 'Process Costing System', order: 75 },
    { title: 'Target Costing Overview', order: 76 },
    { title: 'Target Costing Implementation', order: 77 },
    { title: 'Lifecycle Costing', order: 78 },
    { title: 'Cost Allocation Methods', order: 79 },
    { title: 'Joint Products & By-Products', order: 80 },
    { title: 'Overhead Allocation', order: 81 },
    { title: 'Cost Control Techniques', order: 82 },
    { title: 'Lean Accounting', order: 83 },
    { title: 'Kaizen Costing', order: 84 },
    { title: 'Case-Based Cost Analysis 1', order: 85 },
    { title: 'Case-Based Cost Analysis 2', order: 86 },
    { title: 'Practice Questions - Module 4', order: 87 },
    { title: 'Quick Revision - Module 4', order: 88 },
  ];

  // Module 5: Internal Controls (20 Hours)
  const module5Lessons = [
    { title: 'Governance & Control Environment', order: 89 },
    { title: 'Control Environment Components', order: 90 },
    { title: 'Risk Assessment Process', order: 91 },
    { title: 'Control Activities & Procedures', order: 92 },
    { title: 'Information & Communication', order: 93 },
    { title: 'Monitoring & Continuous Improvement', order: 94 },
    { title: 'Internal Audit Functions', order: 95 },
    { title: 'Types of Audits', order: 96 },
    { title: 'Internal Audit Process', order: 97 },
    { title: 'Technology & Control Automation', order: 98 },
    { title: 'ERP Systems & Controls', order: 99 },
    { title: 'Cybersecurity Considerations', order: 100 },
    { title: 'Fraud Risk Management', order: 101 },
    { title: 'Fraud Detection Techniques', order: 102 },
    { title: 'COSO Framework', order: 103 },
    { title: 'SOX Compliance Overview', order: 104 },
    { title: 'Case Studies & Practical Exercises 1', order: 105 },
    { title: 'Case Studies & Practical Exercises 2', order: 106 },
    { title: 'Practice Questions - Module 5', order: 107 },
    { title: 'Quick Revision - Module 5', order: 108 },
  ];

  // Module 6: Technology and Analytics in Finance (15 Hours)
  const module6Lessons = [
    { title: 'Finance Automation Overview', order: 109 },
    { title: 'ERP Systems Implementation', order: 110 },
    { title: 'Cloud Computing in Finance', order: 111 },
    { title: 'Data Analytics for Decision-Making', order: 112 },
    { title: 'Descriptive Analytics', order: 113 },
    { title: 'Diagnostic Analytics', order: 114 },
    { title: 'Predictive Analytics', order: 115 },
    { title: 'Prescriptive Analytics', order: 116 },
    { title: 'Big Data in Finance', order: 117 },
    { title: 'Data Visualization Tools', order: 118 },
    { title: 'Dashboard Design & Implementation', order: 119 },
    { title: 'Reporting Tools & Techniques', order: 120 },
    { title: 'Case-Based Analytics Exercises', order: 121 },
    { title: 'Practice Questions - Module 6', order: 122 },
    { title: 'Quick Revision - Module 6', order: 123 },
  ];

  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
  ];

  // Create all lessons
  for (const lesson of allLessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        order: lesson.order,
        courseId: courseId,
        duration: 90, // 90 minutes per lesson
        content: `# ${lesson.title}\n\nThis lesson covers the key concepts and applications of ${lesson.title} in US CMA Part 1 curriculum.\n\n## Learning Objectives\n- Understand the fundamental concepts\n- Apply frameworks to real-world scenarios\n- Analyze case studies effectively\n\n## Key Topics\n1. Core principles and definitions\n2. Practical applications\n3. Integration with other topics\n4. Exam-focused practice`,
        videoUrl: `https://cdn.inr99.com/courses/us_cma_part1/lessons/${lesson.order}/video.mp4`,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${allLessons.length} lessons`);

  // Create assessments for each module
  const assessments = [
    { title: 'External Financial Reporting Assessment', type: 'SCENARIO' },
    { title: 'Planning, Budgeting & Forecasting Test', type: 'SCENARIO' },
    { title: 'Performance Management Assessment', type: 'SCENARIO' },
    { title: 'Cost Management Test', type: 'SCENARIO' },
    { title: 'Internal Controls Assessment', type: 'SCENARIO' },
    { title: 'Technology & Analytics Test', type: 'SCENARIO' },
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
        title: `US CMA Part 1 Mock Exam ${i}`,
        type: 'PRACTICE',
        courseId: courseId,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created 2 mock exams`);

  console.log('\n🎉 US CMA Part 1 course seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
