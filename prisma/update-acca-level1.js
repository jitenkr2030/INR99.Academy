const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ACCA Level 1 (Applied Knowledge)...')
  
  const courseId = 'acca_level1'
  
  // ============ PAPER BT: Business & Technology (60 lessons) ============
  const btLessons = [
    'Introduction to Business Environment',
    'Types of Business Organizations',
    'Sole Traders and Partnerships',
    'Limited Companies',
    'Other Business Structures',
    'Stakeholders in Business',
    'Stakeholder Analysis and Interests',
    'External Environment Overview',
    'Economic Environment',
    'Political and Legal Environment',
    'Social and Cultural Environment',
    'Technological Environment',
    'Competitive Environment',
    'Introduction to Corporate Governance',
    'Purpose and Principles of Governance',
    'Governance Codes and Frameworks',
    'Board of Directors and Roles',
    'Directors and Officers',
    'Shareholders and Voting Rights',
    'Corporate Governance Issues',
    'Introduction to Business Ethics',
    'Ethical Theories and Approaches',
    'Professional Ethics',
    'Code of Ethics for Accountants',
    'Ethical Decision-Making',
    'Bribery and Corruption',
    'Money Laundering',
    'Introduction to Technology',
    'Information Systems in Business',
    'Components of Information Systems',
    'Database Management Systems',
    'Enterprise Resource Planning (ERP)',
    'E-Commerce and Digital Business',
    'Social Media in Business',
    'Cloud Computing',
    'Big Data and Analytics',
    'Introduction to Data Analytics',
    'Data Collection and Sources',
    'Data Processing and Analysis',
    'Data Visualization',
    'Cyber Security Overview',
    'Cyber Threats and Attacks',
    'Data Protection Regulations',
    'Information Security Controls',
    'Introduction to Leadership',
    'Leadership Styles and Theories',
    'Motivation and Team Building',
    'Communication in Business',
    'Change Management',
    'Introduction to Management',
    'Functions of Management',
    'Organizational Structure',
    'Business Planning and Strategy',
    'BT Comprehensive Review',
    'BT Practice Questions',
    'BT Mock Exam Preparation',
    'BT Exam Strategy and Tips'
  ]
  
  // ============ PAPER MA: Management Accounting (60 lessons) ============
  const maLessons = [
    'Introduction to Management Accounting',
    'Role of Management Accountant',
    'Cost Classification Overview',
    'Direct and Indirect Costs',
    'Fixed and Variable Costs',
    'Prime Cost and Overhead',
    'Cost Behaviour Patterns',
    'Step Costs and Semi-Variable',
    'Introduction to Costing Techniques',
    'Job Costing System',
    'Batch Costing',
    'Contract Costing',
    'Process Costing',
    'Joint Products and By-Products',
    'Service Costing',
    'Introduction to Marginal Costing',
    'Marginal Costing Formula',
    'Contribution Margin Analysis',
    'Absorption Costing Overview',
    'Absorption vs Marginal Costing',
    'Reconciliation of Profits',
    'Introduction to Budgeting',
    'Purposes of Budgeting',
    'Types of Budgets',
    'Fixed and Flexible Budgets',
    'Zero-Based Budgeting',
    'Incremental Budgeting',
    'Rolling Budgets',
    'Budgetary Control',
    'Forecasting Techniques',
    'Introduction to Standard Costing',
    'Standard Cost Calculation',
    'Variance Analysis Basics',
    'Material Variances',
    'Labor Variances',
    'Variable Overhead Variances',
    'Fixed Overhead Variances',
    'Sales Variances',
    'Variance Reporting and Analysis',
    'Introduction to CVP Analysis',
    'Break-Even Analysis',
    'Margin of Safety',
    'Target Profit Analysis',
    'Multi-Product CVP Analysis',
    'Introduction to Performance Measurement',
    'Financial Performance Indicators',
    'Non-Financial Performance Indicators',
    'Balanced Scorecard Overview',
    'Divisional Performance',
    'ROI and RI Analysis',
    'Introduction to Decision-Making',
    'Relevant Cost Analysis',
    'Make or Buy Decisions',
    'Accept or Reject Decisions',
    'Limiting Factor Analysis',
    'Pricing Decisions',
    'MA Comprehensive Review',
    'MA Practice Questions',
    'MA Mock Exam Preparation',
    'MA Exam Strategy and Tips'
  ]
  
  // ============ PAPER FA: Financial Accounting (60 lessons) ============
  const faLessons = [
    'Introduction to Financial Accounting',
    'Accounting Principles and Concepts',
    'Going Concern Assumption',
    'Accruals Concept',
    'Prudence and Consistency',
    'Double Entry System Basics',
    'Ledger Accounts and Posting',
    'Trial Balance Overview',
    'Trial Balance Errors',
    'Suspense Account',
    'Introduction to Financial Statements',
    'Statement of Financial Position',
    'Statement of Profit or Loss',
    'Statement of Changes in Equity',
    'Notes to Financial Statements',
    'Sole Trader Financial Statements',
    'Company Financial Statements',
    'Statement of Cash Flows',
    'Adjustments to Financial Statements',
    'Accruals and Prepayments',
    'Bad Debts and Provisions',
    'Depreciation Methods',
    'Straight Line Depreciation',
    'Reducing Balance Depreciation',
    'Revaluation of Assets',
    'Disposal of Fixed Assets',
    'Inventory Valuation Methods',
    'FIFO and Weighted Average',
    'Inventory Systems',
    'Trade Receivables',
    'Allowance for Doubtful Debts',
    'Trade Payables',
    'Provisions and Contingencies',
    'Share Capital and Reserves',
    'Debentures and Loans',
    'Statement of Cash Flows',
    'Cash Flow Classification',
    'Indirect Method Cash Flow',
    'Direct Method Cash Flow',
    'Interpreting Financial Statements',
    'Ratio Analysis Overview',
    'Profitability Ratios',
    'Liquidity Ratios',
    'Efficiency Ratios',
    'Investment Ratios',
    'Introduction to Group Accounts',
    'Subsidiary Undertaking',
    'Non-Controlling Interest',
    'Consolidated Statement of Financial Position',
    'Consolidated Statement of Profit or Loss',
    'FA Comprehensive Review',
    'FA Practice Questions',
    'FA Mock Exam Preparation',
    'FA Exam Strategy and Tips'
  ]
  
  // Combine all lessons
  const allLessons = [...btLessons, ...maLessons, ...faLessons]
  
  console.log(`📚 Total lessons for ACCA Level 1: ${allLessons.length}`)
  
  try {
    // Prepare all lessons for batch creation
    const lessonsToCreate = allLessons.map((title, i) => ({
      id: `${courseId}_lesson_${i + 1}`,
      title: title,
      content: `Complete lesson content for: ${title}`,
      duration: 30,
      order: i + 1,
      isActive: true,
      courseId: courseId
    }))
    
    // Create all lessons in a single batch operation
    await prisma.lesson.createMany({
      data: lessonsToCreate
    })
    
    console.log(`✅ Created ${allLessons.length} lessons`)
    
    // Create assessments
    const assessments = [
      { title: 'BT Paper Assessment', idSuffix: 'bt_assessment' },
      { title: 'MA Paper Assessment', idSuffix: 'ma_assessment' },
      { title: 'FA Paper Assessment', idSuffix: 'fa_assessment' },
      { title: 'ACCA Level 1 Mock Exam', idSuffix: 'level1_mock' }
    ]
    
    for (const assessment of assessments) {
      await prisma.assessment.create({
        data: {
          id: `${courseId}_${assessment.idSuffix}`,
          title: assessment.title,
          type: 'PRACTICE',
          isActive: true,
          courseId: courseId
        }
      })
    }
    
    console.log(`✅ Created ${assessments.length} assessments`)
    console.log('🎉 ACCA Level 1 seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding ACCA Level 1:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()