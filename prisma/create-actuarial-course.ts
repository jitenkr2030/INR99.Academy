import { db } from '../src/lib/db'

async function main() {
  console.log('Creating Actuarial Science – Complete Course...\n')

  // Find or create the Professional Courses category
  const category = await db.category.upsert({
    where: { slug: 'professional-courses' },
    update: {},
    create: {
      name: 'Professional Courses',
      slug: 'professional-courses',
      description: 'Professional certification courses for career advancement',
      icon: '🎓',
      color: 'bg-purple-100',
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
  })
  console.log(`✅ Category: ${category.name}`)

  // Find or create the instructor
  const instructor = await db.instructor.upsert({
    where: { id: 'prof-courses-faculty' },
    update: {},
    create: {
      id: 'prof-courses-faculty',
      name: 'Professional Courses Faculty',
      bio: 'Expert faculty for professional certification courses',
      expertise: 'Actuarial Science, Finance, Statistics',
      avatar: '/assets/instructors/professional-faculty.svg',
      isActive: true,
    },
  })
  console.log(`✅ Instructor: ${instructor.name}`)

  // Create the Actuarial Science course
  const course = await db.course.upsert({
    where: { id: 'course-actuarial-science' },
    update: {},
    create: {
      id: 'course-actuarial-science',
      title: 'Actuarial Science – Complete Course',
      description: 'Complete preparation for Actuarial Science examinations covering core mathematical, statistical, and financial concepts required to become a professional actuary. Aligned with global actuarial syllabi (IFoA, IAI, SOA, CAS).',
      thumbnail: '/assets/courses/actuarial-science.svg',
      difficulty: 'ADVANCED',
      duration: 15000, // 250 hours in minutes
      instructorId: instructor.id,
      categoryId: category.id,
      isActive: true,
      courseType: 'GENERAL',
    },
  })
  console.log(`✅ Course: ${course.title}`)

  // Delete existing lessons if any
  await db.lesson.deleteMany({
    where: { courseId: course.id },
  })
  console.log('🗑️  Deleted existing lessons')

  // Create Module 1: Mathematical Foundations for Actuaries (35 Hours)
  const module1Lessons = [
    { title: 'Introduction to Actuarial Mathematics', order: 1, duration: 45 },
    { title: 'Algebra & Functions - Core Concepts', order: 2, duration: 60 },
    { title: 'Limits and Continuity', order: 3, duration: 60 },
    { title: 'Differentiation Rules and Applications', order: 4, duration: 75 },
    { title: 'Integration Techniques', order: 5, duration: 75 },
    { title: 'Multivariable Calculus - Partial Derivatives', order: 6, duration: 60 },
    { title: 'Multivariable Calculus - Multiple Integrals', order: 7, duration: 60 },
    { title: 'Matrices and Linear Algebra Basics', order: 8, duration: 60 },
    { title: 'Matrix Operations and Transformations', order: 9, duration: 60 },
    { title: 'Eigenvalues and Eigenvectors', order: 10, duration: 60 },
    { title: 'Optimization Techniques - Single Variable', order: 11, duration: 60 },
    { title: 'Optimization Techniques - Multivariable', order: 12, duration: 60 },
    { title: 'Applications in Risk & Finance', order: 13, duration: 60 },
    { title: 'Numerical Methods for Actuaries', order: 14, duration: 60 },
  ]

  // Create Module 2: Probability Theory (35 Hours)
  const module2Lessons = [
    { title: 'Probability Concepts and Axioms', order: 101, duration: 60 },
    { title: 'Addition and Multiplication Rules', order: 102, duration: 60 },
    { title: 'Conditional Probability', order: 103, duration: 60 },
    { title: 'Bayes Theorem and Applications', order: 104, duration: 60 },
    { title: 'Random Variables - Discrete', order: 105, duration: 60 },
    { title: 'Random Variables - Continuous', order: 106, duration: 60 },
    { title: 'Probability Mass Functions', order: 107, duration: 60 },
    { title: 'Probability Density Functions', order: 108, duration: 60 },
    { title: 'Cumulative Distribution Functions', order: 109, duration: 60 },
    { title: 'Expectation and Variance', order: 110, duration: 75 },
    { title: 'Moment Generating Functions', order: 111, duration: 60 },
    { title: 'Common Discrete Distributions', order: 112, duration: 75 },
    { title: 'Common Continuous Distributions', order: 113, duration: 75 },
    { title: 'Joint Distributions', order: 114, duration: 60 },
    { title: 'Conditional Distributions', order: 115, duration: 60 },
    { title: 'Covariance and Correlation', order: 116, duration: 60 },
    { title: 'Applications in Insurance', order: 117, duration: 60 },
  ]

  // Create Module 3: Statistics for Actuarial Science (35 Hours)
  const module3Lessons = [
    { title: 'Descriptive Statistics - Central Tendency', order: 201, duration: 60 },
    { title: 'Descriptive Statistics - Dispersion', order: 202, duration: 60 },
    { title: 'Data Visualization Techniques', order: 203, duration: 45 },
    { title: 'Sampling Methods', order: 204, duration: 60 },
    { title: 'Sampling Distributions', order: 205, duration: 60 },
    { title: 'Point Estimation', order: 206, duration: 60 },
    { title: 'Interval Estimation', order: 207, duration: 60 },
    { title: 'Hypothesis Testing - Basics', order: 208, duration: 75 },
    { title: 'Hypothesis Testing - Advanced Tests', order: 209, duration: 75 },
    { title: 'Type I and Type II Errors', order: 210, duration: 45 },
    { title: 'Correlation Analysis', order: 211, duration: 60 },
    { title: 'Simple Linear Regression', order: 212, duration: 75 },
    { title: 'Multiple Regression Analysis', order: 213, duration: 75 },
    { title: 'Regression Diagnostics', order: 214, duration: 60 },
    { title: 'Time Series Analysis - Basics', order: 215, duration: 60 },
    { title: 'Time Series Forecasting', order: 216, duration: 60 },
    { title: 'Introduction to Statistical Software', order: 217, duration: 45 },
  ]

  // Create Module 4: Financial Mathematics (40 Hours)
  const module4Lessons = [
    { title: 'Time Value of Money Concepts', order: 301, duration: 60 },
    { title: 'Simple Interest', order: 302, duration: 60 },
    { title: 'Compound Interest', order: 303, duration: 75 },
    { title: 'Effective and Nominal Rates', order: 304, duration: 60 },
    { title: 'Force of Interest', order: 305, duration: 60 },
    { title: 'Present Value and Accumulation', order: 306, duration: 60 },
    { title: 'Annuities - Basics', order: 307, duration: 75 },
    { title: 'Annuities - Advanced Topics', order: 308, duration: 75 },
    { title: 'Perpetuities', order: 309, duration: 60 },
    { title: 'Loan Repayment Schedules', order: 310, duration: 75 },
    { title: 'Bonds - Basic Concepts', order: 311, duration: 60 },
    { title: 'Bond Pricing and Yield', order: 312, duration: 75 },
    { title: 'Duration and Convexity', order: 313, duration: 75 },
    { title: 'Immunization Techniques', order: 314, duration: 60 },
    { title: 'Fixed Income Securities', order: 315, duration: 60 },
    { title: 'Yield Curves and Term Structure', order: 316, duration: 60 },
    { title: 'Actuarial Present Value', order: 317, duration: 75 },
    { title: 'Asset-Liability Management', order: 318, duration: 60 },
  ]

  // Create Module 5: Insurance & Risk Management (30 Hours)
  const module5Lessons = [
    { title: 'Principles of Insurance', order: 401, duration: 60 },
    { title: 'Risk Classification', order: 402, duration: 60 },
    { title: 'Risk Pooling and Diversification', order: 403, duration: 60 },
    { title: 'Life Insurance Products Overview', order: 404, duration: 60 },
    { title: 'Life Insurance Premium Calculation', order: 405, duration: 75 },
    { title: 'General Insurance Products', order: 406, duration: 60 },
    { title: 'Property and Casualty Insurance', order: 407, duration: 60 },
    { title: 'Health Insurance Basics', order: 408, duration: 60 },
    { title: 'Premium Rating Techniques', order: 409, duration: 75 },
    { title: 'Loss Reserving Methods', order: 410, duration: 60 },
    { title: 'Claims Modeling Basics', order: 411, duration: 60 },
    { title: 'Reinsurance - Concepts', order: 412, duration: 60 },
    { title: 'Reinsurance Types and Applications', order: 413, duration: 60 },
    { title: 'Enterprise Risk Management', order: 414, duration: 60 },
    { title: 'Regulatory Framework for Insurance', order: 415, duration: 45 },
  ]

  // Create Module 6: Survival Models & Life Contingencies (30 Hours)
  const module6Lessons = [
    { title: 'Introduction to Survival Analysis', order: 501, duration: 60 },
    { title: 'Mortality Tables Construction', order: 502, duration: 60 },
    { title: 'Life Tables Interpretation', order: 503, duration: 60 },
    { title: 'Survival Functions', order: 504, duration: 60 },
    { title: 'Hazard and Force of Mortality', order: 505, duration: 60 },
    { title: 'Life Expectancy Calculations', order: 506, duration: 60 },
    { title: 'Life Insurance Models', order: 507, duration: 75 },
    { title: 'Whole Life Insurance', order: 508, duration: 60 },
    { title: 'Term Life Insurance', order: 509, duration: 60 },
    { title: 'Endowment Insurance', order: 510, duration: 60 },
    { title: 'Annuities - Life Contingencies', order: 511, duration: 75 },
    { title: 'Whole Life Annuities', order: 512, duration: 60 },
    { title: 'Temporary Life Annuities', order: 513, duration: 60 },
    { title: 'Pension Mathematics', order: 514, duration: 75 },
    { title: 'Multiple Life Functions', order: 515, duration: 60 },
    { title: 'Actuarial Assumptions and Margins', order: 516, duration: 60 },
  ]

  // Create Module 7: Stochastic Models (30 Hours)
  const module7Lessons = [
    { title: 'Introduction to Stochastic Processes', order: 601, duration: 60 },
    { title: 'Markov Chains - Basics', order: 602, duration: 75 },
    { title: 'Markov Chains - Applications', order: 603, duration: 60 },
    { title: 'Poisson Processes', order: 604, duration: 60 },
    { title: 'Compound Poisson Processes', order: 605, duration: 60 },
    { title: 'Brownian Motion', order: 606, duration: 60 },
    { title: 'Introduction to Ruin Theory', order: 607, duration: 75 },
    { title: 'Lundberg Inequality', order: 608, duration: 60 },
    { title: 'Cramér-Lundberg Model', order: 609, duration: 60 },
    { title: 'Monte Carlo Simulation', order: 610, duration: 75 },
    { title: 'Random Number Generation', order: 611, duration: 60 },
    { title: 'Variance Reduction Techniques', order: 612, duration: 60 },
    { title: 'Simulation in Insurance', order: 613, duration: 60 },
    { title: 'Option Pricing Basics', order: 614, duration: 60 },
    { title: 'Black-Scholes Model Overview', order: 615, duration: 60 },
  ]

  // Create Module 8: Exam Preparation & Actuarial Practice (15 Hours)
  const module8Lessons = [
    { title: 'Actuarial Exam Structure Overview', order: 701, duration: 45 },
    { title: 'Exam Registration and Eligibility', order: 702, duration: 30 },
    { title: 'Study Strategy and Planning', order: 703, duration: 45 },
    { title: 'Numerical Problem-Solving Techniques', order: 704, duration: 60 },
    { title: 'Calculator Skills for Actuaries', order: 705, duration: 45 },
    { title: 'IFoA Exam Questions Analysis', order: 706, duration: 60 },
    { title: 'IAI Exam Questions Analysis', order: 707, duration: 60 },
    { title: 'SOA Exam Questions Analysis', order: 708, duration: 60 },
    { title: 'Past Year Questions - Practice', order: 709, duration: 75 },
    { title: 'Mock Test 1', order: 710, duration: 90 },
    { title: 'Mock Test 1 Review', order: 711, duration: 60 },
    { title: 'Mock Test 2', order: 712, duration: 90 },
    { title: 'Mock Test 2 Review', order: 713, duration: 60 },
    { title: 'Professional Ethics for Actuaries', order: 714, duration: 45 },
    { title: 'Career Pathways in Actuarial Science', order: 715, duration: 45 },
  ]

  const allLessons = [
    ...module1Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module2Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module3Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module4Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module5Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module6Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module7Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
    ...module8Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Actuarial Science preparation.` })),
  ]

  // Insert all lessons
  for (const lesson of allLessons) {
    await db.lesson.create({
      data: lesson,
    })
  }

  console.log(`✅ Created ${allLessons.length} lessons across 8 modules`)

  // Create assessments
  const assessments = [
    { title: 'Mathematical Foundations Quiz', type: 'QUIZ' as const },
    { title: 'Probability Theory Assessment', type: 'QUIZ' as const },
    { title: 'Statistics Mid-Term Exam', type: 'PRACTICE' as const },
    { title: 'Financial Mathematics Test', type: 'QUIZ' as const },
    { title: 'Insurance & Risk Management Quiz', type: 'QUIZ' as const },
    { title: 'Survival Models Assessment', type: 'QUIZ' as const },
    { title: 'Stochastic Models Quiz', type: 'QUIZ' as const },
    { title: 'Final Actuarial Exam', type: 'PRACTICE' as const },
  ]

  for (const assessment of assessments) {
    await db.assessment.create({
      data: {
        title: assessment.title,
        type: assessment.type,
        courseId: course.id,
        isActive: true,
      },
    })
  }

  console.log(`✅ Created ${assessments.length} assessments`)

  console.log('\n🎉 Actuarial Science – Complete Course created successfully!')
  console.log(`📚 Total Lessons: ${allLessons.length}`)
  console.log(`⏱️  Total Duration: 250 hours`)
  console.log(`📊 8 Modules with comprehensive coverage`)
}

main()
  .catch(e => {
    console.error('Error creating course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
