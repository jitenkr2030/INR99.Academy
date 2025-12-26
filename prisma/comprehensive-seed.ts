import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with comprehensive data...')

  // Clear existing data
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
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'admin',
        mobileNumber: '+919876543210',
        email: 'admin@inr99.academy',
        name: 'Admin User',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user1',
        mobileNumber: '+919876543211',
        email: 'rahul@example.com',
        name: 'Rahul Sharma',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user2',
        mobileNumber: '+919876543212',
        email: 'priya@example.com',
        name: 'Priya Patel',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: 'user3',
        mobileNumber: '+919876543213',
        email: 'amit@example.com',
        name: 'Amit Kumar',
        isActive: true,
      },
    }),
  ])

  // Create Instructors
  const instructors = await Promise.all([
    prisma.instructor.create({
      data: {
        id: 'inst1',
        name: 'Dr. Ananya Reddy',
        bio: 'PhD in Computer Science with 15+ years of industry experience',
        expertise: JSON.stringify(['Web Development', 'JavaScript', 'React', 'Node.js']),
        isActive: true,
      },
    }),
    prisma.instructor.create({
      data: {
        id: 'inst2',
        name: 'Rajesh Kumar',
        bio: 'Senior UI/UX Designer with 10+ years of experience',
        expertise: JSON.stringify(['UI Design', 'UX Research', 'Figma', 'Adobe Creative Suite']),
        isActive: true,
      },
    }),
    prisma.instructor.create({
      data: {
        id: 'inst3',
        name: 'Sunita Menon',
        bio: 'Finance expert with 20+ years in banking and investment',
        expertise: JSON.stringify(['Finance', 'Investment', 'Banking', 'Personal Finance']),
        isActive: true,
      },
    }),
    prisma.instructor.create({
      data: {
        id: 'inst4',
        name: 'Vikram Singh',
        bio: 'Business consultant and entrepreneur',
        expertise: JSON.stringify(['Business Strategy', 'Marketing', 'Leadership', 'Startup']),
        isActive: true,
      },
    }),
  ])

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
  ])

  // Create School Classes
  const schoolClasses = await Promise.all([
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

  // Create College Degrees
  const collegeDegrees = await Promise.all([
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
        id: 'bca',
        name: 'Bachelor of Computer Applications',
        shortCode: 'BCA',
        level: 'UNDERGRADUATE',
        duration: 3,
        description: 'Undergraduate degree in computer applications',
        isActive: true,
      },
    }),
  ])

  // Create Categories (for backward compatibility)
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'cat1',
        name: 'Programming',
        slug: 'programming',
        description: 'Learn various programming languages and development frameworks',
        icon: 'BookOpen',
        color: 'bg-blue-100',
        isFeatured: true,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat2',
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design, graphic design, and creative skills',
        icon: 'FolderOpen',
        color: 'bg-purple-100',
        isFeatured: true,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat3',
        name: 'Business & Finance',
        slug: 'business-finance',
        description: 'Business skills, finance, and entrepreneurship',
        icon: 'TrendingUp',
        color: 'bg-green-100',
        isFeatured: true,
        sortOrder: 3,
        isActive: true,
      },
    }),
  ])

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
    // Business & Commerce Paths
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

  // Create Courses with proper learning path associations
  const courses = await Promise.all([
    // Web Development Courses
    prisma.course.create({
      data: {
        id: 'course1',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development with HTML and CSS',
        difficulty: 'BEGINNER',
        duration: 180,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'web-development',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course2',
        title: 'JavaScript Programming',
        description: 'Master JavaScript programming from basics to advanced concepts',
        difficulty: 'BEGINNER',
        duration: 240,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'web-development',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course3',
        title: 'React Development',
        description: 'Build modern web applications with React',
        difficulty: 'INTERMEDIATE',
        duration: 300,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'web-development',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course4',
        title: 'Node.js Backend Development',
        description: 'Create server-side applications with Node.js and Express',
        difficulty: 'INTERMEDIATE',
        duration: 280,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'web-development',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course5',
        title: 'Android App Development',
        description: 'Build native Android applications with Kotlin',
        difficulty: 'INTERMEDIATE',
        duration: 320,
        isActive: true,
        instructorId: 'inst1',
        categoryId: 'cat1',
        learningPathId: 'programming-fundamentals',
      },
    }),

    // Design Courses
    prisma.course.create({
      data: {
        id: 'course6',
        title: 'UI Design Principles',
        description: 'Learn fundamental principles of user interface design',
        difficulty: 'BEGINNER',
        duration: 150,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'learning-how-to-learn',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course7',
        title: 'Figma for Designers',
        description: 'Master Figma for UI/UX design',
        difficulty: 'BEGINNER',
        duration: 200,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'learning-how-to-learn',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course8',
        title: 'UX Research Methods',
        description: 'Learn user research techniques and methodologies',
        difficulty: 'INTERMEDIATE',
        duration: 180,
        isActive: true,
        instructorId: 'inst2',
        categoryId: 'cat2',
        learningPathId: 'learning-how-to-learn',
      },
    }),

    // Business & Finance Courses
    prisma.course.create({
      data: {
        id: 'course9',
        title: 'Personal Finance Basics',
        description: 'Essential personal finance management skills',
        difficulty: 'BEGINNER',
        duration: 120,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'personal-finance-mastery',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course10',
        title: 'Investment Fundamentals',
        description: 'Learn the basics of investing in stocks, bonds, and mutual funds',
        difficulty: 'INTERMEDIATE',
        duration: 200,
        isActive: true,
        instructorId: 'inst3',
        categoryId: 'cat3',
        learningPathId: 'investment-basics',
      },
    }),
    prisma.course.create({
      data: {
        id: 'course11',
        title: 'Business Strategy 101',
        description: 'Fundamental concepts of business strategy',
        difficulty: 'INTERMEDIATE',
        duration: 160,
        isActive: true,
        instructorId: 'inst4',
        categoryId: 'cat3',
        learningPathId: 'business-fundamentals',
      },
    }),
  ])

  // Create Lessons
  const lessons = await Promise.all([
    // HTML & CSS Fundamentals Lessons
    prisma.lesson.create({
      data: {
        id: 'lesson1',
        courseId: 'course1',
        title: 'Introduction to HTML',
        content: 'Learn the basics of HTML structure and syntax',
        duration: 15,
        order: 1,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson2',
        courseId: 'course1',
        title: 'HTML Elements and Attributes',
        content: 'Understanding HTML elements, attributes, and their usage',
        duration: 20,
        order: 2,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson3',
        courseId: 'course1',
        title: 'CSS Fundamentals',
        content: 'Introduction to CSS and styling web pages',
        duration: 25,
        order: 3,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson4',
        courseId: 'course1',
        title: 'CSS Layouts',
        content: 'Learn about CSS layouts including Flexbox and Grid',
        duration: 30,
        order: 4,
        isActive: true,
      },
    }),

    // JavaScript Programming Lessons
    prisma.lesson.create({
      data: {
        id: 'lesson5',
        courseId: 'course2',
        title: 'JavaScript Basics',
        content: 'Introduction to JavaScript programming',
        duration: 20,
        order: 1,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson6',
        courseId: 'course2',
        title: 'Variables and Data Types',
        content: 'Understanding JavaScript variables and data types',
        duration: 25,
        order: 2,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson7',
        courseId: 'course2',
        title: 'Functions and Scope',
        content: 'Learn about JavaScript functions and variable scope',
        duration: 30,
        order: 3,
        isActive: true,
      },
    }),

    // UI Design Principles Lessons
    prisma.lesson.create({
      data: {
        id: 'lesson8',
        courseId: 'course6',
        title: 'Introduction to UI Design',
        content: 'Learn the fundamentals of User Interface design',
        duration: 15,
        order: 1,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson9',
        courseId: 'course6',
        title: 'Color Theory',
        content: 'Understanding color theory in design',
        duration: 20,
        order: 2,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson10',
        courseId: 'course6',
        title: 'Typography',
        content: 'Learn about typography and font selection',
        duration: 18,
        order: 3,
        isActive: true,
      },
    }),

    // Personal Finance Basics Lessons
    prisma.lesson.create({
      data: {
        id: 'lesson11',
        courseId: 'course9',
        title: 'Introduction to Personal Finance',
        content: 'Understanding the importance of personal finance management',
        duration: 15,
        order: 1,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson12',
        courseId: 'course9',
        title: 'Budgeting Basics',
        content: 'Learn how to create and maintain a personal budget',
        duration: 20,
        order: 2,
        isActive: true,
      },
    }),
    prisma.lesson.create({
      data: {
        id: 'lesson13',
        courseId: 'course9',
        title: 'Saving Strategies',
        content: 'Effective saving strategies for financial goals',
        duration: 18,
        order: 3,
        isActive: true,
      },
    }),
  ])

  // Create some sample assessments
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        id: 'assessment1',
        courseId: 'course1',
        title: 'HTML & CSS Basics Quiz',
        type: 'QUIZ',
        isActive: true,
      },
    }),
    prisma.assessment.create({
      data: {
        id: 'assessment2',
        courseId: 'course2',
        title: 'JavaScript Fundamentals Test',
        type: 'QUIZ',
        isActive: true,
      },
    }),
    prisma.assessment.create({
      data: {
        id: 'assessment3',
        courseId: 'course9',
        title: 'Personal Finance Knowledge Check',
        type: 'QUIZ',
        isActive: true,
      },
    }),
  ])

  // Create sample discussions
  const discussions = await Promise.all([
    prisma.discussion.create({
      data: {
        id: 'discussion1',
        courseId: 'course1',
        userId: 'user1',
        title: 'Best practices for HTML semantics?',
        content: 'What are the best practices for writing semantic HTML?',
        isActive: true,
      },
    }),
    prisma.discussion.create({
      data: {
        id: 'discussion2',
        courseId: 'course2',
        userId: 'user2',
        title: 'JavaScript closures explained',
        content: 'Can someone explain JavaScript closures in simple terms?',
        isActive: true,
      },
    }),
    prisma.discussion.create({
      data: {
        id: 'discussion3',
        courseId: 'course9',
        userId: 'user3',
        title: 'Budgeting apps recommendations',
        content: 'What are the best budgeting apps for beginners?',
        isActive: true,
      },
    }),
  ])

  // Create skill badges
  const skillBadges = await Promise.all([
    prisma.skillBadge.create({
      data: {
        id: 'badge1',
        name: 'HTML Master',
        description: 'Completed HTML & CSS Fundamentals course',
        icon: 'Code',
        color: 'bg-blue-100',
        criteria: JSON.stringify({ courseId: 'course1', progress: 100 }),
        isActive: true,
      },
    }),
    prisma.skillBadge.create({
      data: {
        id: 'badge2',
        name: 'JavaScript Developer',
        description: 'Completed JavaScript Programming course',
        icon: 'Code',
        color: 'bg-yellow-100',
        criteria: JSON.stringify({ courseId: 'course2', progress: 100 }),
        isActive: true,
      },
    }),
    prisma.skillBadge.create({
      data: {
        id: 'badge3',
        name: 'Finance Guru',
        description: 'Completed Personal Finance Basics course',
        icon: 'PiggyBank',
        color: 'bg-green-100',
        criteria: JSON.stringify({ courseId: 'course9', progress: 100 }),
        isActive: true,
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log('📊 Summary:')
  console.log(`  - Users: ${users.length}`)
  console.log(`  - Instructors: ${instructors.length}`)
  console.log(`  - Categories: ${categories.length}`)
  console.log(`  - Learning Path Categories: ${learningPathCategories.length}`)
  console.log(`  - Learning Paths: ${learningPaths.length}`)
  console.log(`  - Courses: ${courses.length}`)
  console.log(`  - Lessons: ${lessons.length}`)
  console.log(`  - Assessments: ${assessments.length}`)
  console.log(`  - Discussions: ${discussions.length}`)
  console.log(`  - Skill Badges: ${skillBadges.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })