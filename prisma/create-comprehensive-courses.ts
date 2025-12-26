import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating comprehensive course structure for Four Main Learning Paths...')

  // Clear existing courses and lessons to restructure
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()

  console.log('🗑️ Cleared existing courses and lessons')

  // Create Courses for each Learning Path

  // School Learning Courses
  const schoolCourses = await Promise.all([
    // Primary School Courses
    prisma.course.create({
      data: {
        id: 'primary-math',
        title: 'Primary Mathematics (Class 1-5)',
        description: 'Comprehensive math curriculum for primary classes including numbers, operations, and basic geometry',
        difficulty: 'BEGINNER',
        duration: 300,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'primary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-1',
      },
    }),
    prisma.course.create({
      data: {
        id: 'primary-evs',
        title: 'Environmental Studies (Class 1-5)',
        description: 'Learn about environment, family, community, and basic science concepts',
        difficulty: 'BEGINNER',
        duration: 240,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'primary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-1',
      },
    }),
    prisma.course.create({
      data: {
        id: 'primary-english',
        title: 'English Language (Class 1-5)',
        description: 'English grammar, vocabulary, reading, and writing skills for primary students',
        difficulty: 'BEGINNER',
        duration: 280,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat2',
        learningPathId: 'primary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-1',
      },
    }),

    // Middle School Courses
    prisma.course.create({
      data: {
        id: 'middle-math',
        title: 'Middle School Mathematics (Class 6-8)',
        description: 'Advanced math concepts including algebra, geometry, and statistics',
        difficulty: 'INTERMEDIATE',
        duration: 350,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'middle-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-6',
      },
    }),
    prisma.course.create({
      data: {
        id: 'middle-science',
        title: 'Middle School Science (Class 6-8)',
        description: 'Physics, chemistry, and biology fundamentals for middle school students',
        difficulty: 'INTERMEDIATE',
        duration: 400,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'middle-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-6',
      },
    }),
    prisma.course.create({
      data: {
        id: 'middle-computer',
        title: 'Computer Basics (Class 6-8)',
        description: 'Introduction to computers, programming concepts, and digital literacy',
        difficulty: 'BEGINNER',
        duration: 200,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat1',
        learningPathId: 'middle-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-6',
      },
    }),

    // Secondary School Courses
    prisma.course.create({
      data: {
        id: 'secondary-math',
        title: 'Secondary Mathematics (Class 9-10)',
        description: 'Advanced mathematics including trigonometry, coordinate geometry, and calculus basics',
        difficulty: 'INTERMEDIATE',
        duration: 400,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'secondary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-9',
      },
    }),
    prisma.course.create({
      data: {
        id: 'secondary-science',
        title: 'Secondary Science (Class 9-10)',
        description: 'Comprehensive physics, chemistry, and biology for board exams',
        difficulty: 'INTERMEDIATE',
        duration: 450,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'secondary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-9',
      },
    }),
    prisma.course.create({
      data: {
        id: 'secondary-it',
        title: 'Information Technology (Class 9-10)',
        description: 'IT basics, programming fundamentals, and digital skills',
        difficulty: 'BEGINNER',
        duration: 250,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat1',
        learningPathId: 'secondary-school',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-9',
      },
    }),

    // Senior Secondary Courses
    prisma.course.create({
      data: {
        id: 'senior-science-math',
        title: 'Science & Mathematics (Class 11-12)',
        description: 'Advanced science and math for science stream students',
        difficulty: 'ADVANCED',
        duration: 500,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'senior-secondary',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-11',
      },
    }),
    prisma.course.create({
      data: {
        id: 'senior-commerce',
        title: 'Commerce Studies (Class 11-12)',
        description: 'Accountancy, business studies, and economics for commerce stream',
        difficulty: 'INTERMEDIATE',
        duration: 450,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'senior-secondary',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-11',
      },
    }),
    prisma.course.create({
      data: {
        id: 'senior-arts',
        title: 'Arts & Humanities (Class 11-12)',
        description: 'Literature, history, geography, and political science for arts stream',
        difficulty: 'INTERMEDIATE',
        duration: 400,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'senior-secondary',
        courseType: 'SCHOOL_CONCEPT',
        classId: 'class-11',
      },
    }),
  ])

  // College Learning Courses
  const collegeCourses = await Promise.all([
    // Commerce Stream Courses
    prisma.course.create({
      data: {
        id: 'financial-accounting',
        title: 'Financial Accounting',
        description: 'Principles of accounting, financial statements, and bookkeeping',
        difficulty: 'INTERMEDIATE',
        duration: 320,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'commerce-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bcom',
      },
    }),
    prisma.course.create({
      data: {
        id: 'cost-accounting',
        title: 'Cost Accounting',
        description: 'Cost concepts, budgeting, and cost control techniques',
        difficulty: 'INTERMEDIATE',
        duration: 280,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'commerce-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bcom',
      },
    }),
    prisma.course.create({
      data: {
        id: 'business-law',
        title: 'Business Law',
        description: 'Legal aspects of business, contracts, and corporate law',
        difficulty: 'INTERMEDIATE',
        duration: 300,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'commerce-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bcom',
      },
    }),

    // Computer Science Courses
    prisma.course.create({
      data: {
        id: 'programming-fundamentals',
        title: 'Programming Fundamentals',
        description: 'Learn to code with multiple programming languages',
        difficulty: 'BEGINNER',
        duration: 350,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'computer-science',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bca',
      },
    }),
    prisma.course.create({
      data: {
        id: 'data-structures',
        title: 'Data Structures & Algorithms',
        description: 'Arrays, linked lists, trees, graphs, and algorithm analysis',
        difficulty: 'INTERMEDIATE',
        duration: 400,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'computer-science',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bca',
      },
    }),
    prisma.course.create({
      data: {
        id: 'database-systems',
        title: 'Database Management Systems',
        description: 'SQL, database design, and database administration',
        difficulty: 'INTERMEDIATE',
        duration: 320,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat1',
        learningPathId: 'computer-science',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bca',
      },
    }),

    // Science Stream Courses
    prisma.course.create({
      data: {
        id: 'physics-fundamentals',
        title: 'Physics Fundamentals',
        description: 'Mechanics, thermodynamics, electromagnetism, and modern physics',
        difficulty: 'INTERMEDIATE',
        duration: 380,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'science-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bsc',
      },
    }),
    prisma.course.create({
      data: {
        id: 'chemistry-basics',
        title: 'Chemistry Basics',
        description: 'Organic, inorganic, and physical chemistry fundamentals',
        difficulty: 'INTERMEDIATE',
        duration: 360,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'science-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bsc',
      },
    }),
    prisma.course.create({
      data: {
        id: 'statistics-fundamentals',
        title: 'Statistics Fundamentals',
        description: 'Probability, statistical methods, and data analysis',
        difficulty: 'INTERMEDIATE',
        duration: 300,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'science-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'bsc',
      },
    }),

    // Engineering Stream Courses
    prisma.course.create({
      data: {
        id: 'engineering-mathematics',
        title: 'Engineering Mathematics',
        description: 'Calculus, linear algebra, and differential equations for engineers',
        difficulty: 'ADVANCED',
        duration: 400,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'engineering-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'be',
      },
    }),
    prisma.course.create({
      data: {
        id: 'basic-electrical',
        title: 'Basic Electrical Engineering',
        description: 'Circuit analysis, electrical machines, and power systems',
        difficulty: 'INTERMEDIATE',
        duration: 350,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat1',
        learningPathId: 'engineering-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'be',
      },
    }),
    prisma.course.create({
      data: {
        id: 'engineering-mechanics',
        title: 'Engineering Mechanics',
        description: 'Statics, dynamics, and mechanics of materials',
        difficulty: 'INTERMEDIATE',
        duration: 320,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat3',
        learningPathId: 'engineering-stream',
        courseType: 'COLLEGE_FOUNDATION',
        degreeId: 'be',
      },
    }),
  ])

  // Career & Skills Courses
  const careerCourses = await Promise.all([
    // Professional Development Courses
    prisma.course.create({
      data: {
        id: 'resume-building',
        title: 'Resume Building & Interview Skills',
        description: 'Create professional resumes and master interview techniques',
        difficulty: 'BEGINNER',
        duration: 180,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'professional-development',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'communication-skills',
        title: 'Business Communication',
        description: 'Professional communication, presentation skills, and business writing',
        difficulty: 'BEGINNER',
        duration: 200,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'professional-development',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'time-management',
        title: 'Time Management & Productivity',
        description: 'Effective time management and productivity enhancement techniques',
        difficulty: 'BEGINNER',
        duration: 150,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'professional-development',
        courseType: 'SKILL_BASED',
      },
    }),

    // Technical Skills Courses
    prisma.course.create({
      data: {
        id: 'web-development',
        title: 'Full Stack Web Development',
        description: 'HTML, CSS, JavaScript, React, Node.js, and database integration',
        difficulty: 'INTERMEDIATE',
        duration: 450,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'technical-skills',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'data-analysis',
        title: 'Data Analysis & Visualization',
        description: 'Excel, SQL, Python, and data visualization techniques',
        difficulty: 'INTERMEDIATE',
        duration: 380,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat1',
        learningPathId: 'technical-skills',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'digital-marketing',
        title: 'Digital Marketing Mastery',
        description: 'SEO, social media marketing, content marketing, and analytics',
        difficulty: 'BEGINNER',
        duration: 320,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'technical-skills',
        courseType: 'SKILL_BASED',
      },
    }),

    // Soft Skills Courses
    prisma.course.create({
      data: {
        id: 'leadership-skills',
        title: 'Leadership & Team Management',
        description: 'Leadership principles, team building, and organizational behavior',
        difficulty: 'INTERMEDIATE',
        duration: 250,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'soft-skills',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'emotional-intelligence',
        title: 'Emotional Intelligence',
        description: 'Self-awareness, empathy, and relationship management',
        difficulty: 'BEGINNER',
        duration: 200,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'soft-skills',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'problem-solving',
        title: 'Critical Thinking & Problem Solving',
        description: 'Analytical thinking, creativity, and structured problem solving',
        difficulty: 'INTERMEDIATE',
        duration: 220,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'soft-skills',
        courseType: 'SKILL_BASED',
      },
    }),
  ])

  // Money & Business Courses
  const moneyCourses = await Promise.all([
    // Financial Literacy Courses
    prisma.course.create({
      data: {
        id: 'personal-finance',
        title: 'Personal Finance Management',
        description: 'Budgeting, saving, debt management, and personal financial planning',
        difficulty: 'BEGINNER',
        duration: 200,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'financial-literacy',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'investment-basics',
        title: 'Investment Fundamentals',
        description: 'Stocks, bonds, mutual funds, and investment strategies',
        difficulty: 'BEGINNER',
        duration: 280,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'financial-literacy',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'banking-services',
        title: 'Banking & Financial Services',
        description: 'Understanding banking products, loans, and financial services',
        difficulty: 'BEGINNER',
        duration: 180,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'financial-literacy',
        courseType: 'SKILL_BASED',
      },
    }),

    // Business Fundamentals Courses
    prisma.course.create({
      data: {
        id: 'business-planning',
        title: 'Business Planning & Strategy',
        description: 'Creating business plans, market analysis, and strategic planning',
        difficulty: 'INTERMEDIATE',
        duration: 300,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'business-fundamentals',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'entrepreneurship',
        title: 'Entrepreneurship & Startup',
        description: 'Starting a business, funding, and entrepreneurial mindset',
        difficulty: 'INTERMEDIATE',
        duration: 320,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'business-fundamentals',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'marketing-fundamentals',
        title: 'Marketing Fundamentals',
        description: 'Marketing principles, consumer behavior, and marketing strategies',
        difficulty: 'BEGINNER',
        duration: 250,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'business-fundamentals',
        courseType: 'SKILL_BASED',
      },
    }),

    // Investment & Trading Courses
    prisma.course.create({
      data: {
        id: 'stock-market',
        title: 'Stock Market Investing',
        description: 'Stock market basics, technical analysis, and investment strategies',
        difficulty: 'INTERMEDIATE',
        duration: 350,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'investment-trading',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'mutual-funds',
        title: 'Mutual Funds & Portfolio Management',
        description: 'Mutual fund types, portfolio diversification, and risk management',
        difficulty: 'INTERMEDIATE',
        duration: 280,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'investment-trading',
        courseType: 'SKILL_BASED',
      },
    }),
    prisma.course.create({
      data: {
        id: 'cryptocurrency',
        title: 'Cryptocurrency & Digital Assets',
        description: 'Blockchain, cryptocurrency, and digital investment strategies',
        difficulty: 'INTERMEDIATE',
        duration: 300,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'investment-trading',
        courseType: 'SKILL_BASED',
      },
    }),
  ])

  console.log('✅ Comprehensive course structure created!')
  console.log('📊 Summary:')
  console.log(`  - School Courses: ${schoolCourses.length}`)
  console.log(`  - College Courses: ${collegeCourses.length}`)
  console.log(`  - Career Courses: ${careerCourses.length}`)
  console.log(`  - Money & Business Courses: ${moneyCourses.length}`)
  console.log(`  - Total Courses: ${schoolCourses.length + collegeCourses.length + careerCourses.length + moneyCourses.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Course creation error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })