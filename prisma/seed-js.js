const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
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
    await prisma.course.deleteMany()
    await prisma.instructor.deleteMany()
    await prisma.subCategory.deleteMany()
    await prisma.category.deleteMany()
    await prisma.learningPath.deleteMany()
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

    // Create Categories
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

    // Create Learning Paths
    const learningPaths = await Promise.all([
      prisma.learningPath.create({
        data: {
          id: 'lp1',
          title: 'Full Stack Web Development',
          description: 'Complete journey from beginner to full stack developer',
          icon: 'Code',
          color: 'bg-blue-100',
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp2',
          title: 'UI/UX Design Mastery',
          description: 'Master the art of user interface and experience design',
          icon: 'Palette',
          color: 'bg-purple-100',
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.learningPath.create({
        data: {
          id: 'lp3',
          title: 'Financial Literacy',
          description: 'Complete guide to personal finance and investment',
          icon: 'PiggyBank',
          color: 'bg-green-100',
          sortOrder: 3,
          isActive: true,
        },
      }),
    ])

    // Create Courses
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
          learningPathId: 'lp1',
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
          learningPathId: 'lp1',
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
          learningPathId: 'lp1',
        },
      }),

      // Design Courses
      prisma.course.create({
        data: {
          id: 'course4',
          title: 'UI Design Principles',
          description: 'Learn fundamental principles of user interface design',
          difficulty: 'BEGINNER',
          duration: 150,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          learningPathId: 'lp2',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course5',
          title: 'Figma for Designers',
          description: 'Master Figma for UI/UX design',
          difficulty: 'BEGINNER',
          duration: 200,
          isActive: true,
          instructorId: 'inst2',
          categoryId: 'cat2',
          learningPathId: 'lp2',
        },
      }),

      // Business & Finance Courses
      prisma.course.create({
        data: {
          id: 'course6',
          title: 'Personal Finance Basics',
          description: 'Essential personal finance management skills',
          difficulty: 'BEGINNER',
          duration: 120,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          learningPathId: 'lp3',
        },
      }),
      prisma.course.create({
        data: {
          id: 'course7',
          title: 'Investment Fundamentals',
          description: 'Learn the basics of investing in stocks, bonds, and mutual funds',
          difficulty: 'INTERMEDIATE',
          duration: 200,
          isActive: true,
          instructorId: 'inst3',
          categoryId: 'cat3',
          learningPathId: 'lp3',
        },
      }),
    ])

    console.log('✅ Database seeded successfully!')
    console.log(`Created ${learningPaths.length} learning paths`)
    console.log(`Created ${courses.length} courses`)
    console.log(`Created ${instructors.length} instructors`)
    console.log(`Created ${categories.length} categories`)
    console.log(`Created ${users.length} users`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })