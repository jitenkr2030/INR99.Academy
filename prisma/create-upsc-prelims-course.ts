import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed UPSC Civil Services Prelims Complete Guide...')

  const courseId = 'upsc_prelims'

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
    console.log(`⚠️ Course "${courseId}" already exists with ${existingCourse.lessons.length} lessons.`)
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
      title: 'UPSC Civil Services Prelims Complete Guide',
      description: 'Master the UPSC Civil Services Preliminary Examination with comprehensive coverage of General Studies Paper I and Paper II (CSAT). Includes current affairs, history, geography, polity, economy, environment, and aptitude.',
      thumbnail: '/assets/courses/upsc_prelims.svg',
      difficulty: 'ADVANCED',
      duration: 6000, // 100 hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the user's detailed curriculum
  const modules = [
    {
      moduleNum: 1,
      title: 'UPSC Prelims Orientation & Strategy',
      duration: 240, // 4 hours
      lessons: [
        { title: 'UPSC Exam Structure & Stages', duration: 30, order: 1 },
        { title: 'Prelims Syllabus Decoding', duration: 30, order: 2 },
        { title: 'GS vs CSAT Weightage Analysis', duration: 30, order: 3 },
        { title: 'Cut-off Analysis (Last 10 Years)', duration: 30, order: 4 },
        { title: 'Smart Study Planning for Working Aspirants', duration: 30, order: 5 },
        { title: 'Common Mistakes & Myth Busting', duration: 30, order: 6 },
        { title: 'Understanding the Examination Pattern', duration: 30, order: 7 },
        { title: 'Resource Selection & Time Allocation', duration: 30, order: 8 },
      ]
    },
    {
      moduleNum: 2,
      title: 'History (Ancient, Medieval, Modern)',
      duration: 840, // 14 hours
      lessons: [
        { title: 'Ancient Indian History - Culture & Heritage', duration: 45, order: 9 },
        { title: 'Ancient Indian History - Archaeological Evidence', duration: 45, order: 10 },
        { title: 'Medieval India Overview - Dynasties', duration: 45, order: 11 },
        { title: 'Medieval India - Art & Architecture', duration: 45, order: 12 },
        { title: 'Modern India - Background to 1857', duration: 45, order: 13 },
        { title: '1857 Revolt - Causes & Impact', duration: 45, order: 14 },
        { title: 'British Raj - Policies & Administration', duration: 45, order: 15 },
        { title: 'Freedom Struggle - Phase by Phase', duration: 45, order: 16 },
        { title: 'Important Personalities in Freedom Movement', duration: 45, order: 17 },
        { title: 'Post-Independence Integration', duration: 45, order: 18 },
        { title: 'Art & Culture Basics for UPSC', duration: 45, order: 19 },
        { title: 'Previous Year Questions Mapping', duration: 45, order: 20 },
        { title: 'MCQ Practice - History', duration: 45, order: 21 },
        { title: 'Timeline & Chronology记忆技巧', duration: 45, order: 22 },
      ]
    },
    {
      moduleNum: 3,
      title: 'Indian & World Geography',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Physical Geography Fundamentals', duration: 45, order: 23 },
        { title: 'Geomorphic Processes', duration: 45, order: 24 },
        { title: 'Indian Physiography - Mountains & Plateaus', duration: 45, order: 25 },
        { title: 'Indian Physiography - Plains & Coastal Regions', duration: 45, order: 26 },
        { title: 'Climate & Monsoon Systems', duration: 45, order: 27 },
        { title: 'Rivers & Water Resources', duration: 45, order: 28 },
        { title: 'Soil & Agriculture Geography', duration: 45, order: 29 },
        { title: 'World Geography - Continents', duration: 45, order: 30 },
        { title: 'Oceanography Basics', duration: 45, order: 31 },
        { title: 'Biogeography & Ecological Regions', duration: 45, order: 32 },
        { title: 'Map-Based Questions Practice', duration: 45, order: 33 },
        { title: 'Indian Geography - Complete Overview', duration: 45, order: 34 },
      ]
    },
    {
      moduleNum: 4,
      title: 'Indian Polity & Governance',
      duration: 840, // 14 hours
      lessons: [
        { title: 'Indian Constitution - Features & Evolution', duration: 45, order: 35 },
        { title: 'Important Amendments to Constitution', duration: 45, order: 36 },
        { title: 'Fundamental Rights - Complete Coverage', duration: 45, order: 37 },
        { title: 'Directive Principles of State Policy', duration: 45, order: 38 },
        { title: 'Fundamental Duties', duration: 30, order: 39 },
        { title: 'Parliament Structure & Functioning', duration: 45, order: 40 },
        { title: 'State Legislatures', duration: 45, order: 41 },
        { title: 'Executive - President, PM & Council of Ministers', duration: 45, order: 42 },
        { title: 'Judiciary - Supreme Court & High Courts', duration: 45, order: 43 },
        { title: 'Constitutional Bodies - UPSC, SSC, Election Commission', duration: 45, order: 44 },
        { title: 'Non-Constitutional Bodies', duration: 45, order: 45 },
        { title: 'Governance & Current Affairs Linkage', duration: 45, order: 46 },
        { title: 'Local Governance - Panchayats & Municipalities', duration: 45, order: 47 },
        { title: 'Polity MCQ Practice', duration: 45, order: 48 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Indian Economy',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Basic Economic Concepts', duration: 45, order: 49 },
        { title: 'National Income & GDP', duration: 45, order: 50 },
        { title: 'Economic Growth & Development', duration: 45, order: 51 },
        { title: 'Inflation - Types & Control', duration: 45, order: 52 },
        { title: 'Fiscal Policy & Budget', duration: 45, order: 53 },
        { title: 'Monetary Policy & RBI', duration: 45, order: 54 },
        { title: 'Banking System in India', duration: 45, order: 55 },
        { title: 'Financial Institutions', duration: 45, order: 56 },
        { title: 'Economic Survey Overview', duration: 45, order: 57 },
        { title: 'Five Year Plans & Planning Commission', duration: 45, order: 58 },
        { title: 'Taxation System', duration: 45, order: 59 },
        { title: 'Economy-Based MCQs', duration: 45, order: 60 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Environment, Ecology & Biodiversity',
      duration: 600, // 10 hours
      lessons: [
        { title: 'Ecosystems & Food Chains', duration: 45, order: 61 },
        { title: 'Biodiversity - Flora & Fauna', duration: 45, order: 62 },
        { title: 'Climate Change - Global & Indian Context', duration: 45, order: 63 },
        { title: 'International Conventions & Agreements', duration: 45, order: 64 },
        { title: 'Protected Areas - National Parks & Sanctuaries', duration: 45, order: 65 },
        { title: 'Endangered Species in India', duration: 45, order: 66 },
        { title: 'Environmental Laws & Institutions', duration: 45, order: 67 },
        { title: 'Current Environmental Issues', duration: 45, order: 68 },
        { title: 'Sustainable Development Goals', duration: 45, order: 69 },
        { title: 'High-Yield UPSC Environment Topics', duration: 45, order: 70 },
      ]
    },
    {
      moduleNum: 7,
      title: 'Current Affairs (Integrated)',
      duration: 600, // 10 hours
      lessons: [
        { title: 'National Current Affairs Overview', duration: 45, order: 71 },
        { title: 'International Relations Basics', duration: 45, order: 72 },
        { title: 'Important Government Schemes', duration: 45, order: 73 },
        { title: 'Reports & Indices', duration: 45, order: 74 },
        { title: 'Science & Technology Developments', duration: 45, order: 75 },
        { title: 'Defense & Security Affairs', duration: 45, order: 76 },
        { title: 'Sports Current Affairs', duration: 30, order: 77 },
        { title: 'Awards & Recognitions', duration: 30, order: 78 },
        { title: 'Current Affairs MCQ Practice', duration: 45, order: 79 },
        { title: 'Static-Current Linkage Method', duration: 45, order: 80 },
      ]
    },
    {
      moduleNum: 8,
      title: 'CSAT - Quantitative Aptitude',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Number System Basics', duration: 45, order: 81 },
        { title: 'Percentages & Ratios', duration: 45, order: 82 },
        { title: 'Time, Speed & Distance', duration: 45, order: 83 },
        { title: 'Time & Work', duration: 45, order: 84 },
        { title: 'Averages & Mixtures', duration: 45, order: 85 },
        { title: 'Simple & Compound Interest', duration: 45, order: 86 },
        { title: 'Data Interpretation Basics', duration: 45, order: 87 },
        { title: 'Tables & Bar Graphs', duration: 45, order: 88 },
        { title: 'Pie Charts & Line Graphs', duration: 45, order: 89 },
        { title: 'Mental Math Techniques', duration: 45, order: 90 },
      ]
    },
    {
      moduleNum: 9,
      title: 'CSAT - Reasoning & Comprehension',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Logical Reasoning Fundamentals', duration: 45, order: 91 },
        { title: 'Series & Sequences', duration: 45, order: 92 },
        { title: 'Analytical Reasoning', duration: 45, order: 93 },
        { title: 'Blood Relations', duration: 30, order: 94 },
        { title: 'Direction Sense', duration: 30, order: 95 },
        { title: 'Syllogisms', duration: 45, order: 96 },
        { title: 'Decision Making', duration: 45, order: 97 },
        { title: 'Reading Comprehension Strategies', duration: 45, order: 98 },
        { title: 'Passage Analysis', duration: 45, order: 99 },
        { title: 'CSAT Qualifying Approach', duration: 45, order: 100 },
      ]
    },
    {
      moduleNum: 10,
      title: 'Revision, Tests & Exam Readiness',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Subject-wise Revision Plans', duration: 45, order: 101 },
        { title: 'MCQ Elimination Techniques', duration: 45, order: 102 },
        { title: 'Full-length Mock Test Discussion', duration: 45, order: 103 },
        { title: 'Time Management on Exam Day', duration: 45, order: 104 },
        { title: 'Final Revision Checklist', duration: 30, order: 105 },
        { title: 'Prelims Mindset Training', duration: 30, order: 106 },
        { title: 'Stress Management', duration: 30, order: 107 },
        { title: 'Mock Test 1 - Discussion', duration: 45, order: 108 },
        { title: 'Mock Test 2 - Discussion', duration: 45, order: 109 },
        { title: 'Last Minute Preparation Tips', duration: 30, order: 110 },
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

  console.log(`🎉 Successfully created ${lessonCount} lessons across ${modules.length} modules`)
  console.log('✨ UPSC Civil Services Prelims course seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
