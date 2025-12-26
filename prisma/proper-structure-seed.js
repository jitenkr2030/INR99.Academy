import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Implementing proper INR99.Academy learning structure...')

  // Clear existing data to start fresh
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
  await prisma.course.deleteMany()
  await prisma.instructor.deleteMany()
  await prisma.subCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.learningPathCategory.deleteMany()
  await prisma.skillBadge.deleteMany()
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

  // Create the 4 Main Learning Path Categories
  const learningPathCategories = await Promise.all([
    prisma.learningPathCategory.create({
      data: {
        id: 'lpc1',
        name: 'School',
        slug: 'school',
        description: 'Class 1-12 education with all subjects and boards',
        icon: '🧒',
        color: 'bg-blue-100',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'lpc2',
        name: 'College',
        slug: 'college',
        description: 'UG Foundation courses for various streams',
        icon: '🎓',
        color: 'bg-green-100',
        sortOrder: 2,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'lpc3',
        name: 'Career & Skills',
        slug: 'career-skills',
        description: 'Professional development and career planning',
        icon: '🧑‍💼',
        color: 'bg-purple-100',
        sortOrder: 3,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.learningPathCategory.create({
      data: {
        id: 'lpc4',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy and business fundamentals',
        icon: '💰',
        color: 'bg-orange-100',
        sortOrder: 4,
        isActive: true,
        isFeatured: true,
      },
    }),
  ])

  // Create Learning Paths under each category
  const learningPaths = await Promise.all([
    // School Learning Paths
    prisma.learningPath.create({
      data: {
        id: 'lp1',
        title: 'Primary School (Class 1-5)',
        description: 'Foundation building for primary education',
        icon: '📚',
        color: 'bg-blue-200',
        categoryId: 'lpc1',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp2',
        title: 'Middle School (Class 6-8)',
        description: 'Concept development for middle school students',
        icon: '🔬',
        color: 'bg-blue-200',
        categoryId: 'lpc1',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp3',
        title: 'Secondary School (Class 9-10)',
        description: 'Board exam preparation and concept clarity',
        icon: '📝',
        color: 'bg-blue-200',
        categoryId: 'lpc1',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp4',
        title: 'Senior Secondary (Class 11-12)',
        description: 'Stream-specific preparation for higher education',
        icon: '🎯',
        color: 'bg-blue-200',
        categoryId: 'lpc1',
        sortOrder: 4,
        isActive: true,
      },
    }),

    // College Learning Paths
    prisma.learningPath.create({
      data: {
        id: 'lp5',
        title: 'Commerce Foundation',
        description: 'UG foundation for commerce students',
        icon: '📊',
        color: 'bg-green-200',
        categoryId: 'lpc2',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp6',
        title: 'Computer Science Foundation',
        description: 'UG foundation for CS students',
        icon: '💻',
        color: 'bg-green-200',
        categoryId: 'lpc2',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp7',
        title: 'Science Foundation',
        description: 'UG foundation for science students',
        icon: '🧪',
        color: 'bg-green-200',
        categoryId: 'lpc2',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp8',
        title: 'Engineering Foundation',
        description: 'UG foundation for engineering students',
        icon: '⚙️',
        color: 'bg-green-200',
        categoryId: 'lpc2',
        sortOrder: 4,
        isActive: true,
      },
    }),

    // Career & Skills Learning Paths
    prisma.learningPath.create({
      data: {
        id: 'lp9',
        title: 'Professional Development',
        description: 'Skills for career growth and advancement',
        icon: '📈',
        color: 'bg-purple-200',
        categoryId: 'lpc3',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp10',
        title: 'Technical Skills',
        description: 'In-demand technical skills for modern careers',
        icon: '🛠️',
        color: 'bg-purple-200',
        categoryId: 'lpc3',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp11',
        title: 'Soft Skills',
        description: 'Essential soft skills for professional success',
        icon: '🤝',
        color: 'bg-purple-200',
        categoryId: 'lpc3',
        sortOrder: 3,
        isActive: true,
      },
    }),

    // Money & Business Learning Paths
    prisma.learningPath.create({
      data: {
        id: 'lp12',
        title: 'Financial Literacy',
        description: 'Personal finance and money management',
        icon: '💳',
        color: 'bg-orange-200',
        categoryId: 'lpc4',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp13',
        title: 'Business Fundamentals',
        description: 'Essential business concepts and entrepreneurship',
        icon: '🏢',
        color: 'bg-orange-200',
        categoryId: 'lpc4',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'lp14',
        title: 'Investment & Trading',
        description: 'Investment strategies and market trading',
        icon: '📈',
        color: 'bg-orange-200',
        categoryId: 'lpc4',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ])

  // Create 18 Comprehensive Categories
  const categories = await Promise.all([
    // Foundational Learning
    prisma.category.create({
      data: {
        id: 'cat1',
        name: 'Foundational Learning',
        slug: 'foundational-learning',
        description: 'Basic concepts and fundamental knowledge across all subjects',
        icon: '🏗️',
        color: 'bg-blue-100',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Money, Finance & Economics
    prisma.category.create({
      data: {
        id: 'cat2',
        name: 'Money, Finance & Economics',
        slug: 'money-finance-economics',
        description: 'Personal finance, economics, and financial markets',
        icon: '💰',
        color: 'bg-green-100',
        sortOrder: 2,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Business, Commerce & Entrepreneurship
    prisma.category.create({
      data: {
        id: 'cat3',
        name: 'Business, Commerce & Entrepreneurship',
        slug: 'business-commerce-entrepreneurship',
        description: 'Business management, commerce, and entrepreneurial skills',
        icon: '🏢',
        color: 'bg-purple-100',
        sortOrder: 3,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Technology & Computer Science
    prisma.category.create({
      data: {
        id: 'cat4',
        name: 'Technology & Computer Science',
        slug: 'technology-computer-science',
        description: 'Programming, computer science, and technology skills',
        icon: '💻',
        color: 'bg-orange-100',
        sortOrder: 4,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Design, Creative & Media
    prisma.category.create({
      data: {
        id: 'cat5',
        name: 'Design, Creative & Media',
        slug: 'design-creative-media',
        description: 'Design principles, creative skills, and media production',
        icon: '🎨',
        color: 'bg-pink-100',
        sortOrder: 5,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Marketing, Sales & Growth
    prisma.category.create({
      data: {
        id: 'cat6',
        name: 'Marketing, Sales & Growth',
        slug: 'marketing-sales-growth',
        description: 'Marketing strategies, sales techniques, and business growth',
        icon: '📢',
        color: 'bg-red-100',
        sortOrder: 6,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Career & Professional Development
    prisma.category.create({
      data: {
        id: 'cat7',
        name: 'Career & Professional Development',
        slug: 'career-professional-development',
        description: 'Career planning, professional skills, and workplace success',
        icon: '👔',
        color: 'bg-indigo-100',
        sortOrder: 7,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Science, Engineering & Research
    prisma.category.create({
      data: {
        id: 'cat8',
        name: 'Science, Engineering & Research',
        slug: 'science-engineering-research',
        description: 'Scientific concepts, engineering principles, and research methodology',
        icon: '🔬',
        color: 'bg-teal-100',
        sortOrder: 8,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Health, Fitness & Well-being
    prisma.category.create({
      data: {
        id: 'cat9',
        name: 'Health, Fitness & Well-being',
        slug: 'health-fitness-wellbeing',
        description: 'Physical health, mental fitness, and overall well-being',
        icon: '💪',
        color: 'bg-emerald-100',
        sortOrder: 9,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Language & Communication
    prisma.category.create({
      data: {
        id: 'cat10',
        name: 'Language & Communication',
        slug: 'language-communication',
        description: 'Language skills, communication techniques, and writing',
        icon: '🗣️',
        color: 'bg-cyan-100',
        sortOrder: 10,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Government, Civics & Awareness
    prisma.category.create({
      data: {
        id: 'cat11',
        name: 'Government, Civics & Awareness',
        slug: 'government-civics-awareness',
        description: 'Civics, government systems, and social awareness',
        icon: '🏛️',
        color: 'bg-violet-100',
        sortOrder: 11,
        isActive: true,
        isFeatured: true,
      },
    }),

    // E-commerce & Online Business
    prisma.category.create({
      data: {
        id: 'cat12',
        name: 'E-commerce & Online Business',
        slug: 'ecommerce-online-business',
        description: 'Online business, e-commerce, and digital entrepreneurship',
        icon: '🛒',
        color: 'bg-fuchsia-100',
        sortOrder: 12,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Gaming & New-age Careers
    prisma.category.create({
      data: {
        id: 'cat13',
        name: 'Gaming & New-age Careers',
        slug: 'gaming-newage-careers',
        description: 'Gaming industry, new-age careers, and emerging fields',
        icon: '🎮',
        color: 'bg-rose-100',
        sortOrder: 13,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Life Skills & Practical Knowledge
    prisma.category.create({
      data: {
        id: 'cat14',
        name: 'Life Skills & Practical Knowledge',
        slug: 'life-skills-practical-knowledge',
        description: 'Essential life skills and practical knowledge for daily living',
        icon: '🛠️',
        color: 'bg-amber-100',
        sortOrder: 14,
        isActive: true,
        isFeatured: true,
      },
    }),

    // DIY, Tools & Productivity
    prisma.category.create({
      data: {
        id: 'cat15',
        name: 'DIY, Tools & Productivity',
        slug: 'diy-tools-productivity',
        description: 'DIY projects, tools usage, and productivity techniques',
        icon: '🔧',
        color: 'bg-lime-100',
        sortOrder: 15,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Philosophy, Thinking & Decision-making
    prisma.category.create({
      data: {
        id: 'cat16',
        name: 'Philosophy, Thinking & Decision-making',
        slug: 'philosophy-thinking-decisionmaking',
        description: 'Philosophical concepts, critical thinking, and decision-making',
        icon: '🧠',
        color: 'bg-sky-100',
        sortOrder: 16,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Safety, Law & Awareness
    prisma.category.create({
      data: {
        id: 'cat17',
        name: 'Safety, Law & Awareness',
        slug: 'safety-law-awareness',
        description: 'Safety practices, legal awareness, and rights education',
        icon: '🛡️',
        color: 'bg-slate-100',
        sortOrder: 17,
        isActive: true,
        isFeatured: true,
      },
    }),

    // Community-led Learning
    prisma.category.create({
      data: {
        id: 'cat18',
        name: 'Community-led Learning',
        slug: 'community-led-learning',
        description: 'Community-driven learning and collaborative education',
        icon: '👥',
        color: 'bg-zinc-100',
        sortOrder: 18,
        isActive: true,
        isFeatured: true,
      },
    }),
  ])

  console.log('✅ Created 4 main learning path categories and 14 learning paths')
  console.log('✅ Created 18 comprehensive categories')

  // Create sample courses for each learning path
  const courses = []

  // School Learning Courses
  const schoolCourses = [
    // Primary School (Class 1-5)
    {
      id: 'course1',
      title: 'Primary Mathematics Foundation',
      description: 'Basic math concepts for Class 1-5 students',
      difficulty: 'BEGINNER',
      duration: 120,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp1',
    },
    {
      id: 'course2',
      title: 'Primary English Learning',
      description: 'English language fundamentals for young learners',
      difficulty: 'BEGINNER',
      duration: 100,
      instructorId: 'inst1',
      categoryId: 'cat10',
      learningPathId: 'lp1',
    },
    {
      id: 'course3',
      title: 'Environmental Science Basics',
      description: 'Introduction to environment and nature for primary students',
      difficulty: 'BEGINNER',
      duration: 80,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp1',
    },

    // Middle School (Class 6-8)
    {
      id: 'course4',
      title: 'Middle School Mathematics',
      description: 'Math concepts for Class 6-8 students',
      difficulty: 'BEGINNER',
      duration: 150,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp2',
    },
    {
      id: 'course5',
      title: 'Science Fundamentals',
      description: 'Basic science concepts for middle school',
      difficulty: 'BEGINNER',
      duration: 140,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp2',
    },
    {
      id: 'course6',
      title: 'Social Science Overview',
      description: 'History, geography, and civics for middle school',
      difficulty: 'BEGINNER',
      duration: 130,
      instructorId: 'inst1',
      categoryId: 'cat11',
      learningPathId: 'lp2',
    },

    // Secondary School (Class 9-10)
    {
      id: 'course7',
      title: 'Mathematics for Class 9-10',
      description: 'Comprehensive math for secondary school',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp3',
    },
    {
      id: 'course8',
      title: 'Science for Class 9-10',
      description: 'Physics, chemistry, and biology fundamentals',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp3',
    },
    {
      id: 'course9',
      title: 'English Literature and Grammar',
      description: 'Advanced English for secondary school',
      difficulty: 'INTERMEDIATE',
      duration: 160,
      instructorId: 'inst1',
      categoryId: 'cat10',
      learningPathId: 'lp3',
    },

    // Senior Secondary (Class 11-12)
    {
      id: 'course10',
      title: 'Mathematics (Class 11-12)',
      description: 'Advanced mathematics for senior secondary',
      difficulty: 'ADVANCED',
      duration: 220,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp4',
    },
    {
      id: 'course11',
      title: 'Physics (Class 11-12)',
      description: 'Comprehensive physics for senior secondary',
      difficulty: 'ADVANCED',
      duration: 240,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp4',
    },
    {
      id: 'course12',
      title: 'Chemistry (Class 11-12)',
      description: 'Inorganic and organic chemistry fundamentals',
      difficulty: 'ADVANCED',
      duration: 230,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp4',
    },
  ]

  // College Learning Courses
  const collegeCourses = [
    // Commerce Foundation
    {
      id: 'course13',
      title: 'Financial Accounting Basics',
      description: 'Introduction to financial accounting principles',
      difficulty: 'BEGINNER',
      duration: 160,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp5',
    },
    {
      id: 'course14',
      title: 'Cost Accounting Fundamentals',
      description: 'Cost accounting concepts and applications',
      difficulty: 'INTERMEDIATE',
      duration: 140,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp5',
    },
    {
      id: 'course15',
      title: 'Business Law Essentials',
      description: 'Legal aspects of business and commerce',
      difficulty: 'INTERMEDIATE',
      duration: 120,
      instructorId: 'inst4',
      categoryId: 'cat17',
      learningPathId: 'lp5',
    },

    // Computer Science Foundation
    {
      id: 'course16',
      title: 'Programming Fundamentals',
      description: 'Introduction to programming concepts',
      difficulty: 'BEGINNER',
      duration: 180,
      instructorId: 'inst1',
      categoryId: 'cat4',
      learningPathId: 'lp6',
    },
    {
      id: 'course17',
      title: 'Data Structures and Algorithms',
      description: 'Essential data structures and algorithms',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst1',
      categoryId: 'cat4',
      learningPathId: 'lp6',
    },
    {
      id: 'course18',
      title: 'Database Management Systems',
      description: 'Database concepts and SQL fundamentals',
      difficulty: 'INTERMEDIATE',
      duration: 160,
      instructorId: 'inst1',
      categoryId: 'cat4',
      learningPathId: 'lp6',
    },

    // Science Foundation
    {
      id: 'course19',
      title: 'Physics for Science Students',
      description: 'Fundamental physics concepts',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp7',
    },
    {
      id: 'course20',
      title: 'Chemistry for Science Students',
      description: 'Chemistry principles and applications',
      difficulty: 'INTERMEDIATE',
      duration: 170,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp7',
    },
    {
      id: 'course21',
      title: 'Statistics Fundamentals',
      description: 'Basic statistical concepts and methods',
      difficulty: 'BEGINNER',
      duration: 140,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp7',
    },

    // Engineering Foundation
    {
      id: 'course22',
      title: 'Engineering Mathematics',
      description: 'Mathematical concepts for engineering',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp8',
    },
    {
      id: 'course23',
      title: 'Basic Electrical Engineering',
      description: 'Fundamentals of electrical engineering',
      difficulty: 'INTERMEDIATE',
      duration: 160,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp8',
    },
    {
      id: 'course24',
      title: 'Engineering Mechanics',
      description: 'Mechanics concepts for engineering students',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst1',
      categoryId: 'cat8',
      learningPathId: 'lp8',
    },
  ]

  // Career & Skills Courses
  const careerCourses = [
    // Professional Development
    {
      id: 'course25',
      title: 'Resume Building and Interview Skills',
      description: 'Create effective resumes and ace interviews',
      difficulty: 'BEGINNER',
      duration: 120,
      instructorId: 'inst4',
      categoryId: 'cat7',
      learningPathId: 'lp9',
    },
    {
      id: 'course26',
      title: 'Communication Skills for Professionals',
      description: 'Business communication and presentation skills',
      difficulty: 'INTERMEDIATE',
      duration: 140,
      instructorId: 'inst4',
      categoryId: 'cat10',
      learningPathId: 'lp9',
    },
    {
      id: 'course27',
      title: 'Time Management and Productivity',
      description: 'Master time management for professional success',
      difficulty: 'BEGINNER',
      duration: 100,
      instructorId: 'inst4',
      categoryId: 'cat15',
      learningPathId: 'lp9',
    },

    // Technical Skills
    {
      id: 'course28',
      title: 'Web Development Fundamentals',
      description: 'HTML, CSS, and JavaScript basics',
      difficulty: 'BEGINNER',
      duration: 160,
      instructorId: 'inst1',
      categoryId: 'cat4',
      learningPathId: 'lp10',
    },
    {
      id: 'course29',
      title: 'Data Analysis with Excel',
      description: 'Master data analysis using Microsoft Excel',
      difficulty: 'BEGINNER',
      duration: 120,
      instructorId: 'inst1',
      categoryId: 'cat4',
      learningPathId: 'lp10',
    },
    {
      id: 'course30',
      title: 'Digital Marketing Essentials',
      description: 'Fundamentals of digital marketing',
      difficulty: 'BEGINNER',
      duration: 140,
      instructorId: 'inst4',
      categoryId: 'cat6',
      learningPathId: 'lp10',
    },

    // Soft Skills
    {
      id: 'course31',
      title: 'Leadership and Team Management',
      description: 'Develop leadership skills and manage teams effectively',
      difficulty: 'INTERMEDIATE',
      duration: 130,
      instructorId: 'inst4',
      categoryId: 'cat7',
      learningPathId: 'lp11',
    },
    {
      id: 'course32',
      title: 'Emotional Intelligence',
      description: 'Understand and develop emotional intelligence',
      difficulty: 'BEGINNER',
      duration: 110,
      instructorId: 'inst4',
      categoryId: 'cat16',
      learningPathId: 'lp11',
    },
    {
      id: 'course33',
      title: 'Problem Solving and Critical Thinking',
      description: 'Develop analytical thinking and problem-solving skills',
      difficulty: 'INTERMEDIATE',
      duration: 120,
      instructorId: 'inst4',
      categoryId: 'cat16',
      learningPathId: 'lp11',
    },
  ]

  // Money & Business Courses
  const moneyBusinessCourses = [
    // Financial Literacy
    {
      id: 'course34',
      title: 'Personal Finance Management',
      description: 'Manage personal finances effectively',
      difficulty: 'BEGINNER',
      duration: 100,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp12',
    },
    {
      id: 'course35',
      title: 'Investment Basics',
      description: 'Introduction to investing and wealth building',
      difficulty: 'BEGINNER',
      duration: 120,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp12',
    },
    {
      id: 'course36',
      title: 'Banking and Financial Services',
      description: 'Understanding banking and financial products',
      difficulty: 'BEGINNER',
      duration: 110,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp12',
    },

    // Business Fundamentals
    {
      id: 'course37',
      title: 'Business Planning and Strategy',
      description: 'Create effective business plans and strategies',
      difficulty: 'INTERMEDIATE',
      duration: 140,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp13',
    },
    {
      id: 'course38',
      title: 'Entrepreneurship Basics',
      description: 'Introduction to starting and running a business',
      difficulty: 'BEGINNER',
      duration: 130,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp13',
    },
    {
      id: 'course39',
      title: 'Marketing Fundamentals',
      description: 'Basic marketing concepts and strategies',
      difficulty: 'BEGINNER',
      duration: 120,
      instructorId: 'inst4',
      categoryId: 'cat6',
      learningPathId: 'lp13',
    },

    // Investment & Trading
    {
      id: 'course40',
      title: 'Stock Market Investing',
      description: 'Learn to invest in the stock market',
      difficulty: 'INTERMEDIATE',
      duration: 150,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp14',
    },
    {
      id: 'course41',
      title: 'Mutual Funds and SIPs',
      description: 'Invest through mutual funds and systematic investment plans',
      difficulty: 'BEGINNER',
      duration: 110,
      instructorId: 'inst3',
      categoryId: 'cat2',
        learningPathId: 'lp14',
    },
    {
      id: 'course42',
      title: 'Cryptocurrency and Digital Assets',
      description: 'Understanding cryptocurrency and digital investments',
      difficulty: 'INTERMEDIATE',
      duration: 130,
      instructorId: 'inst3',
      categoryId: 'cat2',
      learningPathId: 'lp14',
    },
  ]

  // Combine all courses
  const allCourses = [...schoolCourses, ...collegeCourses, ...careerCourses, ...moneyBusinessCourses]

  // Create courses
  await prisma.course.createMany({
    data: allCourses,
  })

  console.log(`✅ Created ${allCourses.length} courses across all learning paths`)

  // Create lessons for all courses
  const lessonsToCreate = []
  let totalLessons = 0

  for (const course of allCourses) {
    const lessonCount = Math.floor(Math.random() * 8) + 8 // 8-15 lessons per course
    
    for (let i = 0; i < lessonCount; i++) {
      lessonsToCreate.push({
        courseId: course.id,
        title: `Lesson ${i + 1}: ${course.title}`,
        content: `Comprehensive lesson content for ${course.title}. This lesson covers essential concepts and practical applications.`,
        duration: Math.floor(Math.random() * 25) + 10, // 10-35 minutes per lesson
        order: i + 1,
        isActive: true,
      })
      totalLessons++
    }
  }

  // Create lessons in batches
  const batchSize = 100
  for (let i = 0; i < lessonsToCreate.length; i += batchSize) {
    const batch = lessonsToCreate.slice(i, i + batchSize)
    await prisma.lesson.createMany({
      data: batch,
    })
  }

  console.log(`✅ Created ${totalLessons} lessons across ${allCourses.length} courses`)

  console.log('🎉 INR99.Academy learning structure implementation complete!')
  console.log(`📊 Final Stats:`)
  console.log(`   - Learning Path Categories: 4`)
  console.log(`   - Learning Paths: 14`)
  console.log(`   - Comprehensive Categories: 18`)
  console.log(`   - Courses: ${allCourses.length}`)
  console.log(`   - Lessons: ${totalLessons}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })