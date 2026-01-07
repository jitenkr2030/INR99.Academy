import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed SSC MTS (Multi-Tasking Staff) Preparation...')

  const courseId = 'ssc_mts'

  // Check if course already exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (existingCourse) {
    console.log(`⚠️ Course "${courseId}" already exists with ${existingCourse.lessons?.length || 0} lessons.`)
    console.log('🗑️ Deleting old lessons and course to recreate with proper structure...')
    
    // Delete associated lessons first
    await prisma.lesson.deleteMany({
      where: { courseId: courseId },
    })
    
    // Delete the course
    await prisma.course.delete({
      where: { id: courseId },
    })
    
    console.log('🗑️ Old course data deleted.')
  }

  // Find existing instructor
  const instructor = await prisma.instructor.findFirst({
    where: { isActive: true },
  })
  
  const instructorId = instructor?.id || 'inst-competitive-exams'

  // Create the course
  const course = await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      title: 'SSC MTS (Multi-Tasking Staff) Preparation',
      description: 'Master the SSC Multi-Tasking Staff examination with complete coverage of Quantitative Aptitude, Reasoning, English, and General Awareness for Paper I and Paper II.',
      thumbnail: '/assets/courses/ssc_mts.svg',
      difficulty: 'BEGINNER',
      duration: 2500, // 41h 40m in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the detailed curriculum
  const modules = [
    // Module 1: Quantitative Aptitude (20 lessons - orders 1-20)
    {
      moduleNum: 1,
      title: 'Quantitative Aptitude',
      lessons: [
        { title: 'Number System - Basics', duration: 30, order: 1 },
        { title: 'Number System - HCF & LCM', duration: 30, order: 2 },
        { title: 'Fractions & Decimals', duration: 30, order: 3 },
        { title: 'Percentages - Fundamentals', duration: 30, order: 4 },
        { title: 'Percentages - Applications', duration: 30, order: 5 },
        { title: 'Ratio & Proportion - Basics', duration: 30, order: 6 },
        { title: 'Ratio & Proportion - Problems', duration: 30, order: 7 },
        { title: 'Simple Interest', duration: 30, order: 8 },
        { title: 'Profit & Loss - Basics', duration: 30, order: 9 },
        { title: 'Profit & Loss - Advanced', duration: 30, order: 10 },
        { title: 'Time & Work - Basics', duration: 30, order: 11 },
        { title: 'Time & Work - Problems', duration: 30, order: 12 },
        { title: 'Speed, Distance & Time', duration: 30, order: 13 },
        { title: 'Averages', duration: 30, order: 14 },
        { title: 'Algebra - Basic Equations', duration: 30, order: 15 },
        { title: 'Data Interpretation - Tables', duration: 30, order: 16 },
        { title: 'Data Interpretation - Charts', duration: 30, order: 17 },
        { title: 'Shortcut Techniques', duration: 30, order: 18 },
        { title: 'Previous Year Questions Practice', duration: 30, order: 19 },
        { title: 'Mock Quiz - Quantitative Aptitude', duration: 30, order: 20 },
      ]
    },
    // Module 2: Reasoning & Logical Ability (16 lessons - orders 21-36)
    {
      moduleNum: 2,
      title: 'Reasoning & Logical Ability',
      lessons: [
        { title: 'Coding-Decoding - Basics', duration: 30, order: 21 },
        { title: 'Coding-Decoding - Advanced', duration: 30, order: 22 },
        { title: 'Number Series', duration: 30, order: 23 },
        { title: 'Alphabet Series', duration: 30, order: 24 },
        { title: 'Analogy & Classification', duration: 30, order: 25 },
        { title: 'Blood Relations', duration: 30, order: 26 },
        { title: 'Direction & Distance', duration: 30, order: 27 },
        { title: 'Seating Arrangement - Linear', duration: 30, order: 28 },
        { title: 'Seating Arrangement - Circular', duration: 30, order: 29 },
        { title: 'Non-Verbal Reasoning - Patterns', duration: 30, order: 30 },
        { title: 'Non-Verbal Reasoning - Visual Puzzles', duration: 30, order: 31 },
        { title: 'Mirror & Water Images', duration: 30, order: 32 },
        { title: 'Cube & Dice Problems', duration: 30, order: 33 },
        { title: 'Critical Thinking Strategies', duration: 30, order: 34 },
        { title: 'Sectional Quiz - Reasoning', duration: 30, order: 35 },
        { title: 'Practice Exercises', duration: 30, order: 36 },
      ]
    },
    // Module 3: English Language & Comprehension (16 lessons - orders 37-52)
    {
      moduleNum: 3,
      title: 'English Language & Comprehension',
      lessons: [
        { title: 'Grammar Basics Overview', duration: 30, order: 37 },
        { title: 'Tenses & Their Usage', duration: 30, order: 38 },
        { title: 'Articles & Prepositions', duration: 30, order: 39 },
        { title: 'Subject-Verb Agreement', duration: 30, order: 40 },
        { title: 'Noun, Pronoun & Adjective', duration: 30, order: 41 },
        { title: 'Verb, Adverb & Conjunction', duration: 30, order: 42 },
        { title: 'Sentence Correction', duration: 30, order: 43 },
        { title: 'Vocabulary Building', duration: 30, order: 44 },
        { title: 'Word Usage & Synonyms', duration: 30, order: 45 },
        { title: 'Idioms & Phrases', duration: 30, order: 46 },
        { title: 'Reading Comprehension - Strategies', duration: 30, order: 47 },
        { title: 'Reading Comprehension - Practice', duration: 30, order: 48 },
        { title: 'Error Spotting', duration: 30, order: 49 },
        { title: 'Para Jumbles', duration: 30, order: 50 },
        { title: 'Fill in the Blanks', duration: 30, order: 51 },
        { title: 'Mock Quiz - English', duration: 30, order: 52 },
      ]
    },
    // Module 4: General Awareness & Current Affairs (14 lessons - orders 53-66)
    {
      moduleNum: 4,
      title: 'General Awareness & Current Affairs',
      lessons: [
        { title: 'Indian History - Overview', duration: 30, order: 53 },
        { title: 'Indian Geography - Physical', duration: 30, order: 54 },
        { title: 'Indian Polity - Basics', duration: 30, order: 55 },
        { title: 'Indian Economy - Fundamentals', duration: 30, order: 56 },
        { title: 'Science - Physics Basics', duration: 30, order: 57 },
        { title: 'Science - Chemistry Basics', duration: 30, order: 58 },
        { title: 'Science - Biology Basics', duration: 30, order: 59 },
        { title: 'Current Affairs - National', duration: 30, order: 60 },
        { title: 'Current Affairs - International', duration: 30, order: 61 },
        { title: 'Government Schemes & Policies', duration: 30, order: 62 },
        { title: 'Environment & Ecology', duration: 30, order: 63 },
        { title: 'Technology & Computers', duration: 30, order: 64 },
        { title: 'MCQ Practice - General Awareness', duration: 30, order: 65 },
        { title: 'Current Affairs Compilation', duration: 30, order: 66 },
      ]
    },
    // Module 5: Mock Tests, Exam Strategy & Tips (17 lessons - orders 67-83)
    {
      moduleNum: 5,
      title: 'Mock Tests, Exam Strategy & Tips',
      lessons: [
        { title: 'Full-Length Mock Test 1 - Paper I', duration: 60, order: 67 },
        { title: 'Mock Test 1 - Detailed Discussion', duration: 30, order: 68 },
        { title: 'Full-Length Mock Test 2 - Paper I', duration: 60, order: 69 },
        { title: 'Mock Test 2 - Detailed Discussion', duration: 30, order: 70 },
        { title: 'Full-Length Mock Test 3 - Paper I', duration: 60, order: 71 },
        { title: 'Mock Test 3 - Detailed Discussion', duration: 30, order: 72 },
        { title: 'Paper II - Descriptive Writing Tips', duration: 30, order: 73 },
        { title: 'Paper II - Typing Practice', duration: 30, order: 74 },
        { title: 'Section-wise Performance Analysis', duration: 30, order: 75 },
        { title: 'Time Management Strategies', duration: 30, order: 76 },
        { title: 'Attempt Order & Technique', duration: 30, order: 77 },
        { title: 'Common Pitfalls to Avoid', duration: 30, order: 78 },
        { title: 'Negative Marking Strategy', duration: 20, order: 79 },
        { title: 'Quick Revision Tips', duration: 20, order: 80 },
        { title: 'Exam-Day Preparation', duration: 20, order: 81 },
        { title: 'Final Exam Checklist', duration: 20, order: 82 },
        { title: 'Confidence Building Techniques', duration: 20, order: 83 },
      ]
    },
  ]

  // Create all lessons
  let lessonCount = 0
  for (const moduleData of modules) {
    for (const lessonData of moduleData.lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          duration: lessonData.duration,
          order: lessonData.order,
          course: { connect: { id: courseId } },
          content: `Content for ${lessonData.title}`,
          videoUrl: `https://example.com/videos/${courseId}/lesson-${lessonData.order}.mp4`,
        },
      })
      lessonCount++
    }
    console.log(`✅ Created module: ${moduleData.title} (${moduleData.lessons.length} lessons)`)
  }

  console.log(`\n🎉 Successfully created ${lessonCount} lessons across ${modules.length} modules`)
  console.log('✨ SSC MTS (Multi-Tasking Staff) Preparation seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
