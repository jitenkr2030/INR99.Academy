import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding missing data to database...')

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

  console.log('✅ Missing data added successfully!')
  console.log('📊 Summary:')
  console.log(`  - Users: ${users.length}`)
  console.log(`  - Instructors: ${instructors.length}`)
  console.log(`  - Categories: ${categories.length}`)
  console.log(`  - Courses: ${courses.length}`)
  console.log(`  - Lessons: ${lessons.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })