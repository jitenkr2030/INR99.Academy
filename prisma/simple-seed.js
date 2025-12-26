const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  // Create Courses for each learning path
  const courses = await Promise.all([
    // Full Stack Web Development Courses
    prisma.course.create({
      data: {
        id: 'course1',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development with HTML and CSS',
        difficulty: 'BEGINNER',
        duration: 180,
        isActive: true,
        instructorId: 'inst1',
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
        learningPathId: 'lp1',
      },
    }),

    // UI/UX Design Mastery Courses
    prisma.course.create({
      data: {
        id: 'course4',
        title: 'UI Design Principles',
        description: 'Learn fundamental principles of user interface design',
        difficulty: 'BEGINNER',
        duration: 150,
        isActive: true,
        instructorId: 'inst2',
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
        learningPathId: 'lp2',
      },
    }),

    // Financial Literacy Courses
    prisma.course.create({
      data: {
        id: 'course6',
        title: 'Personal Finance Basics',
        description: 'Essential personal finance management skills',
        difficulty: 'BEGINNER',
        duration: 120,
        isActive: true,
        instructorId: 'inst3',
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
        learningPathId: 'lp3',
      },
    }),
  ])

  // Create basic instructors
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
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${learningPaths.length} learning paths`)
  console.log(`Created ${courses.length} courses`)
  console.log(`Created ${instructors.length} instructors`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })