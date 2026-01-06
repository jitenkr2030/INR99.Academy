const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ACCA Level 2 (Applied Skills)...')
  
  const courseId = 'acca_level2'
  
  // ============ PAPER LW: Corporate & Business Law (40 lessons) ============
  const lwLessons = [
    'Introduction to English Legal System',
    'Sources of Law',
    'The Court System',
    'Civil and Criminal Courts',
    'Judicial Precedent',
    'Statutory Interpretation',
    'Introduction to Contract Law',
    'Offer and Acceptance',
    'Consideration',
    'Intention to Create Legal Relations',
    'Capacity to Contract',
    'Genuine Consent',
    'Legality and Public Policy',
    'Terms of the Contract',
    'Vitiating Factors',
    'Discharge of Contract',
    'Remedies for Breach',
    'Introduction to Employment Law',
    'Contract of Employment',
    'Employment Rights',
    'Unfair Dismissal',
    'Discrimination in Employment',
    'Introduction to Company Law',
    'Formation and Registration',
    'Constitution of a Company',
    'Corporate Personality',
    'Company Directors',
    'Company Secretary',
    'Company Meetings',
    'Share Capital and Dividends',
    'Introduction to Corporate Governance',
    'Corporate Governance Codes',
    'Sarbanes-Oxley Overview',
    'Principles of Good Governance',
    'Audit Committee',
    'Introduction to Capital and Financing',
    'Sources of Finance',
    'Raising Share Capital',
    'Debt Financing',
    'Insolvency and Administration',
    'LW Comprehensive Review',
    'LW Practice Questions',
    'LW Mock Exam Preparation'
  ]
  
  // ============ PAPER PM: Performance Management (50 lessons) ============
  const pmLessons = [
    'Introduction to Performance Management',
    'Costing and Budgeting Systems',
    'Activity-Based Costing',
    'Target Costing',
    'Life-Cycle Costing',
    'Throughput Accounting',
    'Environmental Accounting',
    'Introduction to Budgeting',
    'Budgeting Techniques',
    'Behavioural Aspects of Budgeting',
    'Top-Down vs Bottom-Up',
    'Zero-Based Budgeting',
    'Rolling Budgets',
    'Introduction to Standard Costing',
    'Setting Standards',
    'Variance Analysis',
    'Material and Labor Variances',
    'Overhead Variances',
    'Sales Variances',
    'Operating Statements',
    'Introduction to Performance Measurement',
    'Financial Performance Measures',
    'Non-Financial Measures',
    'Balanced Scorecard',
    'Tableau de Bord',
    'Performance Pyramid',
    'Divisional Performance',
    'ROI and RI',
    'Transfer Pricing',
    'Introduction to Decision-Making',
    'Relevant Costing',
    'Opportunity Cost',
    'Make or Buy',
    'Shutdown Decisions',
    'Limiting Factors',
    'Pricing Decisions',
    'Risk and Uncertainty',
    'Expected Values',
    'Decision Trees',
    'Sensitivity Analysis',
    'Simulation Models',
    'PM Comprehensive Review',
    'PM Practice Questions',
    'PM Mock Exam Preparation'
  ]
  
  // ============ PAPER TX: Taxation (55 lessons) ============
  const txLessons = [
    'Introduction to Taxation',
    'Taxes and their Types',
    'Tax Administration',
    'Income Tax Overview',
    'Employment Income',
    'Trading Income',
    'Property Income',
    'Investment Income',
    'Deductions from Total Income',
    'Personal Allowances',
    'Tax Rates and Bands',
    'Computation of Tax',
    'Introduction to Corporation Tax',
    'Trading Income - Companies',
    'Capital Allowances',
    'Trading Losses',
    'Corporation Tax Rates',
    'Introduction to Capital Gains Tax',
    'Disposal and Acquisition',
    'Chattels and Waste',
    'Principal Private Residence',
    'Shares and Securities',
    'Gains and Losses',
    'Introduction to VAT',
    'Registration Requirements',
    'VAT Rates and Schemes',
    'VAT Input and Output',
    'VAT Returns',
    'Introduction to Personal Tax',
    'Self-Assessment System',
    'Filing Deadlines',
    'Payment Dates',
    'Introduction to Business Tax',
    'Business Structures and Tax',
    'Partnership Taxation',
    'Introduction to Tax Planning',
    'Tax Avoidance vs Evasion',
    'Ethical Tax Planning',
    'International Tax Overview',
    'Double Taxation Relief',
    'Transfer Pricing Basics',
    'TX Comprehensive Review',
    'TX Practice Questions',
    'TX Mock Exam Preparation',
    'TX Exam Strategy and Tips'
  ]
  
  // ============ PAPER FR: Financial Reporting (55 lessons) ============
  const frLessons = [
    'Introduction to Financial Reporting',
    'The Conceptual Framework',
    'Purpose of Financial Statements',
    'Qualitative Characteristics',
    'Recognition and Measurement',
    'Regulatory Framework',
    'IAS and IFRS Overview',
    'Presentation of Financial Statements',
    'Statement of Financial Position',
    'Statement of Profit or Loss',
    'Statement of Comprehensive Income',
    'Statement of Changes in Equity',
    'Statement of Cash Flows',
    'Notes to Financial Statements',
    'Accounting Policies',
    'Events After Reporting Date',
    'Provisions and Contingencies',
    'Intangible Assets',
    'Impairment of Assets',
    'Inventories',
    'Financial Instruments',
    'Leases',
    'Employee Benefits',
    'Taxation in Financial Statements',
    'Related Party Disclosures',
    'Introduction to Group Accounts',
    'Subsidiaries and Associates',
    'Non-Controlling Interest',
    'Goodwill on Consolidation',
    'Consolidated Statement of Financial Position',
    'Consolidated Statement of Profit or Loss',
    'Consolidated Statement of Cash Flows',
    'Intercompany Transactions',
    'Intra-Group Balances',
    'Unrealized Profits',
    'Associate Accounting',
    'Introduction to Interpretation',
    'Analysis Techniques',
    'Ratio Analysis',
    'Trend Analysis',
    'Common Size Analysis',
    'Interpretation Issues',
    'FR Comprehensive Review',
    'FR Practice Questions',
    'FR Mock Exam Preparation',
    'FR Exam Strategy and Tips'
  ]
  
  // ============ PAPER AA: Audit & Assurance (45 lessons) ============
  const aaLessons = [
    'Introduction to Audit and Assurance',
    'Nature and Purpose of Audit',
    'Audit vs Investigation',
    'Regulatory Framework',
    'Ethical Principles',
    'Independence and Objectivity',
    'Code of Ethics',
    'Professional Skepticism',
    'Audit Planning',
    'Risk Assessment Process',
    'Understanding the Entity',
    'Internal Control Systems',
    'Control Risk Assessment',
    'Tests of Controls',
    'Audit Evidence',
    'Nature and Timing',
    'Sufficiency and Appropriateness',
    'Confirmations',
    'Inspection and Observation',
    'Analytical Procedures',
    'Audit Sampling',
    'Statistical vs Judgmental',
    'Sample Selection Methods',
    'Computer-Assisted Audit',
    'Introduction to Internal Audit',
    'Role of Internal Audit',
    'Internal Control Evaluation',
    'Audit Documentation',
    'Working Papers',
    'Quality Control',
    'Audit Reports',
    'Unmodified Opinion',
    'Qualified and Disclaimer',
    'Adverse Opinion',
    'Emphasis of Matter',
    'Review Engagements',
    'Other Assurance Services',
    'Introduction to Professional Ethics',
    'Threats to Independence',
    'Safeguards',
    'AA Comprehensive Review',
    'AA Practice Questions',
    'AA Mock Exam Preparation',
    'AA Exam Strategy and Tips'
  ]
  
  // ============ PAPER FM: Financial Management (55 lessons) ============
  const fmLessons = [
    'Introduction to Financial Management',
    'Role of Financial Manager',
    'Objectives of the Firm',
    'Financial Environment',
    'Financial Markets',
    'Introduction to Working Capital',
    'Working Capital Management',
    'Cash Management',
    'Inventory Management',
    'Receivables Management',
    'Payables Management',
    'Working Capital Ratios',
    'Introduction to Investment Appraisal',
    'Payback Period',
    'Accounting Rate of Return',
    'Net Present Value',
    'Internal Rate of Return',
    'Discounted Payback',
    'Capital Rationing',
    'Inflation in Investment',
    'Tax in Investment',
    'Introduction to Business Finance',
    'Sources of Finance',
    'Equity Finance',
    'Debt Finance',
    'Hybrid Finance',
    'Cost of Capital',
    'Cost of Equity',
    'Cost of Debt',
    'Weighted Average Cost of Capital',
    'Capital Structure Theories',
    'Capital Structure Decision',
    'Dividend Policy',
    'Introduction to Risk Management',
    'Foreign Exchange Risk',
    'Interest Rate Risk',
    'Commodity Risk',
    'Hedging Techniques',
    'Forward Contracts',
    'Futures and Options',
    'Swaps',
    'Introduction to Business Valuation',
    'Valuation Methods',
    'DCF Valuation',
    'Earnings Valuation',
    'Asset-Based Valuation',
    'FM Comprehensive Review',
    'FM Practice Questions',
    'FM Mock Exam Preparation',
    'FM Exam Strategy and Tips'
  ]
  
  // Combine all lessons
  const allLessons = [...lwLessons, ...pmLessons, ...txLessons, ...frLessons, ...aaLessons, ...fmLessons]
  
  console.log(`📚 Total lessons for ACCA Level 2: ${allLessons.length}`)
  
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
    
    // Create assessments for all 6 papers
    const assessments = [
      { title: 'LW Paper Assessment', idSuffix: 'lw_assessment' },
      { title: 'PM Paper Assessment', idSuffix: 'pm_assessment' },
      { title: 'TX Paper Assessment', idSuffix: 'tx_assessment' },
      { title: 'FR Paper Assessment', idSuffix: 'fr_assessment' },
      { title: 'AA Paper Assessment', idSuffix: 'aa_assessment' },
      { title: 'FM Paper Assessment', idSuffix: 'fm_assessment' },
      { title: 'ACCA Level 2 Mock Exam', idSuffix: 'level2_mock' },
      { title: 'ACCA Level 2 Comprehensive Exam', idSuffix: 'level2_comprehensive' }
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
    console.log('🎉 ACCA Level 2 seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding ACCA Level 2:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()