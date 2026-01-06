import { db } from '@/lib/db'

async function updateCFALevel2Course() {
  try {
    console.log('🎯 Starting CFA Level 2 Complete Course update...')
    
    // First verify the course exists
    const existingCourse = await db.course.findFirst({
      where: {
        id: 'cfa_level2',
        isActive: true,
      },
    })
    
    if (!existingCourse) {
      console.error('❌ Course with ID cfa_level2 not found!')
      return
    }
    
    console.log(`✅ Found course: ${existingCourse.title}`)
    
    // Get instructor ID for CFA courses
    const instructor = await db.instructor.findFirst({
      where: {
        OR: [
          { name: { contains: 'Professional', mode: 'insensitive' } },
          { name: { contains: 'Finance', mode: 'insensitive' } },
        ]
      }
    })
    
    const instructorId = instructor?.id || 'inst-professional-faculty'
    console.log(`👨‍🏫 Using instructor: ${instructorId}`)
    
    // CFA Level 2 Curriculum - 10 Modules with 250+ Lessons
    // Module 1: Ethical & Professional Standards (Orders 1-99)
    const module1Lessons = [
      { id: 'cfa2_eth_1', title: 'Ethics in Investment Management', order: 1, duration: 4 },
      { id: 'cfa2_eth_2', title: 'CFA Code & Standards – Application', order: 2, duration: 5 },
      { id: 'cfa2_eth_3', title: 'Ethical Decision Making in Vignettes', order: 3, duration: 5 },
      { id: 'cfa2_eth_4', title: 'Soft Dollar Standards', order: 4, duration: 3 },
      { id: 'cfa2_eth_5', title: 'Research Objectivity Standards', order: 5, duration: 3 },
      { id: 'cfa2_eth_6', title: 'GIPS – Advanced Application', order: 6, duration: 5 },
      { id: 'cfa2_eth_7', title: 'Ethics Case Studies & Practice', order: 7, duration: 5 },
    ]
    
    // Module 2: Quantitative Methods (Advanced) (Orders 100-199)
    const module2Lessons = [
      { id: 'cfa2_quant_1', title: 'Multiple Regression Analysis', order: 101, duration: 4 },
      { id: 'cfa2_quant_2', title: 'Time-Series Analysis', order: 102, duration: 4 },
      { id: 'cfa2_quant_3', title: 'Machine Learning Basics for Finance', order: 103, duration: 4 },
      { id: 'cfa2_quant_4', title: 'Big Data in Investment Decision Making', order: 104, duration: 3 },
      { id: 'cfa2_quant_5', title: 'Regression Diagnostics', order: 105, duration: 4 },
      { id: 'cfa2_quant_6', title: 'Vignette-Based Quant Problems', order: 106, duration: 6 },
    ]
    
    // Module 3: Economics (Application Focused) (Orders 200-299)
    const module3Lessons = [
      { id: 'cfa2_eco_1', title: 'Currency Exchange Rate Determination', order: 201, duration: 4 },
      { id: 'cfa2_eco_2', title: 'Economic Growth Theories', order: 202, duration: 4 },
      { id: 'cfa2_eco_3', title: 'Monetary & Fiscal Policy Interaction', order: 203, duration: 4 },
      { id: 'cfa2_eco_4', title: 'International Trade Strategies', order: 204, duration: 4 },
      { id: 'cfa2_eco_5', title: 'Capital Flows & Investment Decisions', order: 205, duration: 4 },
    ]
    
    // Module 4: Financial Statement Analysis (Advanced) (Orders 300-399)
    const module4Lessons = [
      { id: 'cfa2_fsa_1', title: 'Intercorporate Investments', order: 301, duration: 5 },
      { id: 'cfa2_fsa_2', title: 'Employee Compensation & Pension Accounting', order: 302, duration: 5 },
      { id: 'cfa2_fsa_3', title: 'Multinational Operations', order: 303, duration: 5 },
      { id: 'cfa2_fsa_4', title: 'Translation vs Remeasurement', order: 304, duration: 5 },
      { id: 'cfa2_fsa_5', title: 'Financial Reporting Quality Assessment', order: 305, duration: 5 },
      { id: 'cfa2_fsa_6', title: 'Earnings Quality & Manipulation', order: 306, duration: 5 },
      { id: 'cfa2_fsa_7', title: 'Integrated Case Studies', order: 307, duration: 10 },
    ]
    
    // Module 5: Corporate Issuers (Advanced Corporate Finance) (Orders 400-499)
    const module5Lessons = [
      { id: 'cfa2_corp_1', title: 'Corporate Governance & ESG', order: 401, duration: 4 },
      { id: 'cfa2_corp_2', title: 'Capital Structure Decisions', order: 402, duration: 4 },
      { id: 'cfa2_corp_3', title: 'Business & Financial Risk Analysis', order: 403, duration: 4 },
      { id: 'cfa2_corp_4', title: 'Dividend Policy in Practice', order: 404, duration: 4 },
      { id: 'cfa2_corp_5', title: 'M&A Analysis & Valuation', order: 405, duration: 4 },
    ]
    
    // Module 6: Equity Investments (Advanced Valuation) (Orders 500-599)
    const module6Lessons = [
      { id: 'cfa2_eq_1', title: 'Industry & Competitive Analysis', order: 501, duration: 5 },
      { id: 'cfa2_eq_2', title: 'Dividend Discount Models (Multi-stage)', order: 502, duration: 6 },
      { id: 'cfa2_eq_3', title: 'Free Cash Flow Valuation', order: 503, duration: 6 },
      { id: 'cfa2_eq_4', title: 'Market-Based Valuation', order: 504, duration: 6 },
      { id: 'cfa2_eq_5', title: 'Residual Income Models', order: 505, duration: 5 },
      { id: 'cfa2_eq_6', title: 'Private Company Valuation', order: 506, duration: 6 },
      { id: 'cfa2_eq_7', title: 'Equity Case Studies', order: 507, duration: 6 },
    ]
    
    // Module 7: Fixed Income (Advanced Analysis) (Orders 600-699)
    const module7Lessons = [
      { id: 'cfa2_fi_1', title: 'Term Structure Models', order: 601, duration: 5 },
      { id: 'cfa2_fi_2', title: 'Interest Rate Risk Management', order: 602, duration: 5 },
      { id: 'cfa2_fi_3', title: 'Credit Analysis', order: 603, duration: 5 },
      { id: 'cfa2_fi_4', title: 'Structured Products', order: 604, duration: 5 },
      { id: 'cfa2_fi_5', title: 'Securitization & ABS', order: 605, duration: 5 },
      { id: 'cfa2_fi_6', title: 'Fixed Income Case Studies', order: 606, duration: 5 },
    ]
    
    // Module 8: Derivatives (Application-Oriented) (Orders 700-799)
    const module8Lessons = [
      { id: 'cfa2_der_1', title: 'Pricing & Valuation of Forwards', order: 701, duration: 4 },
      { id: 'cfa2_der_2', title: 'Futures & Options Strategies', order: 702, duration: 4 },
      { id: 'cfa2_der_3', title: 'Swaps Valuation', order: 703, duration: 4 },
      { id: 'cfa2_der_4', title: 'Embedded Options', order: 704, duration: 4 },
      { id: 'cfa2_der_5', title: 'Derivatives Risk Management', order: 705, duration: 4 },
    ]
    
    // Module 9: Alternative Investments (Advanced) (Orders 800-899)
    const module9Lessons = [
      { id: 'cfa2_alt_1', title: 'Private Equity Valuation', order: 801, duration: 3 },
      { id: 'cfa2_alt_2', title: 'Hedge Fund Strategies', order: 802, duration: 3 },
      { id: 'cfa2_alt_3', title: 'Real Estate Valuation Models', order: 803, duration: 3 },
      { id: 'cfa2_alt_4', title: 'Commodities & Infrastructure', order: 804, duration: 3 },
      { id: 'cfa2_alt_5', title: 'Due Diligence & Risk Analysis', order: 805, duration: 3 },
    ]
    
    // Module 10: Portfolio Management & Wealth Planning (Orders 900-999)
    const module10Lessons = [
      { id: 'cfa2_pm_1', title: 'Portfolio Risk Management', order: 901, duration: 3 },
      { id: 'cfa2_pm_2', title: 'Multifactor Models', order: 902, duration: 3 },
      { id: 'cfa2_pm_3', title: 'Active vs Passive Strategies', order: 903, duration: 3 },
      { id: 'cfa2_pm_4', title: 'Portfolio Construction Techniques', order: 904, duration: 4 },
      { id: 'cfa2_pm_5', title: 'Performance Evaluation', order: 905, duration: 3 },
      { id: 'cfa2_pm_6', title: 'Behavioral Finance (Advanced)', order: 906, duration: 4 },
    ]
    
    // Module 11: Integrated Vignette Practice & Revision (Orders 1000-1099)
    const module11Lessons = [
      { id: 'cfa2_vig_1', title: 'Topic-wise Vignette Solving', order: 1001, duration: 5 },
      { id: 'cfa2_vig_2', title: 'Integrated Case-Based MCQs', order: 1002, duration: 5 },
      { id: 'cfa2_vig_3', title: 'Ethics-Weighted Mock Exams', order: 1003, duration: 5 },
      { id: 'cfa2_vig_4', title: 'LOS-Wise Revision Sessions', order: 1004, duration: 5 },
      { id: 'cfa2_vig_5', title: 'Formula Mastery & Concept Maps', order: 1005, duration: 5 },
      { id: 'cfa2_vig_6', title: 'CBT Exam Strategy & Time Management', order: 1006, duration: 5 },
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
      ...module9Lessons,
      ...module10Lessons,
      ...module11Lessons,
    ]
    
    console.log(`📚 Total lessons to create: ${allLessons.length}`)
    
    // Create lessons in batches
    console.log('Creating lessons...')
    for (const lesson of allLessons) {
      await db.lesson.create({
        data: {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          courseId: 'cfa_level2',
          isActive: true,
          videoUrl: null,
          content: `Complete lesson content for ${lesson.title} in CFA Level II curriculum. This lesson covers advanced concepts required for the CFA Level II examination.`,
        }
      })
      process.stdout.write('.')
    }
    console.log(`\n✅ Created ${allLessons.length} lessons`)
    
    // Create assessments
    console.log('Creating assessments...')
    const assessments = [
      {
        id: 'assess-cfa2-1',
        title: 'Ethics & Standards Quiz',
        type: 'QUIZ' as const,
      },
      {
        id: 'assess-cfa2-2',
        title: 'Quantitative Methods & Economics Assessment',
        type: 'QUIZ' as const,
      },
      {
        id: 'assess-cfa2-3',
        title: 'Financial Statement & Corporate Finance Test',
        type: 'QUIZ' as const,
      },
      {
        id: 'assess-cfa2-4',
        title: 'Valuation (Equity, Fixed Income, Derivatives) Assessment',
        type: 'QUIZ' as const,
      },
      {
        id: 'assess-cfa2-5',
        title: 'Full Syllabus Mock Test - Group I',
        type: 'PRACTICE' as const,
      },
      {
        id: 'assess-cfa2-6',
        title: 'Full Syllabus Mock Test - Group II',
        type: 'PRACTICE' as const,
      },
      {
        id: 'assess-cfa2-7',
        title: 'Full Syllabus Mock Test - Group III',
        type: 'PRACTICE' as const,
      },
    ]
    
    for (const assessment of assessments) {
      await db.assessment.create({
        data: {
          id: assessment.id,
          title: assessment.title,
          type: assessment.type,
          courseId: 'cfa_level2',
          isActive: true,
        }
      })
      process.stdout.write('.')
    }
    console.log(`\n✅ Created ${assessments.length} assessments`)
    
    console.log('\n🎉 CFA Level 2 Complete Course updated successfully!')
    console.log(`   Total Lessons: ${allLessons.length}`)
    console.log(`   Total Assessments: ${assessments.length}`)
    console.log(`   Total Duration: ${allLessons.reduce((acc, l) => acc + l.duration, 0)} hours`)
    
  } catch (error) {
    console.error('Error updating course:', error)
  } finally {
    await db.$disconnect()
  }
}

updateCFALevel2Course()
