/**
 * Seed Script: TET (Teacher Eligibility Test) Complete Preparation
 * Course ID: state_tet
 * Total Lessons: 115
 * 7 Modules with proper lesson ordering (module grouping handled at API level)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Starting TET (Teacher Eligibility Test) Complete Preparation...')
  console.log(`📚 Course ID: state_tet`)
  console.log(`📖 Total Lessons: 115`)
  console.log(`📦 Modules: 7 (grouped by lesson order at API level)`)
  console.log('')

  const courseId = 'state_tet'

  // Verify course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    console.error(`❌ Course with ID "${courseId}" not found!`)
    console.error('Please run populate-competitive-2.ts first to create the course.')
    process.exit(1)
  }

  console.log(`✅ Course found: ${course.title}`)
  console.log('')

  // ============================================================================
  // DEFINE LESSONS BY MODULE (Grouped by order ranges at API level)
  // Module 1: Lessons 1-18 (Child Development and Pedagogy)
  // Module 2: Lessons 19-45 (Language I - Hindi)
  // Module 3: Lessons 46-68 (Language II - English)
  // Module 4: Lessons 69-87 (Mathematics)
  // Module 5: Lessons 88-103 (Environmental Studies)
  // Module 6: Lessons 104-111 (Science)
  // Module 7: Lessons 112-115 (Practice Tests & Mock Exams)
  // ============================================================================

  const lessons: Array<{
    id: string
    title: string
    duration: number
    order: number
    type: string
    isFree: boolean
    content: string
    courseId: string
  }> = []

  // Module 1: Child Development and Pedagogy (Lessons 1-18)
  const module1Lessons = [
    { title: 'Introduction to Child Development', duration: 25, type: 'video', isFree: true },
    { title: 'Stages of Child Development', duration: 30, type: 'video', isFree: false },
    { title: 'Physical Development in Children', duration: 28, type: 'video', isFree: false },
    { title: 'Cognitive Development Theories', duration: 35, type: 'video', isFree: false },
    { title: 'Piaget\'s Theory of Cognitive Development', duration: 32, type: 'video', isFree: false },
    { title: 'Vygotsky\'s Sociocultural Theory', duration: 30, type: 'video', isFree: false },
    { title: 'Language Development in Children', duration: 28, type: 'video', isFree: false },
    { title: 'Social and Emotional Development', duration: 30, type: 'video', isFree: false },
    { title: 'Moral Development Theories', duration: 25, type: 'video', isFree: false },
    { title: 'Individual Differences in Development', duration: 28, type: 'video', isFree: false },
    { title: 'Factors Affecting Child Development', duration: 32, type: 'video', isFree: false },
    { title: 'Heredity and Environment', duration: 30, type: 'video', isFree: false },
    { title: 'Learning Theories - Behaviorism', duration: 28, type: 'video', isFree: false },
    { title: 'Constructivist Learning Theory', duration: 32, type: 'video', isFree: false },
    { title: 'Multiple Intelligences Theory', duration: 30, type: 'video', isFree: false },
    { title: 'Intelligence and its Measurement', duration: 28, type: 'video', isFree: false },
    { title: 'Personality Development in Children', duration: 25, type: 'video', isFree: false },
    { title: 'Understanding Diverse Learners', duration: 30, type: 'video', isFree: false },
  ]

  // Module 2: Language I - Hindi (Lessons 19-45)
  const module2Lessons = [
    { title: 'Introduction to Hindi Language', duration: 25, type: 'video', isFree: false },
    { title: 'Hindi Vowels (Swar) - Detailed Study', duration: 35, type: 'video', isFree: false },
    { title: 'Hindi Consonants (Vyanjan) - Part 1', duration: 32, type: 'video', isFree: false },
    { title: 'Hindi Consonants (Vyanjan) - Part 2', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Matras - Vowel Signs', duration: 35, type: 'video', isFree: false },
    { title: 'Sanjna (Compound Letters)', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Grammar - Sandhi', duration: 28, type: 'video', isFree: false },
    { title: 'Hindi Grammar - Samas', duration: 32, type: 'video', isFree: false },
    { title: 'Ras and Alankar in Hindi', duration: 35, type: 'video', isFree: false },
    { title: 'Hindi Syntax and Sentence Structure', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Vocabulary Development', duration: 28, type: 'video', isFree: false },
    { title: 'Hindi Reading Comprehension', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Writing Skills', duration: 32, type: 'video', isFree: false },
    { title: 'Hindi Paragraph Writing', duration: 28, type: 'video', isFree: false },
    { title: 'Hindi Letter Writing', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Essay Writing', duration: 35, type: 'video', isFree: false },
    { title: 'Unseen Passage in Hindi', duration: 28, type: 'video', isFree: false },
    { title: 'Hindi Pedagogy and Teaching Methods', duration: 30, type: 'video', isFree: false },
    { title: 'Teaching Hindi as a Language', duration: 32, type: 'video', isFree: false },
    { title: 'Assessment in Hindi Language', duration: 28, type: 'video', isFree: false },
    { title: 'Remedial Teaching in Hindi', duration: 30, type: 'video', isFree: false },
    { title: 'Hindi Literature - Poets and Authors', duration: 35, type: 'video', isFree: false },
    { title: 'Hindi Proverbs and Idioms', duration: 28, type: 'video', isFree: false },
    { title: 'One Word Substitution in Hindi', duration: 25, type: 'video', isFree: false },
    { title: 'Antonyms and Synonyms in Hindi', duration: 28, type: 'video', isFree: false },
    { title: 'Hindi Word Formation', duration: 30, type: 'video', isFree: false },
    { title: 'Common Errors in Hindi', duration: 28, type: 'video', isFree: false },
  ]

  // Module 3: Language II - English (Lessons 46-68)
  const module3Lessons = [
    { title: 'Introduction to English Language Teaching', duration: 25, type: 'video', isFree: false },
    { title: 'English Phonetics and Pronunciation', duration: 35, type: 'video', isFree: false },
    { title: 'English Grammar - Parts of Speech', duration: 32, type: 'video', isFree: false },
    { title: 'English Tenses - Complete Guide', duration: 40, type: 'video', isFree: false },
    { title: 'Subject-Verb Agreement', duration: 30, type: 'video', isFree: false },
    { title: 'Articles (A, An, The)', duration: 28, type: 'video', isFree: false },
    { title: 'Prepositions in English', duration: 32, type: 'video', isFree: false },
    { title: 'Conjunctions and Interjections', duration: 28, type: 'video', isFree: false },
    { title: 'Active and Passive Voice', duration: 35, type: 'video', isFree: false },
    { title: 'Direct and Indirect Speech', duration: 32, type: 'video', isFree: false },
    { title: 'English Sentence Patterns', duration: 30, type: 'video', isFree: false },
    { title: 'Vocabulary Building Techniques', duration: 28, type: 'video', isFree: false },
    { title: 'Reading Comprehension Strategies', duration: 32, type: 'video', isFree: false },
    { title: 'English Writing Skills', duration: 30, type: 'video', isFree: false },
    { title: 'Letter Writing in English', duration: 28, type: 'video', isFree: false },
    { title: 'Essay Writing in English', duration: 35, type: 'video', isFree: false },
    { title: 'Precis Writing', duration: 30, type: 'video', isFree: false },
    { title: 'English Pedagogy Methods', duration: 32, type: 'video', isFree: false },
    { title: 'Teaching English to Young Learners', duration: 30, type: 'video', isFree: false },
    { title: 'English Language Assessment', duration: 28, type: 'video', isFree: false },
    { title: 'Common Errors in English', duration: 32, type: 'video', isFree: false },
    { title: 'English Idioms and Phrases', duration: 28, type: 'video', isFree: false },
    { title: 'Fill in the Blanks Practice', duration: 25, type: 'video', isFree: false },
  ]

  // Module 4: Mathematics (Lessons 69-87)
  const module4Lessons = [
    { title: 'Number System - Whole Numbers', duration: 30, type: 'video', isFree: false },
    { title: 'Number System - Fractions and Decimals', duration: 35, type: 'video', isFree: false },
    { title: 'Integers and Rational Numbers', duration: 32, type: 'video', isFree: false },
    { title: 'LCM and HCF - Methods and Applications', duration: 35, type: 'video', isFree: false },
    { title: 'Square and Square Roots', duration: 30, type: 'video', isFree: false },
    { title: 'Cube and Cube Roots', duration: 28, type: 'video', isFree: false },
    { title: 'Percentage - Complete Concept', duration: 35, type: 'video', isFree: false },
    { title: 'Ratio and Proportion', duration: 32, type: 'video', isFree: false },
    { title: 'Profit and Loss', duration: 30, type: 'video', isFree: false },
    { title: 'Simple and Compound Interest', duration: 35, type: 'video', isFree: false },
    { title: 'Algebraic Expressions', duration: 32, type: 'video', isFree: false },
    { title: 'Linear Equations', duration: 30, type: 'video', isFree: false },
    { title: 'Geometry - Lines and Angles', duration: 35, type: 'video', isFree: false },
    { title: 'Geometry - Triangles and Quadrilaterals', duration: 38, type: 'video', isFree: false },
    { title: 'Circles and its Properties', duration: 32, type: 'video', isFree: false },
    { title: 'Perimeter and Area', duration: 30, type: 'video', isFree: false },
    { title: 'Volume and Surface Area', duration: 35, type: 'video', isFree: false },
    { title: 'Data Handling and Statistics', duration: 32, type: 'video', isFree: false },
    { title: 'Teaching Mathematics Effectively', duration: 30, type: 'video', isFree: false },
  ]

  // Module 5: Environmental Studies (Lessons 88-103)
  const module5Lessons = [
    { title: 'Introduction to Environmental Studies', duration: 25, type: 'video', isFree: false },
    { title: 'Our Environment - Components', duration: 28, type: 'video', isFree: false },
    { title: 'Ecosystem and Food Chain', duration: 32, type: 'video', isFree: false },
    { title: 'Natural Resources - Types and Conservation', duration: 35, type: 'video', isFree: false },
    { title: 'Water Resources and Conservation', duration: 30, type: 'video', isFree: false },
    { title: 'Forest Resources', duration: 28, type: 'video', isFree: false },
    { title: 'Wildlife and Biodiversity', duration: 32, type: 'video', isFree: false },
    { title: 'Air Pollution - Causes and Effects', duration: 30, type: 'video', isFree: false },
    { title: 'Water Pollution and its Control', duration: 32, type: 'video', isFree: false },
    { title: 'Soil and Land Pollution', duration: 28, type: 'video', isFree: false },
    { title: 'Solid Waste Management', duration: 30, type: 'video', isFree: false },
    { title: 'Environmental Conservation Methods', duration: 32, type: 'video', isFree: false },
    { title: 'Climate Change and Global Warming', duration: 35, type: 'video', isFree: false },
    { title: 'Sustainable Development', duration: 30, type: 'video', isFree: false },
    { title: 'Environmental Education in Schools', duration: 28, type: 'video', isFree: false },
    { title: 'Teaching EVS Effectively', duration: 25, type: 'video', isFree: false },
  ]

  // Module 6: Science (Lessons 104-111)
  const module6Lessons = [
    { title: 'Matter - States and Properties', duration: 35, type: 'video', isFree: false },
    { title: 'Atoms and Molecules', duration: 38, type: 'video', isFree: false },
    { title: 'Chemical Reactions and Equations', duration: 40, type: 'video', isFree: false },
    { title: 'Acids, Bases and Salts', duration: 35, type: 'video', isFree: false },
    { title: 'Motion and Laws of Motion', duration: 38, type: 'video', isFree: false },
    { title: 'Work, Energy and Power', duration: 36, type: 'video', isFree: false },
    { title: 'Sound and its Properties', duration: 32, type: 'video', isFree: false },
    { title: 'Light and Optics', duration: 35, type: 'video', isFree: false },
    { title: 'Electricity and Magnetism', duration: 38, type: 'video', isFree: false },
    { title: 'Living World - Classification', duration: 32, type: 'video', isFree: false },
    { title: 'Cell - Structure and Function', duration: 35, type: 'video', isFree: false },
    { title: 'Plant and Animal Kingdom', duration: 38, type: 'video', isFree: false },
    { title: 'Human Body Systems', duration: 40, type: 'video', isFree: false },
    { title: 'Reproduction in Plants and Animals', duration: 35, type: 'video', isFree: false },
    { title: 'Heredity and Evolution', duration: 38, type: 'video', isFree: false },
    { title: 'Teaching Science Effectively', duration: 30, type: 'video', isFree: false },
  ]

  // Module 7: Practice Tests & Mock Exams (Lessons 112-115)
  const module7Lessons = [
    { title: 'TET Full Length Mock Test 1', duration: 150, type: 'quiz', isFree: false },
    { title: 'TET Full Length Mock Test 2', duration: 150, type: 'quiz', isFree: false },
    { title: 'TET Full Length Mock Test 3', duration: 150, type: 'quiz', isFree: false },
    { title: 'Previous Year Papers Discussion', duration: 120, type: 'video', isFree: false },
  ]

  // Combine all modules with proper ordering
  const allLessons = [
    ...module1Lessons,
    ...module2Lessons,
    ...module3Lessons,
    ...module4Lessons,
    ...module5Lessons,
    ...module6Lessons,
    ...module7Lessons,
  ]

  console.log(`📚 Creating ${allLessons.length} lessons...`)

  let lessonOrder = 1
  for (const lessonData of allLessons) {
    const lesson = {
      id: `${courseId}-lesson-${lessonOrder}`,
      title: lessonData.title,
      duration: lessonData.duration,
      order: lessonOrder,
      content: JSON.stringify({
        title: lessonData.title,
        module: lessonOrder <= 18 ? 'Child Development and Pedagogy' :
                lessonOrder <= 45 ? 'Language I (Hindi)' :
                lessonOrder <= 68 ? 'Language II (English)' :
                lessonOrder <= 87 ? 'Mathematics' :
                lessonOrder <= 103 ? 'Environmental Studies' :
                lessonOrder <= 111 ? 'Science' :
                'Practice Tests & Mock Exams',
        type: lessonData.type,
        isFree: lessonData.isFree,
        objectives: [],
        keyConcepts: [],
        summary: '',
        resources: []
      }),
      courseId: courseId,
    }
    
    lessons.push(lesson as any)
    lessonOrder++
  }

  // Insert all lessons in batches to avoid timeout
  const batchSize = 20
  let createdCount = 0
  
  for (let i = 0; i < lessons.length; i += batchSize) {
    const batch = lessons.slice(i, i + batchSize)
    
    for (const lessonData of batch) {
      await prisma.lesson.upsert({
        where: { id: lessonData.id },
        update: lessonData,
        create: lessonData,
      })
      createdCount++
    }
    
    console.log(`  ✅ Created lessons ${i + 1} to ${Math.min(i + batchSize, lessons.length)}`)
  }

  console.log('')
  console.log('🎉 TET Course lessons created successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Course: ${course.title}`)
  console.log(`   - Course ID: ${courseId}`)
  console.log(`   - Total Lessons: ${lessons.length}`)
  console.log(`   - Free Lessons: ${lessons.filter((l: any) => l.isFree).length}`)
  console.log('')
  console.log('📚 Module-wise Breakdown (by lesson order):')
  console.log(`   Module 1: Lessons 1-18 - Child Development and Pedagogy (${module1Lessons.length} lessons)`)
  console.log(`   Module 2: Lessons 19-45 - Language I (Hindi) (${module2Lessons.length} lessons)`)
  console.log(`   Module 3: Lessons 46-68 - Language II (English) (${module3Lessons.length} lessons)`)
  console.log(`   Module 4: Lessons 69-87 - Mathematics (${module4Lessons.length} lessons)`)
  console.log(`   Module 5: Lessons 88-103 - Environmental Studies (${module5Lessons.length} lessons)`)
  console.log(`   Module 6: Lessons 104-111 - Science (${module6Lessons.length} lessons)`)
  console.log(`   Module 7: Lessons 112-115 - Practice Tests & Mock Exams (${module7Lessons.length} lessons)`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
