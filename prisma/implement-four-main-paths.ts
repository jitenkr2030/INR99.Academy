import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Implementing Four Main Learning Paths structure...')

  // Clear existing learning path categories and paths to restructure
  await prisma.learningPath.deleteMany()
  await prisma.learningPathCategory.deleteMany()

  console.log('🗑️ Cleared existing learning structure')

  // Create the Four Main Learning Path Categories
  const mainLearningPaths = await Promise.all([
    // 1. School Learning Path
    prisma.learningPathCategory.create({
      data: {
        id: 'school',
        name: 'School',
        slug: 'school',
        description: 'Class 1-12 comprehensive education covering all boards and subjects',
        icon: '🧒',
        color: 'bg-blue-100',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    }),

    // 2. College Learning Path
    prisma.learningPathCategory.create({
      data: {
        id: 'college',
        name: 'College',
        slug: 'college',
        description: 'Undergraduate foundation courses for various degree programs',
        icon: '🎓',
        color: 'bg-green-100',
        sortOrder: 2,
        isActive: true,
        isFeatured: true,
      },
    }),

    // 3. Career & Skills Learning Path
    prisma.learningPathCategory.create({
      data: {
        id: 'career-skills',
        name: 'Career & Skills',
        slug: 'career-skills',
        description: 'Professional development and technical skills for career growth',
        icon: '🧑‍💼',
        color: 'bg-purple-100',
        sortOrder: 3,
        isActive: true,
        isFeatured: true,
      },
    }),

    // 4. Money & Business Learning Path
    prisma.learningPathCategory.create({
      data: {
        id: 'money-business',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy, business fundamentals, and investment strategies',
        icon: '💰',
        color: 'bg-orange-100',
        sortOrder: 4,
        isActive: true,
        isFeatured: true,
      },
    }),
  ])

  // Create Specific Learning Paths for each main category

  // School Learning Paths
  const schoolLearningPaths = await Promise.all([
    prisma.learningPath.create({
      data: {
        id: 'primary-school',
        title: 'Primary School (Class 1-5)',
        description: 'Math, EVS, English, Hindi, GK, Digital basics',
        icon: '📚',
        color: 'bg-blue-200',
        categoryId: mainLearningPaths[0].id,
        pathType: 'SCHOOL',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'middle-school',
        title: 'Middle School (Class 6-8)',
        description: 'Math, Science, Social Science, English, Computer basics',
        icon: '🔬',
        color: 'bg-blue-200',
        categoryId: mainLearningPaths[0].id,
        pathType: 'SCHOOL',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'secondary-school',
        title: 'Secondary School (Class 9-10)',
        description: 'Math, Science, Social Science, English, IT basics',
        icon: '📐',
        color: 'bg-blue-200',
        categoryId: mainLearningPaths[0].id,
        pathType: 'SCHOOL',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'senior-secondary',
        title: 'Senior Secondary (Class 11-12)',
        description: 'Science, Commerce, and Arts streams',
        icon: '🎓',
        color: 'bg-blue-200',
        categoryId: mainLearningPaths[0].id,
        pathType: 'SCHOOL',
        sortOrder: 4,
        isActive: true,
      },
    }),
  ])

  // College Learning Paths
  const collegeLearningPaths = await Promise.all([
    prisma.learningPath.create({
      data: {
        id: 'commerce-stream',
        title: 'Commerce Stream',
        description: 'Financial Accounting, Cost Accounting, Business Law, Economics, Tax basics',
        icon: '📊',
        color: 'bg-green-200',
        categoryId: mainLearningPaths[1].id,
        pathType: 'COLLEGE',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'computer-science',
        title: 'Computer Science',
        description: 'Programming fundamentals, Data structures, Databases, Operating systems',
        icon: '💻',
        color: 'bg-green-200',
        categoryId: mainLearningPaths[1].id,
        pathType: 'COLLEGE',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'science-stream',
        title: 'Science Stream',
        description: 'Physics, Chemistry, Biology, Statistics fundamentals',
        icon: '🧪',
        color: 'bg-green-200',
        categoryId: mainLearningPaths[1].id,
        pathType: 'COLLEGE',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'engineering-stream',
        title: 'Engineering Stream',
        description: 'Engineering maths, Basic electrical, Mechanics, Materials science',
        icon: '⚙️',
        color: 'bg-green-200',
        categoryId: mainLearningPaths[1].id,
        pathType: 'COLLEGE',
        sortOrder: 4,
        isActive: true,
      },
    }),
  ])

  // Career & Skills Learning Paths
  const careerLearningPaths = await Promise.all([
    prisma.learningPath.create({
      data: {
        id: 'professional-development',
        title: 'Professional Development',
        description: 'Resume building, communication skills, time management',
        icon: '💼',
        color: 'bg-purple-200',
        categoryId: mainLearningPaths[2].id,
        pathType: 'CAREER',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'technical-skills',
        title: 'Technical Skills',
        description: 'Web development, data analysis, digital marketing',
        icon: '🔧',
        color: 'bg-purple-200',
        categoryId: mainLearningPaths[2].id,
        pathType: 'CAREER',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'soft-skills',
        title: 'Soft Skills',
        description: 'Leadership, emotional intelligence, problem-solving',
        icon: '🤝',
        color: 'bg-purple-200',
        categoryId: mainLearningPaths[2].id,
        pathType: 'CAREER',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ])

  // Money & Business Learning Paths
  const moneyLearningPaths = await Promise.all([
    prisma.learningPath.create({
      data: {
        id: 'financial-literacy',
        title: 'Financial Literacy',
        description: 'Personal finance, investment basics, banking services',
        icon: '💳',
        color: 'bg-orange-200',
        categoryId: mainLearningPaths[3].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'business-fundamentals',
        title: 'Business Fundamentals',
        description: 'Business planning, entrepreneurship, marketing',
        icon: '🏢',
        color: 'bg-orange-200',
        categoryId: mainLearningPaths[3].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.learningPath.create({
      data: {
        id: 'investment-trading',
        title: 'Investment & Trading',
        description: 'Stock market, mutual funds, cryptocurrency',
        icon: '📈',
        color: 'bg-orange-200',
        categoryId: mainLearningPaths[3].id,
        pathType: 'MONEY_BUSINESS',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Four Main Learning Paths structure implemented!')
  console.log('📊 Summary:')
  console.log(`  - Main Learning Categories: ${mainLearningPaths.length}`)
  console.log(`  - School Learning Paths: ${schoolLearningPaths.length}`)
  console.log(`  - College Learning Paths: ${collegeLearningPaths.length}`)
  console.log(`  - Career Learning Paths: ${careerLearningPaths.length}`)
  console.log(`  - Money & Business Learning Paths: ${moneyLearningPaths.length}`)
  console.log(`  - Total Learning Paths: ${schoolLearningPaths.length + collegeLearningPaths.length + careerLearningPaths.length + moneyLearningPaths.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Implementation error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })