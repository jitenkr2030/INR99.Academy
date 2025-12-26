import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding courses and lessons to match landing page claims...')

  // Additional courses to reach 50+ total (without subcategory constraints)
  const additionalCourses = [
    // Web Development Courses
    {
      id: 'course8',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming',
      difficulty: 'INTERMEDIATE',
      duration: 320,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp1',
    },
    {
      id: 'course9',
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript to add static typing to your JavaScript projects',
      difficulty: 'INTERMEDIATE',
      duration: 280,
      instructorId: 'inst1',
      categoryId: 'cat1',
      learningPathId: 'lp1',
    },
    {
      id: 'course10',
      title: 'Vue.js Development',
      description: 'Build modern web applications with Vue.js framework',
      difficulty: 'INTERMEDIATE',
      duration: 290,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course11',
      title: 'Angular Framework',
      description: 'Complete guide to building applications with Angular',
      difficulty: 'ADVANCED',
      duration: 350,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course12',
      title: 'Python Programming',
      description: 'Learn Python programming from basics to advanced concepts',
      difficulty: 'BEGINNER',
      duration: 260,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course13',
      title: 'Django Web Framework',
      description: 'Build web applications with Django framework',
      difficulty: 'INTERMEDIATE',
      duration: 310,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course14',
      title: 'iOS App Development with Swift',
      description: 'Build native iOS applications using Swift',
      difficulty: 'INTERMEDIATE',
      duration: 340,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course15',
      title: 'React Native Development',
      description: 'Build cross-platform mobile apps with React Native',
      difficulty: 'INTERMEDIATE',
      duration: 330,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course16',
      title: 'Flutter Development',
      description: 'Create beautiful mobile apps with Flutter',
      difficulty: 'INTERMEDIATE',
      duration: 320,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course17',
      title: 'Database Design with SQL',
      description: 'Master database design principles and SQL',
      difficulty: 'INTERMEDIATE',
      duration: 270,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course18',
      title: 'MongoDB and NoSQL Databases',
      description: 'Learn NoSQL databases with MongoDB',
      difficulty: 'INTERMEDIATE',
      duration: 250,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },
    {
      id: 'course19',
      title: 'Redis and Caching',
      description: 'Master Redis for caching and performance optimization',
      difficulty: 'ADVANCED',
      duration: 200,
      instructorId: 'inst1',
      categoryId: 'cat1',
    },

    // Design Courses
    {
      id: 'course20',
      title: 'Adobe Photoshop Mastery',
      description: 'Complete guide to Adobe Photoshop for designers',
      difficulty: 'BEGINNER',
      duration: 220,
      instructorId: 'inst2',
      categoryId: 'cat2',
      learningPathId: 'lp2',
    },
    {
      id: 'course21',
      title: 'Adobe Illustrator Fundamentals',
      description: 'Learn vector graphics with Adobe Illustrator',
      difficulty: 'BEGINNER',
      duration: 240,
      instructorId: 'inst2',
      categoryId: 'cat2',
      learningPathId: 'lp2',
    },
    {
      id: 'course22',
      title: 'Prototyping with Figma',
      description: 'Create interactive prototypes in Figma',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst2',
      categoryId: 'cat2',
      learningPathId: 'lp2',
    },
    {
      id: 'course23',
      title: 'User Testing and Research',
      description: 'Learn user testing methodologies and research techniques',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst2',
      categoryId: 'cat2',
      learningPathId: 'lp2',
    },
    {
      id: 'course24',
      title: 'Information Architecture',
      description: 'Design effective information architecture for digital products',
      difficulty: 'INTERMEDIATE',
      duration: 160,
      instructorId: 'inst2',
      categoryId: 'cat2',
    },
    {
      id: 'course25',
      title: 'Motion Design with After Effects',
      description: 'Create engaging motion graphics with After Effects',
      difficulty: 'ADVANCED',
      duration: 280,
      instructorId: 'inst2',
      categoryId: 'cat2',
    },
    {
      id: 'course26',
      title: '3D Design with Blender',
      description: 'Introduction to 3D modeling and design with Blender',
      difficulty: 'INTERMEDIATE',
      duration: 300,
      instructorId: 'inst2',
      categoryId: 'cat2',
    },

    // Business & Finance Courses
    {
      id: 'course27',
      title: 'Stock Market Investing',
      description: 'Learn to invest in the stock market with confidence',
      difficulty: 'INTERMEDIATE',
      duration: 240,
      instructorId: 'inst3',
      categoryId: 'cat3',
      learningPathId: 'lp3',
    },
    {
      id: 'course28',
      title: 'Real Estate Investment',
      description: 'Guide to investing in real estate properties',
      difficulty: 'INTERMEDIATE',
      duration: 220,
      instructorId: 'inst3',
      categoryId: 'cat3',
      learningPathId: 'lp3',
    },
    {
      id: 'course29',
      title: 'Cryptocurrency and Blockchain',
      description: 'Understanding cryptocurrency and blockchain technology',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst3',
      categoryId: 'cat3',
    },
    {
      id: 'course30',
      title: 'Business Plan Development',
      description: 'Create comprehensive business plans for startups',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst4',
      categoryId: 'cat3',
    },
    {
      id: 'course31',
      title: 'Digital Marketing Strategy',
      description: 'Develop effective digital marketing strategies',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },
    {
      id: 'course32',
      title: 'Social Media Marketing',
      description: 'Master social media marketing for business growth',
      difficulty: 'BEGINNER',
      duration: 160,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },
    {
      id: 'course33',
      title: 'SEO Fundamentals',
      description: 'Learn search engine optimization basics',
      difficulty: 'BEGINNER',
      duration: 180,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },
    {
      id: 'course34',
      title: 'Content Marketing',
      description: 'Create effective content marketing strategies',
      difficulty: 'INTERMEDIATE',
      duration: 190,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },
    {
      id: 'course35',
      title: 'Email Marketing',
      description: 'Master email marketing campaigns and automation',
      difficulty: 'BEGINNER',
      duration: 140,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },
    {
      id: 'course36',
      title: 'Google Ads and PPC',
      description: 'Learn Google Ads and pay-per-click advertising',
      difficulty: 'INTERMEDIATE',
      duration: 170,
      instructorId: 'inst4',
      categoryId: 'cat3',
      learningPathId: 'lp4',
    },

    // Data Science Courses
    {
      id: 'course37',
      title: 'Data Analysis with Python',
      description: 'Learn data analysis using Python and pandas',
      difficulty: 'INTERMEDIATE',
      duration: 280,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course38',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning concepts',
      difficulty: 'INTERMEDIATE',
      duration: 320,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course39',
      title: 'Deep Learning with TensorFlow',
      description: 'Build neural networks with TensorFlow',
      difficulty: 'ADVANCED',
      duration: 360,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course40',
      title: 'Data Visualization',
      description: 'Create compelling data visualizations',
      difficulty: 'INTERMEDIATE',
      duration: 200,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course41',
      title: 'SQL for Data Science',
      description: 'Master SQL for data analysis and science',
      difficulty: 'BEGINNER',
      duration: 180,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course42',
      title: 'R Programming for Statistics',
      description: 'Learn R programming for statistical analysis',
      difficulty: 'INTERMEDIATE',
      duration: 240,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },
    {
      id: 'course43',
      title: 'Big Data with Hadoop',
      description: 'Introduction to big data processing with Hadoop',
      difficulty: 'ADVANCED',
      duration: 300,
      instructorId: 'inst1',
      categoryId: 'cat4',
    },

    // Digital Marketing Courses
    {
      id: 'course44',
      title: 'Facebook Marketing',
      description: 'Master Facebook marketing and advertising',
      difficulty: 'BEGINNER',
      duration: 150,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course45',
      title: 'Instagram Marketing',
      description: 'Leverage Instagram for business growth',
      difficulty: 'BEGINNER',
      duration: 140,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course46',
      title: 'LinkedIn Marketing',
      description: 'Professional marketing strategies for LinkedIn',
      difficulty: 'INTERMEDIATE',
      duration: 160,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course47',
      title: 'YouTube Marketing',
      description: 'Build and grow a YouTube channel for business',
      difficulty: 'INTERMEDIATE',
      duration: 180,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course48',
      title: 'Influencer Marketing',
      description: 'Learn influencer marketing strategies',
      difficulty: 'INTERMEDIATE',
      duration: 170,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course49',
      title: 'Marketing Analytics',
      description: 'Measure and analyze marketing campaign performance',
      difficulty: 'INTERMEDIATE',
      duration: 190,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
    {
      id: 'course50',
      title: 'Affiliate Marketing',
      description: 'Build passive income through affiliate marketing',
      difficulty: 'BEGINNER',
      duration: 160,
      instructorId: 'inst4',
      categoryId: 'cat5',
      learningPathId: 'lp4',
    },
  ]

  // Create additional courses
  await prisma.course.createMany({
    data: additionalCourses,
  })

  console.log(`✅ Added ${additionalCourses.length} additional courses`)

  // Generate lessons for all courses (aiming for 500+ total)
  const lessonTemplates = {
    'Web Development': [
      'Introduction to {topic}',
      'Setting up your development environment',
      'Core concepts and fundamentals',
      'Best practices and conventions',
      'Common patterns and solutions',
      'Advanced techniques and optimizations',
      'Real-world project implementation',
      'Testing and debugging strategies',
      'Performance optimization',
      'Deployment and production considerations'
    ],
    'Design': [
      'Understanding design principles',
      'Tools and software overview',
      'Creating your first design',
      'Color theory and typography',
      'Layout and composition',
      'User-centered design approach',
      'Design systems and consistency',
      'Prototyping and iteration',
      'Collaboration and feedback',
      'Finalizing and exporting designs'
    ],
    'Business & Finance': [
      'Introduction to {topic}',
      'Key concepts and terminology',
      'Market analysis and research',
      'Strategy development',
      'Implementation planning',
      'Risk management',
      'Performance measurement',
      'Optimization techniques',
      'Case studies and examples',
      'Future trends and opportunities'
    ],
    'Data Science': [
      'Introduction to data science',
      'Data collection and cleaning',
      'Exploratory data analysis',
      'Statistical foundations',
      'Machine learning algorithms',
      'Model evaluation and validation',
      'Feature engineering',
      'Advanced modeling techniques',
      'Visualization and communication',
      'Ethical considerations'
    ],
    'Digital Marketing': [
      'Introduction to {topic}',
      'Platform overview and features',
      'Audience targeting strategies',
      'Content creation best practices',
      'Campaign planning and execution',
      'Budget management and optimization',
      'Analytics and reporting',
      'A/B testing and experimentation',
      'Integration with other channels',
      'Advanced strategies and automation'
    ]
  }

  // Get all courses
  const allCourses = await prisma.course.findMany()
  
  let totalLessonsCreated = 0
  const lessonsToCreate = []

  for (const course of allCourses) {
    const courseCategory = course.categoryId === 'cat1' ? 'Web Development' :
                         course.categoryId === 'cat2' ? 'Design' :
                         course.categoryId === 'cat3' ? 'Business & Finance' :
                         course.categoryId === 'cat4' ? 'Data Science' : 'Digital Marketing'
    
    const templates = lessonTemplates[courseCategory] || lessonTemplates['Web Development']
    const lessonCount = Math.floor(Math.random() * 8) + 8 // 8-15 lessons per course
    
    for (let i = 0; i < lessonCount; i++) {
      const template = templates[i % templates.length]
      const topic = course.title.split(' ')[0] // Get first word of course title
      
      lessonsToCreate.push({
        courseId: course.id,
        title: template.replace('{topic}', topic),
        content: `Comprehensive lesson on ${template.replace('{topic}', topic)} for ${course.title}. This lesson covers essential concepts, practical examples, and hands-on exercises.`,
        duration: Math.floor(Math.random() * 25) + 10, // 10-35 minutes per lesson
        order: i + 1,
        isActive: true,
      })
      totalLessonsCreated++
    }
  }

  // Create all lessons in batches
  const batchSize = 100
  for (let i = 0; i < lessonsToCreate.length; i += batchSize) {
    const batch = lessonsToCreate.slice(i, i + batchSize)
    await prisma.lesson.createMany({
      data: batch,
    })
  }

  console.log(`✅ Created ${totalLessonsCreated} lessons across ${allCourses.length} courses`)

  console.log('🎉 Database population complete!')
  console.log(`📊 Final Stats:`)
  console.log(`   - Learning Paths: 4`)
  console.log(`   - Courses: ${allCourses.length}`)
  console.log(`   - Lessons: ${totalLessonsCreated}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })