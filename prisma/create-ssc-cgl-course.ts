import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed SSC CGL Complete Preparation Course...')

  const courseId = 'ssc_cgl'

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
      title: 'SSC CGL Complete Preparation Course',
      description: 'Master the SSC Combined Graduate Level examination with complete coverage of Quantitative Aptitude, Reasoning, English, and General Awareness for Tier I and Tier II exams.',
      thumbnail: '/assets/courses/ssc_cgl.svg',
      difficulty: 'INTERMEDIATE',
      duration: 5000, // 83h 20m in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the detailed curriculum
  const modules = [
    // Module 1: Quantitative Aptitude (40 lessons - orders 1-40)
    {
      moduleNum: 1,
      title: 'Quantitative Aptitude',
      lessons: [
        { title: 'Number System - Fundamentals', duration: 30, order: 1 },
        { title: 'Number System - HCF & LCM', duration: 30, order: 2 },
        { title: 'Number System - Fractions & Decimals', duration: 30, order: 3 },
        { title: 'Percentages - Basics & Calculations', duration: 30, order: 4 },
        { title: 'Percentages - Profit & Loss Applications', duration: 30, order: 5 },
        { title: 'Ratio & Proportion - Fundamentals', duration: 30, order: 6 },
        { title: 'Ratio & Proportion - Advanced Problems', duration: 30, order: 7 },
        { title: 'Simple Interest - Concepts & Problems', duration: 30, order: 8 },
        { title: 'Compound Interest - Concepts & Problems', duration: 30, order: 9 },
        { title: 'Algebra - Basic Equations', duration: 30, order: 10 },
        { title: 'Algebra - Polynomials & Identities', duration: 30, order: 11 },
        { title: 'Geometry - Lines, Angles & Triangles', duration: 30, order: 12 },
        { title: 'Geometry - Quadrilaterals & Polygons', duration: 30, order: 13 },
        { title: 'Geometry - Circles & Chords', duration: 30, order: 14 },
        { title: 'Mensuration - Areas & Perimeters', duration: 30, order: 15 },
        { title: 'Mensuration - Volumes & Surface Areas', duration: 30, order: 16 },
        { title: 'Trigonometry - Ratios & Identities', duration: 30, order: 17 },
        { title: 'Trigonometry - Height & Distance', duration: 30, order: 18 },
        { title: 'Time & Work - Basics', duration: 30, order: 19 },
        { title: 'Time & Work - Advanced Problems', duration: 30, order: 20 },
        { title: 'Speed, Distance & Time', duration: 30, order: 21 },
        { title: 'Averages - Concepts & Applications', duration: 30, order: 22 },
        { title: 'Profit & Loss - Advanced', duration: 30, order: 23 },
        { title: 'Discount & Partnership', duration: 30, order: 24 },
        { title: 'Data Interpretation - Tables', duration: 30, order: 25 },
        { title: 'Data Interpretation - Bar Graphs', duration: 30, order: 26 },
        { title: 'Data Interpretation - Pie Charts', duration: 30, order: 27 },
        { title: 'Data Interpretation - Line Graphs', duration: 30, order: 28 },
        { title: 'Mixture & Alligation', duration: 30, order: 29 },
        { title: 'Permutation & Combination', duration: 30, order: 30 },
        { title: 'Probability Basics', duration: 30, order: 31 },
        { title: 'Shortcut Techniques - Vedic Math', duration: 30, order: 32 },
        { title: 'Shortcut Techniques - Calculation Hacks', duration: 30, order: 33 },
        { title: 'Previous Year Questions - Set 1', duration: 30, order: 34 },
        { title: 'Previous Year Questions - Set 2', duration: 30, order: 35 },
        { title: 'Practice Exercise - Arithmetic', duration: 30, order: 36 },
        { title: 'Practice Exercise - Advanced Math', duration: 30, order: 37 },
        { title: 'Mock Quiz - Quantitative Aptitude', duration: 30, order: 38 },
        { title: 'Speed Improvement Drills', duration: 30, order: 39 },
        { title: 'Common Mistakes to Avoid', duration: 30, order: 40 },
      ]
    },
    // Module 2: Reasoning & Logical Ability (36 lessons - orders 41-76)
    {
      moduleNum: 2,
      title: 'Reasoning & Logical Ability',
      lessons: [
        { title: 'Coding-Decoding - Basics', duration: 30, order: 41 },
        { title: 'Coding-Decoding - Advanced Patterns', duration: 30, order: 42 },
        { title: 'Syllogisms - Fundamentals', duration: 30, order: 43 },
        { title: 'Syllogisms - Venn Diagrams', duration: 30, order: 44 },
        { title: 'Analogy - Word & Number', duration: 30, order: 45 },
        { title: 'Classification - Odd One Out', duration: 30, order: 46 },
        { title: 'Series - Number Series', duration: 30, order: 47 },
        { title: 'Series - Alphabet Series', duration: 30, order: 48 },
        { title: 'Missing Number Patterns', duration: 30, order: 49 },
        { title: 'Blood Relations - Family Tree', duration: 30, order: 50 },
        { title: 'Blood Relations - Coded Relations', duration: 30, order: 51 },
        { title: 'Direction & Distance - Basics', duration: 30, order: 52 },
        { title: 'Direction & Distance - Advanced', duration: 30, order: 53 },
        { title: 'Seating Arrangement - Linear', duration: 30, order: 54 },
        { title: 'Seating Arrangement - Circular', duration: 30, order: 55 },
        { title: 'Seating Arrangement - Complex', duration: 30, order: 56 },
        { title: 'Puzzle Solving - Methodologies', duration: 30, order: 57 },
        { title: 'Puzzle Solving - Practice', duration: 30, order: 58 },
        { title: 'Inequality - Direct & Coded', duration: 30, order: 59 },
        { title: 'Statement & Assumptions', duration: 30, order: 60 },
        { title: 'Statement & Arguments', duration: 30, order: 61 },
        { title: 'Course of Action', duration: 30, order: 62 },
        { title: 'Conclusion & Inference', duration: 30, order: 63 },
        { title: 'Non-Verbal Reasoning - Mirror Images', duration: 30, order: 64 },
        { title: 'Non-Verbal Reasoning - Water Images', duration: 30, order: 65 },
        { title: 'Non-Verbal Reasoning - Paper Cutting', duration: 30, order: 66 },
        { title: 'Non-Verbal Reasoning - Paper Folding', duration: 30, order: 67 },
        { title: 'Non-Verbal Reasoning - Embedded Figures', duration: 30, order: 68 },
        { title: 'Non-Verbal Reasoning - Figure Formation', duration: 30, order: 69 },
        { title: 'Cube & Dice Problems', duration: 30, order: 70 },
        { title: 'Calendar Problems', duration: 30, order: 71 },
        { title: 'Clock Problems', duration: 30, order: 72 },
        { title: 'Ranking & Order', duration: 30, order: 73 },
        { title: 'Critical Thinking Strategies', duration: 30, order: 74 },
        { title: 'Practice Exercises - Verbal', duration: 30, order: 75 },
        { title: 'Practice Exercises - Non-Verbal', duration: 30, order: 76 },
      ]
    },
    // Module 3: English Language & Comprehension (30 lessons - orders 77-106)
    {
      moduleNum: 3,
      title: 'English Language & Comprehension',
      lessons: [
        { title: 'Grammar Overview & Basics', duration: 30, order: 77 },
        { title: 'Nouns - Types & Usage', duration: 30, order: 78 },
        { title: 'Pronouns - Types & Rules', duration: 30, order: 79 },
        { title: 'Verbs - Types & Agreement', duration: 30, order: 80 },
        { title: 'Tenses - All Forms', duration: 30, order: 81 },
        { title: 'Articles - A, An, The', duration: 30, order: 82 },
        { title: 'Prepositions - Common Usage', duration: 30, order: 83 },
        { title: 'Conjunctions & Interjections', duration: 30, order: 84 },
        { title: 'Adjectives & Adverbs', duration: 30, order: 85 },
        { title: 'Subject-Verb Agreement', duration: 30, order: 86 },
        { title: 'Active & Passive Voice', duration: 30, order: 87 },
        { title: 'Direct & Indirect Speech', duration: 30, order: 88 },
        { title: 'Sentence Structure & Types', duration: 30, order: 89 },
        { title: 'Error Spotting - Basics', duration: 30, order: 90 },
        { title: 'Error Spotting - Advanced', duration: 30, order: 91 },
        { title: 'Sentence Improvement', duration: 30, order: 92 },
        { title: 'Fill in the Blanks', duration: 30, order: 93 },
        { title: 'Para Jumbles', duration: 30, order: 94 },
        { title: 'Reading Comprehension - Strategies', duration: 30, order: 95 },
        { title: 'Reading Comprehension - Practice Passages', duration: 30, order: 96 },
        { title: 'Vocabulary - Word Formation', duration: 30, order: 97 },
        { title: 'Vocabulary - Synonyms & Antonyms', duration: 30, order: 98 },
        { title: 'Idioms & Phrases', duration: 30, order: 99 },
        { title: 'One Word Substitution', duration: 30, order: 100 },
        { title: 'Spelling Correction', duration: 30, order: 101 },
        { title: 'Cloze Test', duration: 30, order: 102 },
        { title: 'Phrase Replacement', duration: 30, order: 103 },
        { title: 'Practice Exercise - Grammar', duration: 30, order: 104 },
        { title: 'Practice Exercise - Vocabulary', duration: 30, order: 105 },
        { title: 'Mock Quiz - English', duration: 30, order: 106 },
      ]
    },
    // Module 4: General Awareness & Current Affairs (30 lessons - orders 107-136)
    {
      moduleNum: 4,
      title: 'General Awareness & Current Affairs',
      lessons: [
        { title: 'Indian History - Ancient Civilization', duration: 30, order: 107 },
        { title: 'Indian History - Medieval Period', duration: 30, order: 108 },
        { title: 'Indian History - Modern Era', duration: 30, order: 109 },
        { title: 'Indian Freedom Struggle', duration: 30, order: 110 },
        { title: 'Indian Geography - Physical Features', duration: 30, order: 111 },
        { title: 'Indian Geography - Rivers & Mountains', duration: 30, order: 112 },
        { title: 'Indian Geography - States & Capitals', duration: 30, order: 113 },
        { title: 'World Geography - Continents & Oceans', duration: 30, order: 114 },
        { title: 'Indian Polity - Constitution', duration: 30, order: 115 },
        { title: 'Indian Polity - Governance', duration: 30, order: 116 },
        { title: 'Indian Polity - Fundamental Rights', duration: 30, order: 117 },
        { title: 'Indian Economy - Basics', duration: 30, order: 118 },
        { title: 'Indian Economy - Sectors & Growth', duration: 30, order: 119 },
        { title: 'Indian Economy - Budget & Finance', duration: 30, order: 120 },
        { title: 'Physics - Fundamentals', duration: 30, order: 121 },
        { title: 'Chemistry - Basics', duration: 30, order: 122 },
        { title: 'Biology - Human Body Systems', duration: 30, order: 123 },
        { title: 'Biology - Plants & Ecology', duration: 30, order: 124 },
        { title: 'Computer Awareness - Basics', duration: 30, order: 125 },
        { title: 'Computer Awareness - MS Office', duration: 30, order: 126 },
        { title: 'Current Affairs - National Events', duration: 30, order: 127 },
        { title: 'Current Affairs - International Events', duration: 30, order: 128 },
        { title: 'Government Schemes & Policies', duration: 30, order: 129 },
        { title: 'Important Organizations & Headquarters', duration: 30, order: 130 },
        { title: 'Awards & Honors', duration: 30, order: 131 },
        { title: 'Sports & Games', duration: 30, order: 132 },
        { title: 'Books & Authors', duration: 30, order: 133 },
        { title: 'Environment & Ecology', duration: 30, order: 134 },
        { title: 'General Knowledge Quiz Practice', duration: 30, order: 135 },
        { title: 'Current Affairs Compilation', duration: 30, order: 136 },
      ]
    },
    // Module 5: Mock Tests, Exam Strategy & Tips (31 lessons - orders 137-167)
    {
      moduleNum: 5,
      title: 'Mock Tests, Exam Strategy & Tips',
      lessons: [
        { title: 'Full-Length Mock Test 1 - Tier I', duration: 60, order: 137 },
        { title: 'Mock Test 1 - Detailed Solutions', duration: 30, order: 138 },
        { title: 'Full-Length Mock Test 2 - Tier I', duration: 60, order: 139 },
        { title: 'Mock Test 2 - Detailed Solutions', duration: 30, order: 140 },
        { title: 'Full-Length Mock Test 3 - Tier I', duration: 60, order: 141 },
        { title: 'Mock Test 3 - Detailed Solutions', duration: 30, order: 142 },
        { title: 'Full-Length Mock Test 4 - Tier I', duration: 60, order: 143 },
        { title: 'Mock Test 4 - Detailed Solutions', duration: 30, order: 144 },
        { title: 'Full-Length Mock Test 1 - Tier II (Paper I)', duration: 60, order: 145 },
        { title: 'Mock Test 1 Tier II - Detailed Solutions', duration: 30, order: 146 },
        { title: 'Full-Length Mock Test 2 - Tier II (Paper I)', duration: 60, order: 147 },
        { title: 'Mock Test 2 Tier II - Detailed Solutions', duration: 30, order: 148 },
        { title: 'Full-Length Mock Test 3 - Tier II (Paper I)', duration: 60, order: 149 },
        { title: 'Mock Test 3 Tier II - Detailed Solutions', duration: 30, order: 150 },
        { title: 'Section-wise Performance Analysis', duration: 30, order: 151 },
        { title: 'Time Management Strategies', duration: 30, order: 152 },
        { title: 'Attempt Order & Technique', duration: 30, order: 153 },
        { title: 'Sectional Time Allocation', duration: 30, order: 154 },
        { title: 'Negative Marking Strategy', duration: 30, order: 155 },
        { title: 'Common Pitfalls to Avoid', duration: 30, order: 156 },
        { title: 'Tips for Accuracy', duration: 30, order: 157 },
        { title: 'Quick Revision Tips', duration: 30, order: 158 },
        { title: 'Exam-Day Preparation Guide', duration: 30, order: 159 },
        { title: 'Final Exam Checklist', duration: 30, order: 160 },
        { title: 'Stress Management', duration: 30, order: 161 },
        { title: 'Confidence Building Techniques', duration: 30, order: 162 },
        { title: 'Last Minute Preparation Strategy', duration: 30, order: 163 },
        { title: 'Tier I vs Tier II Differences', duration: 30, order: 164 },
        { title: 'Understanding Marking Scheme', duration: 30, order: 165 },
        { title: 'Normalization Process Explained', duration: 30, order: 166 },
        { title: 'Final Mock Test - Full Simulation', duration: 60, order: 167 },
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
  console.log('✨ SSC CGL Complete Preparation Course seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
