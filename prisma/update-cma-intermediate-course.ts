import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(' 🌱 Starting CMA Intermediate course update...')

  const courseId = 'cma_intermediate'
  const categoryId = 'cat_cma' // CMA courses category

  // Check if category exists
  let category = await prisma.category.findFirst({
    where: { id: categoryId }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        id: categoryId,
        name: 'CMA (Cost & Management Accountant)',
        slug: 'cma-cost-management-accountant',
        description: 'Complete CMA courses for ICMAI exams'
      }
    })
    console.log('✅ Created CMA category')
  }

  // Cleanup existing course data
  console.log('🧹 Cleaning up existing CMA Intermediate lessons...')
  await prisma.assessment.deleteMany({ where: { courseId: courseId } })
  await prisma.lesson.deleteMany({ where: { courseId: courseId } })
  console.log('✅ Cleanup complete')

  // Verify course exists
  let course = await prisma.course.findFirst({
    where: { id: courseId }
  })

  if (!course) {
    course = await prisma.course.create({
      data: {
        id: courseId,
        title: 'CMA Intermediate Complete Course',
        description: 'Comprehensive, exam-oriented preparation for the CMA Intermediate Examination covering both Group I and Group II with strong emphasis on costing, accounting, taxation, law, and management decision-making.',
        difficulty: 'ADVANCED',
        thumbnail: '/assets/courses/cma-intermediate.svg',
        isActive: true,
        categoryId: categoryId,
        instructorId: 'inst-ca-faculty'
      }
    })
    console.log('✅ Course created:', course.title)
  } else {
    // Update course description
    await prisma.course.update({
      where: { id: courseId },
      data: {
        description: 'Comprehensive, exam-oriented preparation for the CMA Intermediate Examination covering both Group I and Group II with strong emphasis on costing, accounting, taxation, law, and management decision-making.'
      }
    })
    console.log('✅ Course found:', course.title)
  }

  // Define lessons with order numbers for module grouping
  const lessonsData = [
    // Module 1: Financial Accounting (Group I – Paper 1) - Orders 1-99
    { title: 'Accounting Standards – Application', duration: 150, order: 1 },
    { title: 'Advanced Journal Entries', duration: 160, order: 2 },
    { title: 'Branch & Consignment Accounting', duration: 150, order: 3 },
    { title: 'Accounting for Hire Purchase & Installments', duration: 150, order: 4 },
    { title: 'Partnership Accounts', duration: 160, order: 5 },
    { title: 'Company Accounts – Issue & Redemption', duration: 170, order: 6 },
    { title: 'Final Accounts with Adjustments', duration: 160, order: 7 },
    { title: 'Practical ICAI-style Questions', duration: 160, order: 8 },

    // Module 2: Laws, Ethics & Governance (Group I – Paper 2) - Orders 100-199
    { title: 'Company Law – Key Provisions', duration: 140, order: 101 },
    { title: 'Contract Act – Advanced Application', duration: 140, order: 102 },
    { title: 'Industrial & Labour Laws', duration: 150, order: 103 },
    { title: 'Business Ethics', duration: 120, order: 104 },
    { title: 'Corporate Governance Framework', duration: 130, order: 105 },
    { title: 'Case Studies & Legal Applications', duration: 140, order: 106 },

    // Module 3: Direct Taxation (Group I – Paper 3) - Orders 200-299
    { title: 'Basic Concepts & Residential Status', duration: 130, order: 201 },
    { title: 'Heads of Income', duration: 150, order: 202 },
    { title: 'Computation of Total Income', duration: 160, order: 203 },
    { title: 'Deductions & Exemptions', duration: 140, order: 204 },
    { title: 'Tax Planning Basics', duration: 130, order: 205 },
    { title: 'Practical Problems & Case Studies', duration: 150, order: 206 },

    // Module 4: Cost Accounting (Group I – Paper 4) - Orders 300-399
    { title: 'Cost Concepts & Cost Sheet', duration: 140, order: 301 },
    { title: 'Material, Labour & Overheads', duration: 170, order: 302 },
    { title: 'Marginal Costing', duration: 150, order: 303 },
    { title: 'Budgetary Control', duration: 150, order: 304 },
    { title: 'Standard Costing', duration: 150, order: 305 },
    { title: 'Cost Reconciliation', duration: 130, order: 306 },
    { title: 'Decision-Making Techniques', duration: 140, order: 307 },

    // Module 5: Operations Management & Strategic Management (Group II – Paper 5) - Orders 400-499
    { title: 'Production & Operations Management', duration: 150, order: 401 },
    { title: 'Supply Chain Management', duration: 140, order: 402 },
    { title: 'Quality Management', duration: 130, order: 403 },
    { title: 'Strategic Analysis', duration: 140, order: 404 },
    { title: 'Competitive Strategies', duration: 130, order: 405 },
    { title: 'Business Policy & Case Studies', duration: 150, order: 406 },

    // Module 6: Corporate Accounting & Auditing (Group II – Paper 6) - Orders 500-599
    { title: 'Corporate Accounting – Advanced', duration: 150, order: 501 },
    { title: 'Consolidated Financial Statements (Basics)', duration: 140, order: 502 },
    { title: 'Audit Concepts & Standards', duration: 140, order: 503 },
    { title: 'Internal Control & Internal Audit', duration: 130, order: 504 },
    { title: 'Company Audit Procedures', duration: 140, order: 505 },
    { title: 'Practical Case Studies', duration: 140, order: 506 },

    // Module 7: Financial Management (Group II – Paper 7) - Orders 600-699
    { title: 'Financial Management Overview', duration: 120, order: 601 },
    { title: 'Time Value of Money', duration: 130, order: 602 },
    { title: 'Capital Budgeting', duration: 150, order: 603 },
    { title: 'Cost of Capital', duration: 140, order: 604 },
    { title: 'Working Capital Management', duration: 140, order: 605 },
    { title: 'Leverage & Risk Analysis', duration: 130, order: 606 },

    // Module 8: Exam Preparation & Revision - Orders 700-799
    { title: 'ICMAI Study Material Coverage', duration: 120, order: 701 },
    { title: 'RTP, MTP & Past Year Question Analysis', duration: 130, order: 702 },
    { title: 'Full-Length Mock Tests (Group-wise)', duration: 140, order: 703 },
    { title: '60-30-15 Day Revision Plans', duration: 120, order: 704 },
    { title: 'Exam Writing Strategy & Time Management', duration: 110, order: 705 },
  ]

  console.log('📝 Creating 59 lessons across 8 modules...')

  for (const lessonData of lessonsData) {
    await prisma.lesson.create({
      data: {
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        courseId: courseId,
        isActive: true,
        content: `Content for ${lessonData.title}`
      }
    })
    console.log(`✅ Lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Create assessments
  console.log('📊 Creating assessments...')
  await prisma.assessment.create({
    data: {
      title: 'Group I: Financial Accounting & Cost Accounting Mock Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Group I: Laws, Ethics & Direct Taxation Assessment',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Group II: Operations & Corporate Management Quiz',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Group II: Accounting, Auditing & Financial Management Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'CMA Intermediate Complete Mock Test',
      type: 'PRACTICE',
      courseId: courseId
    }
  })
  console.log('✅ Assessments created')

  // Update course duration
  const totalDuration = lessonsData.reduce((sum, lesson) => sum + lesson.duration, 0)
  await prisma.course.update({
    where: { id: courseId },
    data: { duration: totalDuration }
  })

  console.log('============================================================')
  console.log('🎉 CMA Intermediate Complete Course updated successfully!')
  console.log('============================================================')
  console.log('📖 Course: CMA Intermediate Complete Course')
  console.log('📁 Course ID:', courseId)
  console.log('📊 Structure Summary:')
  console.log('   📚 Total Modules: 8 (Both Groups)')
  console.log('   📝 Total Lessons:', lessonsData.length)
  console.log('   ⏱️ Total Duration:', totalDuration, 'minutes (', Math.round(totalDuration / 60), 'hours)')
  console.log('   📝 Total Assessments: 5')
  console.log('📚 Modules Breakdown:')
  console.log('   1. Financial Accounting (8 lessons, 17h)')
  console.log('   2. Laws, Ethics & Governance (6 lessons, 14h)')
  console.log('   3. Direct Taxation (6 lessons, 15h)')
  console.log('   4. Cost Accounting (7 lessons, 16h)')
  console.log('   5. Operations & Strategic Management (6 lessons, 14h)')
  console.log('   6. Corporate Accounting & Auditing (6 lessons, 14h)')
  console.log('   7. Financial Management (6 lessons, 13h)')
  console.log('   8. Exam Preparation & Revision (5 lessons, 13h)')
  console.log('✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
