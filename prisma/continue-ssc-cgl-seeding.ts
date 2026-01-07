import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Continuing SSC CGL Complete Preparation Course seeding...')

  const courseId = 'ssc_cgl'

  // Check if course exists
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!existingCourse) {
    console.log(`❌ Course "${courseId}" not found. Please run the main seeder first.`)
    return
  }

  // Get existing lesson count
  const existingLessons = existingCourse.lessons || []
  const maxOrder = existingLessons.length > 0 
    ? Math.max(...existingLessons.map(l => l.order))
    : 0

  console.log(`📊 Course found with ${existingLessons.length} lessons (max order: ${maxOrder})`)

  // Module 3: English Language & Comprehension (lessons 77-106)
  const module3Lessons = [
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

  // Module 4: General Awareness & Current Affairs (lessons 107-136)
  const module4Lessons = [
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

  // Module 5: Mock Tests, Exam Strategy & Tips (lessons 137-167)
  const module5Lessons = [
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

  const allRemainingLessons = [...module3Lessons, ...module4Lessons, ...module5Lessons]

  let addedCount = 0
  for (const lessonData of allRemainingLessons) {
    // Skip if lesson already exists
    const exists = existingLessons.some(l => l.order === lessonData.order)
    if (exists) {
      console.log(`⏭️  Skipping lesson ${lessonData.order}: ${lessonData.title} (already exists)`)
      continue
    }

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
    addedCount++
    console.log(`✅ Created lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Get final count
  const finalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  })

  const totalLessons = finalCourse?.lessons?.length || 0

  console.log(`\n🎉 SSC CGL Complete Preparation Course seeding completed!`)
  console.log(`📊 Total lessons: ${totalLessons}`)
  console.log(`📝 Lessons added in this run: ${addedCount}`)
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
