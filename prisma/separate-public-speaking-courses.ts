import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Restructuring Public Speaking courses...\n')

  // First, delete existing lessons from both courses
  console.log('🗑️ Deleting existing lessons...')
  await prisma.lesson.deleteMany({
    where: {
      courseId: { in: ['career14', 'course_public_speaking'] }
    }
  })

  // Update course difficulties
  console.log('📝 Updating course levels...')
  await prisma.course.update({
    where: { id: 'career14' },
    data: {
      difficulty: 'INTERMEDIATE',
      title: 'Public Speaking & Presentation',
      description: 'Master public speaking and professional presentations. Build a strong foundation in communication skills.'
    }
  })

  await prisma.course.update({
    where: { id: 'course_public_speaking' },
    data: {
      difficulty: 'ADVANCED',
      title: 'Public Speaking & Presentation: Impact & Influence',
      description: 'Master public speaking and professional presentations. Transform your communication skills from basic to extraordinary.'
    }
  })

  // Intermediate Course (career14) - 6 modules, 30 lessons
  console.log('📚 Creating INTERMEDIATE course with 6 modules (30 lessons)...')
  
  const intermediateLessons = [
    // Module 1: Foundation of Public Speaking (5 lessons)
    { order: 101, title: 'Understanding Your Speaking Identity', duration: 15, courseId: 'career14' },
    { order: 102, title: 'The Science of Overcoming Nerves', duration: 18, courseId: 'career14' },
    { order: 103, title: 'Building Confidence as a Speaker', duration: 16, courseId: 'career14' },
    { order: 104, title: 'Basic Breathing and Voice Projection', duration: 14, courseId: 'career14' },
    { order: 105, title: 'Your First Presentation Setup', duration: 12, courseId: 'career14' },

    // Module 2: Structuring Your Message (5 lessons)
    { order: 201, title: 'Crafting a Clear Opening', duration: 18, courseId: 'career14' },
    { order: 202, title: 'Organizing Your Main Points', duration: 20, courseId: 'career14' },
    { order: 203, title: 'Using Stories to Connect', duration: 15, courseId: 'career14' },
    { order: 204, title: 'Creating Memorable Closures', duration: 12, courseId: 'career14' },
    { order: 205, title: 'Practice and Rehearsal Techniques', duration: 18, courseId: 'career14' },

    // Module 3: Voice and Delivery (5 lessons)
    { order: 301, title: 'Volume and Projection', duration: 15, courseId: 'career14' },
    { order: 302, title: 'Pace and Timing', duration: 18, courseId: 'career14' },
    { order: 303, title: 'Eliminating Filler Words', duration: 16, courseId: 'career14' },
    { order: 304, title: 'Tone and Emotional Expression', duration: 14, courseId: 'career14' },
    { order: 305, title: 'Virtual Presentation Basics', duration: 17, courseId: 'career14' },

    // Module 4: Body Language (5 lessons)
    { order: 401, title: 'Confident Posture and Stance', duration: 16, courseId: 'career14' },
    { order: 402, title: 'Purposeful Hand Gestures', duration: 18, courseId: 'career14' },
    { order: 403, title: 'Eye Contact Fundamentals', duration: 15, courseId: 'career14' },
    { order: 404, title: 'Facial Expressions', duration: 14, courseId: 'career14' },
    { order: 405, title: 'Movement on Stage', duration: 13, courseId: 'career14' },

    // Module 5: Audience Connection (5 lessons)
    { order: 501, title: 'Reading Your Audience', duration: 17, courseId: 'career14' },
    { order: 502, title: 'Asking Engaging Questions', duration: 16, courseId: 'career14' },
    { order: 503, title: 'Using Humor Appropriately', duration: 18, courseId: 'career14' },
    { order: 504, title: 'Handling Nerves Q&A', duration: 15, courseId: 'career14' },
    { order: 505, title: 'Managing Difficult Audiences', duration: 14, courseId: 'career14' },

    // Module 6: Practical Application (5 lessons)
    { order: 601, title: 'The Elevator Pitch', duration: 15, courseId: 'career14' },
    { order: 602, title: 'Introducing Someone Professionally', duration: 18, courseId: 'career14' },
    { order: 603, title: 'Virtual Meeting Presentations', duration: 20, courseId: 'career14' },
    { order: 604, title: 'Recording and Self-Evaluation', duration: 16, courseId: 'career14' },
    { order: 605, title: 'Your Personal Action Plan', duration: 12, courseId: 'career14' },
  ]

  for (const lesson of intermediateLessons) {
    await prisma.lesson.create({
      data: {
        id: `${lesson.courseId}_lesson_${lesson.order}`,
        courseId: lesson.courseId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Content for: ${lesson.title}`,
        isActive: true,
      }
    })
  }
  console.log('✅ Created 30 lessons for INTERMEDIATE course')

  // Advanced Course (course_public_speaking) - 10 modules, 50 lessons
  console.log('📚 Creating ADVANCED course with 10 modules (50 lessons)...')

  const advancedLessons = [
    // Module 1: The Psychology of Performance (5 lessons)
    { order: 101, title: 'Understanding Your Speaking Identity', duration: 15, courseId: 'course_public_speaking' },
    { order: 102, title: 'The Science of Adrenaline and Performance', duration: 18, courseId: 'course_public_speaking' },
    { order: 103, title: 'Reframing Nervous Energy into Power', duration: 16, courseId: 'course_public_speaking' },
    { order: 104, title: 'Conquering Imposter Syndrome', duration: 14, courseId: 'course_public_speaking' },
    { order: 105, title: 'Building Pre-Presentation Rituals', duration: 12, courseId: 'course_public_speaking' },

    // Module 2: Advanced Presentation Structure (5 lessons)
    { order: 201, title: 'Crafting a Compelling Opening Hook', duration: 18, courseId: 'course_public_speaking' },
    { order: 202, title: 'The Narrative Arc in Business Presentations', duration: 20, courseId: 'course_public_speaking' },
    { order: 203, title: 'Mastering Smooth Transitions Between Ideas', duration: 15, courseId: 'course_public_speaking' },
    { order: 204, title: 'The Strategic Use of Pauses and Silence', duration: 12, courseId: 'course_public_speaking' },
    { order: 205, title: 'Designing Memorable Closures and Calls to Action', duration: 18, courseId: 'course_public_speaking' },

    // Module 3: Visual Rhetoric and Slide Design (5 lessons)
    { order: 301, title: 'Cognitive Load Theory for Presentations', duration: 16, courseId: 'course_public_speaking' },
    { order: 302, title: 'Creating Impactful Data Visualizations', duration: 20, courseId: 'course_public_speaking' },
    { order: 303, title: 'Beyond Bullet Points: Visual Storytelling', duration: 18, courseId: 'course_public_speaking' },
    { order: 304, title: 'The 10-20-30 Rule and Modern Adaptations', duration: 14, courseId: 'course_public_speaking' },
    { order: 305, title: 'Interacting with Slides Without Breaking Flow', duration: 15, courseId: 'course_public_speaking' },

    // Module 4: Vocal Mastery and Delivery (5 lessons)
    { order: 401, title: 'Diaphragmatic Breathing and Voice Projection', duration: 15, courseId: 'course_public_speaking' },
    { order: 402, title: 'Finding Your Authoritative Voice', duration: 18, courseId: 'course_public_speaking' },
    { order: 403, title: 'Mastering Pace, Tempo, and Rhythm', duration: 16, courseId: 'course_public_speaking' },
    { order: 404, title: 'Eliminating Filler Words Effectively', duration: 14, courseId: 'course_public_speaking' },
    { order: 405, title: 'Using Tonal Variety to Convey Emotion', duration: 17, courseId: 'course_public_speaking' },

    // Module 5: Body Language and Presence (5 lessons)
    { order: 501, title: 'The Power Stance and Confident Physiology', duration: 16, courseId: 'course_public_speaking' },
    { order: 502, title: 'Purposeful Gestures and Movement', duration: 18, courseId: 'course_public_speaking' },
    { order: 503, title: 'Eye Contact Strategies for Any Audience Size', duration: 15, courseId: 'course_public_speaking' },
    { order: 504, title: 'Stage Anchoring and Strategic Movement', duration: 14, courseId: 'course_public_speaking' },
    { order: 505, title: 'Facial Expressions and Emotional Connection', duration: 13, courseId: 'course_public_speaking' },

    // Module 6: Audience Engagement and Dynamics (5 lessons)
    { order: 601, title: 'Reading and Calibrating to Your Audience', duration: 17, courseId: 'course_public_speaking' },
    { order: 602, title: 'Interactive Elements and Participation Techniques', duration: 16, courseId: 'course_public_speaking' },
    { order: 603, title: 'Using Humor Professionally and Safely', duration: 18, courseId: 'course_public_speaking' },
    { order: 604, title: 'Handling Difficult Audience Behaviors', duration: 15, courseId: 'course_public_speaking' },
    { order: 605, title: 'Customizing Content for Different Stakeholders', duration: 14, courseId: 'course_public_speaking' },

    // Module 7: The Art of Persuasion (5 lessons)
    { order: 701, title: 'Ethos, Pathos, and Logos in Modern Presentations', duration: 18, courseId: 'course_public_speaking' },
    { order: 702, title: 'The Rule of Three and Rhetorical Devices', duration: 16, courseId: 'course_public_speaking' },
    { order: 703, title: 'Crafting Powerful Analogies and Metaphors', duration: 17, courseId: 'course_public_speaking' },
    { order: 704, title: 'Leveraging Social Proof and Authority', duration: 15, courseId: 'course_public_speaking' },
    { order: 705, title: 'Framing and Anchoring for Maximum Impact', duration: 16, courseId: 'course_public_speaking' },

    // Module 8: Handling the Unexpected (5 lessons)
    { order: 801, title: 'Preparing for Q&A Sessions', duration: 14, courseId: 'course_public_speaking' },
    { order: 802, title: 'Bridging Techniques for Difficult Questions', duration: 16, courseId: 'course_public_speaking' },
    { order: 803, title: 'Managing Hostile Questions and Hecklers', duration: 15, courseId: 'course_public_speaking' },
    { order: 804, title: 'Recovering from Technical Difficulties', duration: 13, courseId: 'course_public_speaking' },
    { order: 805, title: 'Gracefully Handling the Unknown', duration: 12, courseId: 'course_public_speaking' },

    // Module 9: Virtual and Hybrid Presentations (5 lessons)
    { order: 901, title: 'Camera Eye Contact for Virtual Impact', duration: 15, courseId: 'course_public_speaking' },
    { order: 902, title: 'Professional Lighting and Audio Setup', duration: 18, courseId: 'course_public_speaking' },
    { order: 903, title: 'Maintaining Engagement on Video Calls', duration: 16, courseId: 'course_public_speaking' },
    { order: 904, title: 'Screen Sharing and Virtual Presentation Tools', duration: 14, courseId: 'course_public_speaking' },
    { order: 905, title: 'Hybrid Presentation Mastery', duration: 17, courseId: 'course_public_speaking' },

    // Module 10: Professional Application and Capstone (5 lessons)
    { order: 1001, title: 'Crafting the Perfect Elevator Pitch', duration: 15, courseId: 'course_public_speaking' },
    { order: 1002, title: 'Panel Discussion Participation and Moderation', duration: 18, courseId: 'course_public_speaking' },
    { order: 1003, title: 'Keynote Speaking Fundamentals', duration: 20, courseId: 'course_public_speaking' },
    { order: 1004, title: 'Building Your Personal Presentation Style', duration: 16, courseId: 'course_public_speaking' },
    { order: 1005, title: 'Creating Your Development Action Plan', duration: 12, courseId: 'course_public_speaking' },
  ]

  for (const lesson of advancedLessons) {
    await prisma.lesson.create({
      data: {
        id: `${lesson.courseId}_lesson_${lesson.order}`,
        courseId: lesson.courseId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: `Content for: ${lesson.title}`,
        isActive: true,
      }
    })
  }
  console.log('✅ Created 50 lessons for ADVANCED course')

  // Verify final state
  console.log('\n📊 Final Course Structure:')
  
  const course1 = await prisma.course.findUnique({
    where: { id: 'career14' },
    include: { _count: { select: { lessons: true } } }
  })

  const course2 = await prisma.course.findUnique({
    where: { id: 'course_public_speaking' },
    include: { _count: { select: { lessons: true } } }
  })

  console.log(`\n1. ${course1?.title}`)
  console.log(`   Level: ${course1?.difficulty}`)
  console.log(`   Lessons: ${course1?._count.lessons}`)
  console.log(`   Duration: ${course1?.duration} minutes`)

  console.log(`\n2. ${course2?.title}`)
  console.log(`   Level: ${course2?.difficulty}`)
  console.log(`   Lessons: ${course2?._count.lessons}`)
  console.log(`   Duration: ${course2?.duration} minutes`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
