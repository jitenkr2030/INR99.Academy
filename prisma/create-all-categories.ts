/**
 * Comprehensive Seed Script: Create All Categories and Learning Paths
 * This ensures all 7 main categories exist: School, College, Career, Money, Professional, Competitive, Life Skills
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive category and learning path creation...')

  // ============================================================================
  // 1. CREATE CATEGORIES (7 Main Categories)
  // ============================================================================

  console.log('\n📂 Creating Categories...')

  // School Learning Category
  const schoolCategory = await prisma.category.upsert({
    where: { id: 'cat-school-learning' },
    update: {},
    create: {
      id: 'cat-school-learning',
      name: 'School Learning',
      slug: 'school-learning',
      description: 'Class 1-12 with all boards - Math, Science, English, and more',
      icon: '📚',
      color: '#3B82F6',
      sortOrder: 1,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${schoolCategory.name}`)

  // College Foundation Category
  const collegeCategory = await prisma.category.upsert({
    where: { id: 'cat-college-foundation' },
    update: {},
    create: {
      id: 'cat-college-foundation',
      name: 'College Foundation',
      slug: 'college-foundation',
      description: 'UG degrees - Commerce, Science, Engineering prep',
      icon: '🎓',
      color: '#10B981',
      sortOrder: 2,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${collegeCategory.name}`)

  // Career Skills Category
  const careerCategory = await prisma.category.upsert({
    where: { id: 'cat-career-skills' },
    update: {},
    create: {
      id: 'cat-career-skills',
      name: 'Career Skills',
      slug: 'career-skills',
      description: 'Professional development - Communication, Leadership, Job Prep',
      icon: '💼',
      color: '#8B5CF6',
      sortOrder: 3,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${careerCategory.name}`)

  // Money & Business Category
  const moneyCategory = await prisma.category.upsert({
    where: { id: 'cat-money-business' },
    update: {},
    create: {
      id: 'cat-money-business',
      name: 'Money & Business',
      slug: 'money-business',
      description: 'Financial literacy - Investment, Business basics, Personal Finance',
      icon: '💰',
      color: '#F59E0B',
      sortOrder: 4,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${moneyCategory.name}`)

  // Competitive Exams Category
  const competitiveCategory = await prisma.category.upsert({
    where: { id: 'cat-competitive-exams' },
    update: {},
    create: {
      id: 'cat-competitive-exams',
      name: 'Competitive Exams',
      slug: 'competitive-exams',
      description: 'UPSC, SSC, Banking, Railways, and entrance exams preparation',
      icon: '🏆',
      color: '#EF4444',
      sortOrder: 5,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${competitiveCategory.name}`)

  // Professional Courses Category
  const professionalCategory = await prisma.category.upsert({
    where: { id: 'cat-professional-courses' },
    update: {},
    create: {
      id: 'cat-professional-courses',
      name: 'Professional Courses',
      slug: 'professional-courses',
      description: 'SAP, Excel, Tally, Python, and career skills',
      icon: '💻',
      color: '#6366F1',
      sortOrder: 6,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${professionalCategory.name}`)

  // Life Skills Category
  const lifeSkillsCategory = await prisma.category.upsert({
    where: { id: 'cat-life-skills' },
    update: {},
    create: {
      id: 'cat-life-skills',
      name: 'Life Skills',
      slug: 'life-skills',
      description: 'Financial literacy, communication, and personal growth',
      icon: '🌱',
      color: '#EC4899',
      sortOrder: 7,
      isActive: true,
      isFeatured: true,
    },
  })
  console.log(`✅ Category created: ${lifeSkillsCategory.name}`)

  // ============================================================================
  // 2. CREATE LEARNING PATH CATEGORIES (18 categories for organization)
  // ============================================================================

  console.log('\n🎯 Creating Learning Path Categories...')

  const learningPathCategories = [
    { id: 'foundational', name: 'Foundational Learning', slug: 'foundational-learning', icon: 'Brain', color: 'bg-blue-100', sortOrder: 1 },
    { id: 'money-finance', name: 'Money, Finance & Economics', slug: 'money-finance-economics', icon: 'TrendingUp', color: 'bg-green-100', sortOrder: 2 },
    { id: 'business-commerce', name: 'Business, Commerce & Entrepreneurship', slug: 'business-commerce-entrepreneurship', icon: 'Building', color: 'bg-orange-100', sortOrder: 3 },
    { id: 'technology-computer', name: 'Technology & Computer Science', slug: 'technology-computer-science', icon: 'Calculator', color: 'bg-purple-100', sortOrder: 4 },
    { id: 'school-classes', name: 'School Classes (1-12)', slug: 'school-classes', icon: 'BookOpen', color: 'bg-blue-100', sortOrder: 5 },
    { id: 'college-degrees', name: 'College Degrees & Preparation', slug: 'college-degrees-prep', icon: 'GraduationCap', color: 'bg-green-100', sortOrder: 6 },
    { id: 'career-professional', name: 'Career & Professional Development', slug: 'career-professional-dev', icon: 'Briefcase', color: 'bg-indigo-100', sortOrder: 7 },
    { id: 'health-wellness', name: 'Health, Wellness & Fitness', slug: 'health-wellness-fitness', icon: 'Heart', color: 'bg-red-100', sortOrder: 8 },
    { id: 'language-communication', name: 'Language & Communication', slug: 'language-communication', icon: 'MessageCircle', color: 'bg-blue-100', sortOrder: 9 },
    { id: 'government-civics', name: 'Government, Civics & Awareness', slug: 'government-civics-awareness', icon: 'Shield', color: 'bg-green-100', sortOrder: 10 },
    { id: 'competitive-exams-prep', name: 'Competitive Exams Preparation', slug: 'competitive-exams-prep', icon: 'Target', color: 'bg-red-100', sortOrder: 11 },
    { id: 'professional-skills', name: 'Professional Skills & Tools', slug: 'professional-skills-tools', icon: 'Briefcase', color: 'bg-indigo-100', sortOrder: 12 },
    { id: 'life-practical', name: 'Life Skills & Practical Knowledge', slug: 'life-skills-practical', icon: 'Home', color: 'bg-yellow-100', sortOrder: 13 },
  ]

  for (const cat of learningPathCategories) {
    await prisma.learningPathCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: `${cat.name} - Comprehensive learning resources`,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
        isFeatured: cat.sortOrder <= 4,
      },
    })
    console.log(`✅ LearningPathCategory created: ${cat.name}`)
  }

  // ============================================================================
  // 3. CREATE LEARNING PATHS
  // ============================================================================

  console.log('\n📚 Creating Learning Paths...')

  const learningPaths = [
    // School Learning Paths
    {
      id: 'primary-school',
      title: 'Primary School (Class 1-5)',
      description: 'Building strong foundations in Math, English, and Science',
      icon: 'BookOpen',
      color: 'bg-blue-100',
      categoryId: 'school-classes',
      sortOrder: 1,
    },
    {
      id: 'middle-school',
      title: 'Middle School (Class 6-8)',
      description: 'Intermediate concepts in Math, Science, and Languages',
      icon: 'BookOpen',
      color: 'bg-blue-200',
      categoryId: 'school-classes',
      sortOrder: 2,
    },
    {
      id: 'secondary-school',
      title: 'Secondary School (Class 9-10)',
      description: 'Board exam preparation with depth in core subjects',
      icon: 'BookOpen',
      color: 'bg-blue-300',
      categoryId: 'school-classes',
      sortOrder: 3,
    },
    {
      id: 'senior-secondary',
      title: 'Senior Secondary (Class 11-12)',
      description: 'Science, Commerce, and Humanities streams preparation',
      icon: 'GraduationCap',
      color: 'bg-blue-400',
      categoryId: 'school-classes',
      sortOrder: 4,
    },
    // College Foundation Paths
    {
      id: 'commerce-stream',
      title: 'Commerce Stream',
      description: 'Accountancy, Business Studies, Economics, and Mathematics',
      icon: 'TrendingUp',
      color: 'bg-green-100',
      categoryId: 'college-degrees',
      sortOrder: 1,
    },
    {
      id: 'science-stream',
      title: 'Science Stream',
      description: 'Physics, Chemistry, Mathematics, Biology, and Computer Science',
      icon: 'Flask',
      color: 'bg-green-200',
      categoryId: 'college-degrees',
      sortOrder: 2,
    },
    {
      id: 'engineering-prep',
      title: 'Engineering Preparation',
      description: 'JEE, BITSAT, and other engineering entrance exam preparation',
      icon: 'Calculator',
      color: 'bg-green-300',
      categoryId: 'college-degrees',
      sortOrder: 3,
    },
    // Career Skills Paths
    {
      id: 'professional-development',
      title: 'Professional Development',
      description: 'Communication, leadership, and soft skills',
      icon: 'Briefcase',
      color: 'bg-purple-100',
      categoryId: 'career-professional',
      sortOrder: 1,
    },
    {
      id: 'technical-skills',
      title: 'Technical Skills',
      description: 'Programming, data analysis, and digital tools',
      icon: 'Code',
      color: 'bg-purple-200',
      categoryId: 'professional-skills',
      sortOrder: 1,
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills',
      description: 'Interpersonal skills, time management, and productivity',
      icon: 'Users',
      color: 'bg-purple-300',
      categoryId: 'career-professional',
      sortOrder: 2,
    },
    // Money & Business Paths
    {
      id: 'financial-literacy',
      title: 'Financial Literacy',
      description: 'Understanding money, banking, and personal finance',
      icon: 'DollarSign',
      color: 'bg-orange-100',
      categoryId: 'money-finance',
      sortOrder: 1,
    },
    {
      id: 'business-fundamentals',
      title: 'Business Fundamentals',
      description: 'Starting and managing a business effectively',
      icon: 'Building',
      color: 'bg-orange-200',
      categoryId: 'business-commerce',
      sortOrder: 1,
    },
    {
      id: 'investment-trading',
      title: 'Investment & Trading',
      description: 'Stock market, mutual funds, and investment strategies',
      icon: 'TrendingUp',
      color: 'bg-orange-300',
      categoryId: 'money-finance',
      sortOrder: 2,
    },
    // Competitive Exams Paths
    {
      id: 'upsc-preparation',
      title: 'UPSC Civil Services',
      description: 'Complete preparation for UPSC Civil Services Examination',
      icon: 'Target',
      color: 'bg-red-100',
      categoryId: 'competitive-exams-prep',
      sortOrder: 1,
    },
    {
      id: 'ssc-banking',
      title: 'SSC & Banking Exams',
      description: 'Staff Selection Commission and Banking sector exams',
      icon: 'Building',
      color: 'bg-red-200',
      categoryId: 'competitive-exams-prep',
      sortOrder: 2,
    },
    // Professional Courses Paths
    {
      id: 'excel-mastery',
      title: 'Excel Mastery',
      description: 'From basics to advanced Excel for professional use',
      icon: 'Table',
      color: 'bg-indigo-100',
      categoryId: 'professional-skills',
      sortOrder: 2,
    },
    {
      id: 'python-programming',
      title: 'Python Programming',
      description: 'Learn Python from basics to advanced applications',
      icon: 'Code',
      color: 'bg-indigo-200',
      categoryId: 'technology-computer',
      sortOrder: 1,
    },
    // Life Skills Paths
    {
      id: 'communication-skills',
      title: 'Communication Skills',
      description: 'Effective communication for personal and professional life',
      icon: 'MessageCircle',
      color: 'bg-pink-100',
      categoryId: 'life-practical',
      sortOrder: 1,
    },
    {
      id: 'digital-literacy',
      title: 'Digital Literacy',
      description: 'Essential digital skills for the modern world',
      icon: 'Smartphone',
      color: 'bg-pink-200',
      categoryId: 'foundational',
      sortOrder: 1,
    },
  ]

  for (const path of learningPaths) {
    await prisma.learningPath.upsert({
      where: { id: path.id },
      update: {},
      create: {
        id: path.id,
        title: path.title,
        description: path.description,
        icon: path.icon,
        color: path.color,
        categoryId: path.categoryId,
        sortOrder: path.sortOrder,
        isActive: true,
      },
    })
    console.log(`✅ LearningPath created: ${path.title}`)
  }

  // ============================================================================
  // 4. CREATE DUMMY INSTRUCTOR
  // ============================================================================

  console.log('\n👨‍🏫 Creating Dummy Instructor...')

  const instructor = await prisma.instructor.upsert({
    where: { id: 'instructor-main' },
    update: {},
    create: {
      id: 'instructor-main',
      name: 'INR99 Academy Faculty',
      title: 'Senior Educator',
      bio: 'Expert educators from diverse fields providing quality education to Indian students.',
      expertise: 'General Education',
      isActive: true,
    },
  })
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // 5. CREATE SAMPLE COURSES FOR EACH CATEGORY
  // ============================================================================

  console.log('\n📖 Creating Sample Courses...')

  const courses = [
    // School Learning Courses
    {
      id: 'course-math-grade6',
      title: 'Mathematics Grade 6',
      description: 'Comprehensive mathematics course for Class 6 students covering integers, fractions, algebra, and geometry.',
      duration: 600,
      difficulty: 'BEGINNER' as const,
      categoryId: schoolCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-science-grade6',
      title: 'Science Grade 6',
      description: 'Explore the world of science with topics in physics, chemistry, biology, and environmental science.',
      duration: 540,
      difficulty: 'BEGINNER' as const,
      categoryId: schoolCategory.id,
      instructorId: instructor.id,
    },
    // College Foundation Courses
    {
      id: 'course-commerce-basics',
      title: 'Commerce Basics',
      description: 'Introduction to commerce, accountancy, business studies, and economics for college students.',
      duration: 900,
      difficulty: 'INTERMEDIATE' as const,
      categoryId: collegeCategory.id,
      instructorId: instructor.id,
    },
    // Career Skills Courses
    {
      id: 'course-communication',
      title: 'Effective Communication Skills',
      description: 'Master verbal and written communication for professional success.',
      duration: 480,
      difficulty: 'BEGINNER' as const,
      categoryId: careerCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-leadership',
      title: 'Leadership Fundamentals',
      description: 'Develop leadership skills and learn to inspire and manage teams effectively.',
      duration: 600,
      difficulty: 'INTERMEDIATE' as const,
      categoryId: careerCategory.id,
      instructorId: instructor.id,
    },
    // Money & Business Courses
    {
      id: 'course-personal-finance',
      title: 'Personal Finance Management',
      description: 'Learn budgeting, saving, investing, and financial planning for a secure future.',
      duration: 720,
      difficulty: 'BEGINNER' as const,
      categoryId: moneyCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-stock-market',
      title: 'Stock Market Basics',
      description: 'Understanding stock markets, trading, and investment strategies for beginners.',
      duration: 900,
      difficulty: 'INTERMEDIATE' as const,
      categoryId: moneyCategory.id,
      instructorId: instructor.id,
    },
    // Competitive Exams Courses
    {
      id: 'course-upsc-gs',
      title: 'UPSC General Studies',
      description: 'Complete coverage of UPSC General Studies Paper I - History, Geography, Polity, Economy, Environment.',
      duration: 3000,
      difficulty: 'ADVANCED' as const,
      categoryId: competitiveCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-ssc-cgl',
      title: 'SSC CGL Complete Course',
      description: 'Preparation for Staff Selection Commission Combined Graduate Level examination.',
      duration: 2400,
      difficulty: 'ADVANCED' as const,
      categoryId: competitiveCategory.id,
      instructorId: instructor.id,
    },
    // Professional Courses Courses
    {
      id: 'course-excel-advanced',
      title: 'Advanced Excel for Professionals',
      description: 'Master Excel formulas, pivot tables, macros, and data analysis for business use.',
      duration: 720,
      difficulty: 'INTERMEDIATE' as const,
      categoryId: professionalCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-python-beginner',
      title: 'Python for Beginners',
      description: 'Learn Python programming from scratch with practical examples and projects.',
      duration: 1200,
      difficulty: 'BEGINNER' as const,
      categoryId: professionalCategory.id,
      instructorId: instructor.id,
    },
    // Life Skills Courses
    {
      id: 'course-public-speaking',
      title: 'Public Speaking Mastery',
      description: 'Overcome stage fright and learn to speak confidently in front of audiences.',
      duration: 480,
      difficulty: 'BEGINNER' as const,
      categoryId: lifeSkillsCategory.id,
      instructorId: instructor.id,
    },
    {
      id: 'course-time-management',
      title: 'Time Management & Productivity',
      description: 'Learn techniques to manage time effectively and boost personal productivity.',
      duration: 360,
      difficulty: 'BEGINNER' as const,
      categoryId: lifeSkillsCategory.id,
      instructorId: instructor.id,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: null,
        duration: course.duration,
        difficulty: course.difficulty,
        isActive: true,
        instructorId: course.instructorId,
        categoryId: course.categoryId,
      },
    })
    console.log(`✅ Course created: ${course.title}`)
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - 7 Categories: School Learning, College Foundation, Career Skills, Money & Business, Competitive Exams, Professional Courses, Life Skills`)
  console.log(`   - ${learningPathCategories.length} Learning Path Categories`)
  console.log(`   - ${learningPaths.length} Learning Paths`)
  console.log(`   - ${courses.length} Sample Courses`)
  console.log('\n✅ All categories and learning paths are now available!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
