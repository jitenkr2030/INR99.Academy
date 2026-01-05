import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(' 🌱 Starting CMA Foundation course update...')

  const courseId = 'cma_foundation'
  const categoryId = 'cat_cma' // CMA courses category

  // Check if category exists, create if not
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
  console.log('🧹 Cleaning up existing CMA Foundation lessons...')
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
        title: 'CMA Foundation Complete Course',
        description: 'Complete conceptual and exam-oriented preparation for the Cost and Management Accountant (CMA) Foundation Examination by ICMAI. Build a strong base in Accounting, Costing, Mathematics, Economics, and Law.',
        difficulty: 'INTERMEDIATE',
        thumbnail: '/assets/courses/cma-foundation.svg',
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
        description: 'Complete conceptual and exam-oriented preparation for the Cost and Management Accountant (CMA) Foundation Examination by ICMAI. Build a strong base in Accounting, Costing, Mathematics, Economics, and Law.'
      }
    })
    console.log('✅ Course found:', course.title)
  }

  // Define lessons with order numbers for module grouping
  const lessonsData = [
    // Module 1: Fundamentals of Business Laws & Ethics (Paper 1) - Orders 1-99
    { title: 'Indian Contract Act – Essentials', duration: 180, order: 1 },
    { title: 'Sale of Goods Act – Basics', duration: 160, order: 2 },
    { title: 'Negotiable Instruments Act – Overview', duration: 150, order: 3 },
    { title: 'Partnership Act – Fundamentals', duration: 160, order: 4 },
    { title: 'Business Ethics & Corporate Governance', duration: 170, order: 5 },
    { title: 'Case Studies & MCQs Practice', duration: 160, order: 6 },

    // Module 2: Fundamentals of Financial & Cost Accounting (Paper 2) - Orders 100-199
    { title: 'Accounting Concepts & Conventions', duration: 180, order: 101 },
    { title: 'Journal, Ledger & Trial Balance', duration: 190, order: 102 },
    { title: 'Cash Book & Bank Reconciliation', duration: 170, order: 103 },
    { title: 'Depreciation Accounting', duration: 170, order: 104 },
    { title: 'Final Accounts (Sole Proprietor)', duration: 180, order: 105 },
    { title: 'Introduction to Cost Accounting', duration: 160, order: 106 },
    { title: 'Cost Sheet & Cost Classification', duration: 170, order: 107 },
    { title: 'Practical Numerical Solving', duration: 180, order: 108 },

    // Module 3: Fundamentals of Business Mathematics & Statistics (Paper 3) - Orders 200-299
    // Business Mathematics
    { title: 'Ratio, Proportion & Percentages', duration: 150, order: 201 },
    { title: 'Simple & Compound Interest', duration: 160, order: 202 },
    { title: 'Linear Equations', duration: 150, order: 203 },
    { title: 'Time Value of Money', duration: 150, order: 204 },
    { title: 'Permutations & Combinations', duration: 140, order: 205 },
    // Statistics
    { title: 'Measures of Central Tendency', duration: 150, order: 206 },
    { title: 'Dispersion', duration: 150, order: 207 },
    { title: 'Probability (Basics)', duration: 140, order: 208 },
    { title: 'Practical Numerical Problems', duration: 150, order: 209 },

    // Module 4: Fundamentals of Business Economics & Management (Paper 4) - Orders 300-399
    { title: 'Nature & Scope of Economics', duration: 140, order: 301 },
    { title: 'Demand & Supply Analysis', duration: 150, order: 302 },
    { title: 'Elasticity of Demand', duration: 140, order: 303 },
    { title: 'Production & Cost', duration: 150, order: 304 },
    { title: 'Market Structures', duration: 140, order: 305 },
    { title: 'National Income & Inflation', duration: 140, order: 306 },
    { title: 'Principles of Management', duration: 130, order: 307 },
    { title: 'Functions of Management', duration: 140, order: 308 },
    { title: 'Business Environment in India', duration: 130, order: 309 },
  ]

  console.log('📝 Creating 38 lessons across 4 modules...')

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
      title: 'Module 1: Business Laws & Ethics Mock Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 2: Financial & Cost Accounting Quiz',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 3: Business Mathematics & Statistics Assessment',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 4: Business Economics & Management Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'CMA Foundation Complete Mock Test',
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
  console.log('🎉 CMA Foundation Complete Course updated successfully!')
  console.log('============================================================')
  console.log('📖 Course: CMA Foundation Complete Course')
  console.log('📁 Course ID:', courseId)
  console.log('📊 Structure Summary:')
  console.log('   📚 Total Modules: 4 (4 Papers)')
  console.log('   📝 Total Lessons:', lessonsData.length)
  console.log('   ⏱️ Total Duration:', totalDuration, 'minutes (', Math.round(totalDuration / 60), 'hours)')
  console.log('   📝 Total Assessments: 5')
  console.log('📚 Modules Breakdown:')
  console.log('   1. Fundamentals of Business Laws & Ethics (6 lessons, 16h)')
  console.log('   2. Fundamentals of Financial & Cost Accounting (8 lessons, 19h)')
  console.log('   3. Fundamentals of Business Mathematics & Statistics (9 lessons, 20h)')
  console.log('   4. Fundamentals of Business Economics & Management (9 lessons, 18h)')
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
