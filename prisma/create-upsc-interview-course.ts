import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed UPSC Interview (Personality Test) Masterclass...')

  const courseId = 'upsc_interview'

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
      title: 'UPSC Interview (Personality Test) Masterclass',
      description: 'Master the UPSC Civil Services Interview with comprehensive preparation including DAF analysis, current affairs discussion, mock interviews, personality development, and communication skills.',
      thumbnail: '/assets/courses/upsc_interview.svg',
      difficulty: 'ADVANCED',
      duration: 3000, // 50 hours in minutes
      instructorId: instructorId,
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // Create modules and lessons based on the user's detailed curriculum
  const modules = [
    {
      moduleNum: 1,
      title: 'UPSC Interview Orientation & Strategy',
      duration: 300, // 5 hours
      lessons: [
        { title: 'UPSC Interview Pattern & Marking Criteria', duration: 30, order: 1 },
        { title: 'Understanding Personality vs Knowledge Balance', duration: 30, order: 2 },
        { title: 'Interview Board Composition & Expectations', duration: 30, order: 3 },
        { title: 'Time Management & Preparation Roadmap', duration: 30, order: 4 },
        { title: 'Common Mistakes & Myths to Avoid', duration: 30, order: 5 },
        { title: 'Exam-Day Strategy & Mindset', duration: 30, order: 6 },
        { title: 'Building the Right Attitude', duration: 30, order: 7 },
        { title: 'Understanding the Interview Atmosphere', duration: 30, order: 8 },
      ]
    },
    {
      moduleNum: 2,
      title: 'DAF (Detailed Application Form) Analysis',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Importance of DAF in Interview Evaluation', duration: 30, order: 9 },
        { title: 'How Interviewers Analyze Your DAF', duration: 30, order: 10 },
        { title: 'Presenting Personal Background Effectively', duration: 30, order: 11 },
        { title: 'Academic Journey & Key Subjects', duration: 30, order: 12 },
        { title: 'Showcasing Achievements & Awards', duration: 30, order: 13 },
        { title: 'Career Background & Professional Experience', duration: 30, order: 14 },
        { title: 'Hobbies & Interests - Deep Dive Preparation', duration: 30, order: 15 },
        { title: 'Motivation for Civil Services', duration: 30, order: 16 },
        { title: 'Hometown & Local Issues Knowledge', duration: 30, order: 17 },
        { title: 'Current Residence & City Knowledge', duration: 30, order: 18 },
        { title: 'Service Preference Strategy', duration: 30, order: 19 },
        { title: 'Structuring DAF-Based Answers', duration: 30, order: 20 },
        { title: 'Practice: Sample DAF Questions', duration: 30, order: 21 },
        { title: 'Handling Sensitive DAF Entries', duration: 30, order: 22 },
        { title: 'DAF Rehearsal Techniques', duration: 30, order: 23 },
        { title: 'Mock DAF Discussion', duration: 30, order: 24 },
      ]
    },
    {
      moduleNum: 3,
      title: 'Current Affairs Mastery',
      duration: 600, // 10 hours
      lessons: [
        { title: 'National Current Affairs Overview', duration: 30, order: 25 },
        { title: 'International Developments & India', duration: 30, order: 26 },
        { title: 'Government Schemes & Policies', duration: 30, order: 27 },
        { title: 'Economic Developments & Reforms', duration: 30, order: 28 },
        { title: 'Environmental Issues & Climate Change', duration: 30, order: 29 },
        { title: 'Governance & Administrative Reforms', duration: 30, order: 30 },
        { title: 'Social Issues & Welfare Programs', duration: 30, order: 31 },
        { title: 'Science & Technology Developments', duration: 30, order: 32 },
        { title: 'Defense & Security Affairs', duration: 30, order: 33 },
        { title: 'International Relations & Diplomacy', duration: 30, order: 34 },
        { title: 'Reports & Indices (World Bank, IMF, etc.)', duration: 30, order: 35 },
        { title: 'Recent Judgments & Legal Developments', duration: 30, order: 36 },
        { title: 'Linking Current Affairs with Personal Answers', duration: 30, order: 37 },
        { title: 'Practice: Scenario-Based Questions', duration: 30, order: 38 },
        { title: 'Current Affairs Discussion Techniques', duration: 30, order: 39 },
        { title: 'Handling Unknown Topics Gracefully', duration: 30, order: 40 },
        { title: 'Current Affairs Mock Q&A', duration: 30, order: 41 },
        { title: 'Building Opinion on Contemporary Issues', duration: 30, order: 42 },
      ]
    },
    {
      moduleNum: 4,
      title: 'Communication & Personality Development',
      duration: 480, // 8 hours
      lessons: [
        { title: 'Effective Body Language Basics', duration: 30, order: 43 },
        { title: 'Posture & Sitting Position', duration: 30, order: 44 },
        { title: 'Eye Contact & Gaze Management', duration: 30, order: 45 },
        { title: 'Voice Modulation & Tone', duration: 30, order: 46 },
        { title: 'Articulation & Speaking Clearly', duration: 30, order: 47 },
        { title: 'Pacing Your Answers', duration: 30, order: 48 },
        { title: 'Confidence Building Exercises', duration: 30, order: 49 },
        { title: 'Stress Management Techniques', duration: 30, order: 50 },
        { title: 'Handling Nerves & Anxiety', duration: 30, order: 51 },
        { title: 'Tricky Questions Response Strategies', duration: 30, order: 52 },
        { title: 'Unexpected Questions Approach', duration: 30, order: 53 },
        { title: 'Dead Air Handling Techniques', duration: 30, order: 54 },
        { title: 'Grooming & Professional Appearance', duration: 30, order: 55 },
        { title: 'Dress Code & Etiquette', duration: 30, order: 56 },
        { title: 'Formal Communication Skills', duration: 30, order: 57 },
        { title: 'Active Listening in Interview', duration: 30, order: 58 },
      ]
    },
    {
      moduleNum: 5,
      title: 'Mock Interviews & Feedback',
      duration: 720, // 12 hours
      lessons: [
        { title: 'Setting Up Realistic Mock Interview', duration: 30, order: 59 },
        { title: 'Mock Interview Format & Structure', duration: 30, order: 60 },
        { title: 'Expert Evaluation Criteria', duration: 30, order: 61 },
        { title: 'Peer Evaluation Methods', duration: 30, order: 62 },
        { title: 'Common Pitfalls to Avoid', duration: 30, order: 63 },
        { title: 'Improvement Strategies Based on Feedback', duration: 30, order: 64 },
        { title: 'Answer Structuring Techniques', duration: 30, order: 65 },
        { title: 'Time Management During Interview', duration: 30, order: 66 },
        { title: 'Follow-Up Questions Handling', duration: 30, order: 67 },
        { title: 'Disagreement with Interviewers', duration: 30, order: 68 },
        { title: 'Personalized Feedback Analysis', duration: 30, order: 69 },
        { title: 'Performance Tracking & Improvement', duration: 30, order: 70 },
        { title: 'Full Mock Interview 1', duration: 45, order: 71 },
        { title: 'Full Mock Interview 2', duration: 45, order: 72 },
        { title: 'Full Mock Interview 3', duration: 45, order: 73 },
        { title: 'Mock Interview Feedback Review', duration: 30, order: 74 },
        { title: 'Board Interaction Simulation', duration: 30, order: 75 },
        { title: 'Continuous Practice Schedule', duration: 30, order: 76 },
        { title: 'Expert Panel Discussion', duration: 30, order: 77 },
        { title: 'Success Stories & Learning', duration: 30, order: 78 },
        { title: 'Final Mock Assessment', duration: 45, order: 79 },
      ]
    },
    {
      moduleNum: 6,
      title: 'Advanced Interview Strategies & Ethics',
      duration: 420, // 7 hours
      lessons: [
        { title: 'Ethical & Moral Dilemma Questions', duration: 30, order: 80 },
        { title: 'Values & Principles Based Questions', duration: 30, order: 81 },
        { title: 'Decision-Making Scenarios', duration: 30, order: 82 },
        { title: 'Situational Judgment Questions', duration: 30, order: 83 },
        { title: 'Multi-Dimensional Problem Solving', duration: 30, order: 84 },
        { title: 'Case Studies for Interview', duration: 30, order: 85 },
        { title: 'Strategic Answer Planning', duration: 30, order: 86 },
        { title: 'Consistency in Answers', duration: 30, order: 87 },
        { title: 'Balancing Honesty & Diplomacy', duration: 30, order: 88 },
        { title: 'Handling Hypothetical Questions', duration: 30, order: 89 },
        { title: 'Administrative Perspective Questions', duration: 30, order: 90 },
        { title: 'Policy & Governance Questions', duration: 30, order: 91 },
        { title: 'Social Service & Public Interest', duration: 30, order: 92 },
        { title: 'Pre-Interview Checklist', duration: 20, order: 93 },
        { title: 'Final Confidence Building', duration: 20, order: 94 },
        { title: 'Day Before Interview Preparation', duration: 20, order: 95 },
        { title: 'Interview Day Ready Routine', duration: 20, order: 96 },
        { title: 'Post-Interview Reflection', duration: 20, order: 97 },
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
  console.log('✨ UPSC Interview Masterclass seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
