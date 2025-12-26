import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with new learning utility structure...')

  // Clear existing data (keeping users and subscriptions)
  await prisma.userBadge.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.paymentRecord.deleteMany()
  await prisma.discussionReply.deleteMany()
  await prisma.discussion.deleteMany()
  await prisma.userAssessment.deleteMany()
  await prisma.assessmentQuestion.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.courseProgress.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.subCategoryStats.deleteMany()
  await prisma.categoryStats.deleteMany()
  await prisma.learningPathCategoryStats.deleteMany()
  await prisma.course.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.subCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.learningPathCategory.deleteMany()
  await prisma.collegeSubject.deleteMany()
  await prisma.collegeDegree.deleteMany()
  await prisma.schoolSubject.deleteMany()
  await prisma.schoolClass.deleteMany()
  await prisma.curriculumBoard.deleteMany()

  console.log('🗑️ Cleared existing data (except users and subscriptions)')

  // Create Curriculum Boards
  const boards = await Promise.all([
    prisma.curriculumBoard.create({
      data: {
        id: 'cbse',
        name: 'Central Board of Secondary Education',
        shortCode: 'CBSE',
        description: 'National level board of education in India for public and private schools',
        isActive: true,
      },
    }),
    prisma.curriculumBoard.create({
      data: {
        id: 'icse',
        name: 'Indian Certificate of Secondary Education',
        shortCode: 'ICSE',
        description: 'Private board of school education in India',
        isActive: true,
      },
    }),
    prisma.curriculumBoard.create({
      data: {
        id: 'state-up',
        name: 'Uttar Pradesh State Board',
        shortCode: 'UP Board',
        description: 'State board of education for Uttar Pradesh',
        isActive: true,
      },
    }),
    prisma.curriculumBoard.create({
      data: {
        id: 'state-mh',
        name: 'Maharashtra State Board',
        shortCode: 'MH Board',
        description: 'State board of education for Maharashtra',
        isActive: true,
      },
    }),
    prisma.curriculumBoard.create({
      data: {
        id: 'state-tn',
        name: 'Tamil Nadu State Board',
        shortCode: 'TN Board',
        description: 'State board of education for Tamil Nadu',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created curriculum boards')

  // Create School Classes
  const schoolClasses = await Promise.all([
    // Primary Classes (1-5)
    prisma.schoolClass.create({
      data: {
        id: 'class-1',
        name: '1',
        level: 'PRIMARY',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-2',
        name: '2',
        level: 'PRIMARY',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-3',
        name: '3',
        level: 'PRIMARY',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-4',
        name: '4',
        level: 'PRIMARY',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-5',
        name: '5',
        level: 'PRIMARY',
        sortOrder: 5,
        isActive: true,
      },
    }),
    // Middle Classes (6-8)
    prisma.schoolClass.create({
      data: {
        id: 'class-6',
        name: '6',
        level: 'MIDDLE',
        sortOrder: 6,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-7',
        name: '7',
        level: 'MIDDLE',
        sortOrder: 7,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-8',
        name: '8',
        level: 'MIDDLE',
        sortOrder: 8,
        isActive: true,
      },
    }),
    // Secondary Classes (9-10)
    prisma.schoolClass.create({
      data: {
        id: 'class-9',
        name: '9',
        level: 'SECONDARY',
        sortOrder: 9,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-10',
        name: '10',
        level: 'SECONDARY',
        sortOrder: 10,
        isActive: true,
      },
    }),
    // Senior Secondary Classes (11-12)
    prisma.schoolClass.create({
      data: {
        id: 'class-11',
        name: '11',
        level: 'SENIOR_SECONDARY',
        sortOrder: 11,
        isActive: true,
      },
    }),
    prisma.schoolClass.create({
      data: {
        id: 'class-12',
        name: '12',
        level: 'SENIOR_SECONDARY',
        sortOrder: 12,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created school classes')

  // Create College Degrees
  const collegeDegrees = await Promise.all([
    // Undergraduate Degrees
    prisma.collegeDegree.create({
      data: {
        id: 'ba',
        name: 'Bachelor of Arts',
        shortCode: 'BA',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in arts and humanities',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'bsc',
        name: 'Bachelor of Science',
        shortCode: 'BSc',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in science',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'bcom',
        name: 'Bachelor of Commerce',
        shortCode: 'BCom',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in commerce',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'bba',
        name: 'Bachelor of Business Administration',
        shortCode: 'BBA',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in business administration',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'bca',
        name: 'Bachelor of Computer Applications',
        shortCode: 'BCA',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in computer applications',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'be',
        name: 'Bachelor of Engineering',
        shortCode: 'BE',
        level: 'UNDERGRADUATE',
        duration: 4,
        description: 'Undergraduate degree in engineering',
        isActive: true,
      },
    }),
    // Diploma Programs
    prisma.collegeDegree.create({
      data: {
        id: 'diploma-cs',
        name: 'Diploma in Computer Science',
        shortCode: 'Dip CS',
        level: 'DIPLOMA',
        duration: 2,
        description: 'Diploma program in computer science',
        isActive: true,
      },
    }),
    prisma.collegeDegree.create({
      data: {
        id: 'diploma-business',
        name: 'Diploma in Business Management',
        shortCode: 'Dip BM',
        level: 'DIPLOMA',
        duration: 1,
        description: 'Diploma program in business management',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created college degrees')

  // Create Learning Path Categories (18 categories)
  const learningPathCategories = await Promise.all([
    prisma.learningPathCategory.create({
      data: {
        id: 'foundational',
        name: 'Foundational Learning',
        slug: 'foundational-learning',
        description: 'Learning how to learn and essential digital skills',
        icon: 'Brain',
        color: 'bg-blue-100',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'money-finance',
        name: 'Money, Finance & Economics',
        slug: 'money-finance-economics',
        description: 'Personal finance, investing, and economic principles',
        icon: 'TrendingUp',
        color: 'bg-green-100',
        sortOrder: 2,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'business-commerce',
        name: 'Business, Commerce & Entrepreneurship',
        slug: 'business-commerce-entrepreneurship',
        description: 'Business fundamentals, commerce, and startup skills',
        icon: 'Building',
        color: 'bg-orange-100',
        sortOrder: 3,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'technology-computer',
        name: 'Technology & Computer Science',
        slug: 'technology-computer-science',
        description: 'Programming, web development, and computer fundamentals',
        icon: 'Calculator',
        color: 'bg-purple-100',
        sortOrder: 4,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'design-creative',
        name: 'Design, Creative & Media',
        slug: 'design-creative-media',
        description: 'UI/UX design, graphic design, and content creation',
        icon: 'Palette',
        color: 'bg-pink-100',
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'marketing-sales',
        name: 'Marketing, Sales & Growth',
        slug: 'marketing-sales-growth',
        description: 'Digital marketing, sales techniques, and growth strategies',
        icon: 'Megaphone',
        color: 'bg-red-100',
        sortOrder: 6,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'career-professional',
        name: 'Career & Professional Development',
        slug: 'career-professional-development',
        description: 'Career planning, workplace skills, and professional growth',
        icon: 'Briefcase',
        color: 'bg-indigo-100',
        sortOrder: 7,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'science-engineering',
        name: 'Science, Engineering & Research',
        slug: 'science-engineering-research',
        description: 'Scientific concepts, engineering principles, and research methods',
        icon: 'Beaker',
        color: 'bg-teal-100',
        sortOrder: 8,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'health-fitness',
        name: 'Health, Fitness & Well-being',
        slug: 'health-fitness-well-being',
        description: 'Health education, fitness, and mental wellness awareness',
        icon: 'Heart',
        color: 'bg-red-100',
        sortOrder: 9,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'language-communication',
        name: 'Language & Communication',
        slug: 'language-communication',
        description: 'Language learning and communication skills',
        icon: 'MessageCircle',
        color: 'bg-blue-100',
        sortOrder: 10,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'government-civics',
        name: 'Government, Civics & Awareness',
        slug: 'government-civics-awareness',
        description: 'Indian governance, civic education, and competitive exam foundations',
        icon: 'Shield',
        color: 'bg-green-100',
        sortOrder: 11,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'ecommerce-business',
        name: 'E-commerce & Online Business',
        slug: 'ecommerce-online-business',
        description: 'Online selling, digital products, and e-commerce strategies',
        icon: 'ShoppingCart',
        color: 'bg-orange-100',
        sortOrder: 12,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'gaming-newage',
        name: 'Gaming & New-age Careers',
        slug: 'gaming-newage-careers',
        description: 'Game development, esports, and emerging career paths',
        icon: 'Gamepad2',
        color: 'bg-purple-100',
        sortOrder: 13,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'life-skills',
        name: 'Life Skills & Practical Knowledge',
        slug: 'life-skills-practical-knowledge',
        description: 'Essential life skills and practical everyday knowledge',
        icon: 'Home',
        color: 'bg-yellow-100',
        sortOrder: 14,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'diy-productivity',
        name: 'DIY, Tools & Productivity',
        slug: 'diy-tools-productivity',
        description: 'Productivity tools, automation, and DIY skills',
        icon: 'Wrench',
        color: 'bg-gray-100',
        sortOrder: 15,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'philosophy-thinking',
        name: 'Philosophy, Thinking & Decision-making',
        slug: 'philosophy-thinking-decision-making',
        description: 'Critical thinking, philosophy, and decision frameworks',
        icon: 'Compass',
        color: 'bg-indigo-100',
        sortOrder: 16,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'safety-law',
        name: 'Safety, Law & Awareness',
        slug: 'safety-law-awareness',
        description: 'Legal awareness, safety education, and rights knowledge',
        icon: 'Scale',
        color: 'bg-blue-100',
        sortOrder: 17,
        isActive: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'community-led',
        name: 'Community-led Learning',
        slug: 'community-led-learning',
        description: 'Peer learning, study groups, and collaborative education',
        icon: 'Users2',
        color: 'bg-green-100',
        sortOrder: 18,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created learning path categories')

  // Create Learning Paths for each category
  const learningPaths = await Promise.all([
    // Foundational Learning Paths
    prisma.learningPath.create({
      data: {
        id: 'learning-how-to-learn',
        title: 'Learning How to Learn',
        description: 'Master effective learning techniques and study strategies',
        icon: 'Brain',
        color: 'bg-blue-100',
        categoryId: learningPathCategories[0].id,
        pathType: 'GENERAL',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'digital-literacy',
        title: 'Digital Literacy',
        description: 'Essential digital skills for the modern world',
        icon: 'Brain',
        color: 'bg-blue-100',
        categoryId: learningPathCategories[0].id,
        pathType: 'GENERAL',
        sortOrder: 2,
        isActive: true,
      },
    }),
    // Money & Finance Paths
    prisma.learningPath.create({
      data: {
        id: 'personal-finance-mastery',
        title: 'Personal Finance Mastery',
        description: 'Complete guide to managing your money effectively',
        icon: 'TrendingUp',
        color: 'bg-green-100',
        categoryId: learningPathCategories[1].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'investment-basics',
        title: 'Investment Basics',
        description: 'Learn to invest in stocks, mutual funds, and more',
        icon: 'TrendingUp',
        color: 'bg-green-100',
        categoryId: learningPathCategories[1].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 2,
        isActive: true,
      },
    }),
    // Business & Entrepreneurship Paths
    prisma.learningPath.create({
      data: {
        id: 'business-fundamentals',
        title: 'Business Fundamentals',
        description: 'Essential business knowledge for entrepreneurs',
        icon: 'Building',
        color: 'bg-orange-100',
        categoryId: learningPathCategories[2].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'startup-essentials',
        title: 'Startup Essentials',
        description: 'From idea to launch - everything you need to know',
        icon: 'Building',
        color: 'bg-orange-100',
        categoryId: learningPathCategories[2].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 2,
        isActive: true,
      },
    }),
    // Technology & Computer Science Paths
    prisma.learningPath.create({
      data: {
        id: 'programming-fundamentals',
        title: 'Programming Fundamentals',
        description: 'Learn to code from scratch with multiple languages',
        icon: 'Calculator',
        color: 'bg-purple-100',
        categoryId: learningPathCategories[3].id,
        pathType: 'TECH_COMPUTER',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'web-development',
        title: 'Web Development',
        description: 'Build modern websites and web applications',
        icon: 'Calculator',
        color: 'bg-purple-100',
        categoryId: learningPathCategories[3].id,
        pathType: 'TECH_COMPUTER',
        sortOrder: 2,
        isActive: true,
      },
    }),
    // Career & Professional Development Paths
    prisma.learningPath.create({
      data: {
        id: 'career-planning',
        title: 'Career Planning',
        description: 'Plan and navigate your career path effectively',
        icon: 'Briefcase',
        color: 'bg-indigo-100',
        categoryId: learningPathCategories[6].id,
        pathType: 'CAREER',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'workplace-skills',
        title: 'Workplace Skills',
        description: 'Essential skills for professional success',
        icon: 'Briefcase',
        color: 'bg-indigo-100',
        categoryId: learningPathCategories[6].id,
        pathType: 'CAREER',
        sortOrder: 2,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created learning paths')

  console.log('🎉 Database seeded successfully with new learning utility structure!')
  console.log('📊 Summary:')
  console.log(`   - ${boards.length} Curriculum boards`)
  console.log(`   - ${schoolClasses.length} School classes`)
  console.log(`   - ${collegeDegrees.length} College degrees`)
  console.log(`   - ${learningPathCategories.length} Learning path categories`)
  console.log(`   - ${learningPaths.length} Learning paths`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })