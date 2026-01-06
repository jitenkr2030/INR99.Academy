import { db } from '@/lib/db'

async function updateCMAFinalCourse() {
  console.log('🌱 Starting CMA Final course update...')

  // Find the CMA Final course
  const course = await db.course.findFirst({
    where: {
      OR: [
        { id: 'cma_final' },
        { title: { contains: 'CMA Final', mode: 'insensitive' } }
      ]
    }
  })

  if (!course) {
    console.log('❌ CMA Final course not found in database')
    console.log('Available courses with CMA:')
    const cmaCourses = await db.course.findMany({
      where: {
        OR: [
          { id: { contains: 'cma', mode: 'insensitive' } },
          { title: { contains: 'CMA', mode: 'insensitive' } }
        ]
      },
      select: { id: true, title: true }
    })
    console.log(JSON.stringify(cmaCourses, null, 2))
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

  // CMA Final Instructor - using the same instructor pattern
  const instructor = await db.instructor.findFirst({
    where: { id: 'inst-ca-faculty' }
  })
  
  if (!instructor) {
    console.log('❌ Instructor not found')
    return
  }

  // Define lessons for CMA Final (8 modules, Papers 13-19 + Exam Prep)
  const lessons = [
    // Module 1: Corporate & Economic Laws (Paper 13) - 16 Hours - Orders 1-99
    { title: 'Company Law – Advanced Provisions', duration: 180, order: 1, content: 'Advanced provisions of Companies Act 2013 including board composition, meetings, resolutions, and corporate governance requirements.' },
    { title: 'SEBI Regulations', duration: 180, order: 2, content: 'Comprehensive study of SEBI regulations including LODR, ICDR, SBEB, and insider trading regulations.' },
    { title: 'FEMA & Foreign Exchange Laws', duration: 180, order: 3, content: 'Foreign Exchange Management Act, current and capital account transactions, and foreign investment regulations.' },
    { title: 'Competition Law', duration: 150, order: 4, content: 'Competition Act 2002, anti-competitive agreements, abuse of dominant position, and CCI regulations.' },
    { title: 'Economic & Business Laws', duration: 180, order: 5, content: 'Various economic laws including Insolvency and Bankruptcy Code, LLP Act, and sectoral regulations.' },
    { title: 'Legal Case Studies', duration: 150, order: 6, content: 'Analysis of important judicial decisions and their implications for corporate compliance and governance.' },
    
    // Module 2: Strategic Financial Management (Paper 14) - 22 Hours - Orders 100-199
    { title: 'Financial Strategy & Policy', duration: 180, order: 101, content: 'Strategic financial planning, policy framework, and alignment of financial goals with corporate strategy.' },
    { title: 'Advanced Capital Budgeting', duration: 200, order: 102, content: 'Sophisticated capital budgeting techniques including real options,NPV analysis under uncertainty, and project risk assessment.' },
    { title: 'Mergers, Acquisitions & Restructuring', duration: 220, order: 103, content: 'M&A strategies, due diligence, valuation methods, integration planning, and corporate restructuring techniques.' },
    { title: 'Business Valuation', duration: 200, order: 104, content: 'Advanced valuation methodologies including DCF, relative valuation, LBO models, and valuation for different scenarios.' },
    { title: 'Risk Management & Derivatives', duration: 200, order: 105, content: 'Financial risk identification, measurement, hedging strategies using forwards, futures, options, and swaps.' },
    { title: 'International Financial Management', duration: 180, order: 106, content: 'Foreign exchange risk management, international capital budgeting, and cross-border financing strategies.' },
    { title: 'Integrated Case Studies', duration: 200, order: 107, content: 'Comprehensive case-based problems integrating all SFM concepts for practical application.' },
    
    // Module 3: Direct Tax Laws & International Taxation (Paper 15) - 22 Hours - Orders 200-299
    { title: 'Advanced Income Tax Provisions', duration: 200, order: 201, content: 'Complex income tax provisions including MAT, AMT, corporate tax calculations, and advanced deductions.' },
    { title: 'Corporate Tax Planning', duration: 220, order: 202, content: 'Tax planning strategies for corporates including domestic and international tax optimization techniques.' },
    { title: 'Transfer Pricing', duration: 200, order: 203, content: 'Transfer pricing regulations, arm\'s length price determination methods, and international compliance requirements.' },
    { title: 'International Taxation', duration: 180, order: 204, content: 'Taxation of cross-border transactions, foreign income, and tax implications of global operations.' },
    { title: 'DTAA & Tax Treaties', duration: 150, order: 205, content: 'Double taxation avoidance agreements, treaty benefits, and their interpretation and application.' },
    { title: 'Assessment, Appeals & Case Laws', duration: 200, order: 206, content: 'Tax assessment procedures, appellate remedies, and analysis of significant court judgments.' },
    
    // Module 4: Indirect Tax Laws & Practice (Paper 16) - 18 Hours - Orders 300-399
    { title: 'Advanced GST Provisions', duration: 180, order: 301, content: 'Complex GST provisions including composition scheme, mixed supply, composite supply, and zero-rated supplies.' },
    { title: 'ITC, Refunds & Valuation', duration: 180, order: 302, content: 'Input tax credit rules, refund mechanisms, and valuation principles under GST law.' },
    { title: 'Assessment, Audit & Anti-Evasion', duration: 180, order: 303, content: 'GST assessment procedures, audit requirements, anti-evasion measures, and penalty provisions.' },
    { title: 'Customs Act – Advanced Concepts', duration: 180, order: 304, content: 'Advanced customs concepts including classification, valuation, duty drawback, and export-import procedures.' },
    { title: 'Practical Compliance & Case Studies', duration: 180, order: 305, content: 'Practical GST and customs compliance scenarios with real-world case studies and problem-solving.' },
    
    // Module 5: Strategic Cost Management – Decision Making (Paper 17) - 24 Hours - Orders 400-499
    { title: 'Strategic Cost Management Concepts', duration: 200, order: 401, content: 'Strategic cost management frameworks, value chain analysis, and cost leadership strategies.' },
    { title: 'Lean Management & Six Sigma', duration: 200, order: 402, content: 'Lean principles, waste elimination techniques, and Six Sigma methodology for process improvement.' },
    { title: 'Target Costing & Life Cycle Costing', duration: 200, order: 403, content: 'Target costing methodology, product life cycle costing, and cross-functional cost management.' },
    { title: 'Transfer Pricing (Costing Perspective)', duration: 180, order: 404, content: 'Transfer pricing from cost management perspective including inter-divisional pricing and profit allocation.' },
    { title: 'Performance Measurement Systems', duration: 200, order: 405, content: 'Balanced scorecard, EVA, and other advanced performance measurement and management techniques.' },
    { title: 'Strategic Decision-Making Models', duration: 200, order: 406, content: 'Advanced decision models including CVP analysis under uncertainty, make-or-buy, and special order decisions.' },
    
    // Module 6: Corporate Financial Reporting (Paper 18) - 20 Hours - Orders 500-599
    { title: 'IND AS – Advanced Applications', duration: 200, order: 501, content: 'Advanced Indian Accounting Standards including revenue recognition, leases, and financial instruments.' },
    { title: 'Consolidated Financial Statements', duration: 200, order: 502, content: 'Preparation of consolidated financial statements, treatment of goodwill, NCI, and inter-company transactions.' },
    { title: 'Financial Instruments', duration: 180, order: 503, content: 'Accounting for financial assets, liabilities, equity instruments, and hedge accounting under IND AS.' },
    { title: 'Share-based Payments & Leases', duration: 180, order: 504, content: 'Accounting for share-based payments and comprehensive lease accounting under IND AS 116.' },
    { title: 'Valuation Techniques', duration: 150, order: 505, content: 'Business valuation approaches for financial reporting and investment decision purposes.' },
    { title: 'Integrated Reporting', duration: 150, order: 506, content: 'Integrated reporting framework, value creation, and corporate reporting sustainability.' },
    
    // Module 7: Cost & Management Audit (Paper 19) - 20 Hours - Orders 600-699
    { title: 'Cost Audit – Concepts & Framework', duration: 180, order: 601, content: 'Cost audit concepts, framework, objectives, and regulatory requirements under Companies Act.' },
    { title: 'Cost Audit Standards & Procedures', duration: 180, order: 602, content: 'Cost audit standards, documentation requirements, audit procedures, and reporting obligations.' },
    { title: 'Management Audit', duration: 180, order: 603, content: 'Management audit methodology, evaluation of management systems, and performance assessment.' },
    { title: 'Performance & Efficiency Audit', duration: 180, order: 604, content: 'Performance auditing techniques, efficiency measurement, and productivity improvement assessment.' },
    { title: 'Reporting & Certification', duration: 150, order: 605, content: 'Cost audit report preparation, certification requirements, and statutory compliance reporting.' },
    { title: 'Case Studies & Practical Scenarios', duration: 180, order: 606, content: 'Real-world cost audit and management audit case studies with practical problem-solving.' },
    
    // Module 8: Exam Mastery, Case Writing & Professional Readiness - Orders 700-799
    { title: 'ICMAI Study Material & Case Digest Coverage', duration: 180, order: 701, content: 'Comprehensive coverage of ICMAI study material and analysis of important case digests.' },
    { title: 'RTP, MTP & Past Year Question Analysis', duration: 200, order: 702, content: 'Analysis of Revision Test Papers, Mock Test Papers, and previous year examination questions.' },
    { title: 'Case-study & Scenario Answer Writing', duration: 220, order: 703, content: 'Techniques for writing professional case-study answers and scenario-based responses.' },
    { title: 'Numerical Speed & Accuracy Training', duration: 200, order: 704, content: 'Practice sessions for improving speed and accuracy in solving numerical problems.' },
    { title: 'Open-Book & Case-based Exam Strategy', duration: 180, order: 705, content: 'Strategies for open-book examinations and case-based questions in CMA Final.' },
    { title: '90/60/30 Day Revision Plans', duration: 200, order: 706, content: 'Structured revision plans for 90, 60, and 30 days before the examination.' },
  ]

  // Create lessons
  console.log(`📝 Creating ${lessons.length} lessons across 8 modules...`)
  
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
      title: 'Module 1-4: Group III Comprehensive Test',
      type: 'PRACTICE' as const,
    },
    {
      title: 'Module 5-7: Group IV Comprehensive Test',
      type: 'PRACTICE' as const,
    },
    {
      title: 'Full Syllabus Mock Test - Group III',
      type: 'PRACTICE' as const,
    },
    {
      title: 'Full Syllabus Mock Test - Group IV',
      type: 'PRACTICE' as const,
    },
    {
      title: 'CMA Final Grand Mock Test',
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
  const remainingMinutes = totalMinutes % 60

  console.log(`
============================================================
🎉 CMA Final Complete Course updated successfully!
============================================================
📖 Course: ${course.title}
📁 Course ID: ${course.id}
📊 Structure Summary:
   📚 Total Modules: 8 (Papers 13-19 + Exam Prep)
   📝 Total Lessons: ${lessons.length}
   ⏱️ Total Duration: ${totalHours}h ${remainingMinutes}m
   📝 Total Assessments: ${assessments.length}
📚 Modules Breakdown:
   1. Corporate & Economic Laws (Paper 13) - 6 lessons
   2. Strategic Financial Management (Paper 14) - 7 lessons
   3. Direct Tax Laws & International Taxation (Paper 15) - 6 lessons
   4. Indirect Tax Laws & Practice (Paper 16) - 5 lessons
   5. Strategic Cost Management – Decision Making (Paper 17) - 6 lessons
   6. Corporate Financial Reporting (Paper 18) - 6 lessons
   7. Cost & Management Audit (Paper 19) - 6 lessons
   8. Exam Mastery, Case Writing & Professional Readiness - 6 lessons
✅ Ready to publish!
`)
}

updateCMAFinalCourse()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
