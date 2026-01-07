import { db } from '../src/lib/db'

async function main() {
  console.log('Creating Advanced Excel for Professionals...\n')

  // Find or create the Professional Courses category
  const category = await db.category.upsert({
    where: { slug: 'professional-courses' },
    update: {},
    create: {
      name: 'Professional Courses',
      slug: 'professional-courses',
      description: 'Professional certification courses for career advancement',
      icon: '🎓',
      color: 'bg-purple-100',
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
  })
  console.log(`✅ Category: ${category.name}`)

  // Find or create the instructor
  const instructor = await db.instructor.upsert({
    where: { id: 'prof-courses-faculty' },
    update: {},
    create: {
      id: 'prof-courses-faculty',
      name: 'Professional Courses Faculty',
      bio: 'Expert faculty for professional certification courses',
      expertise: 'Excel, Data Analysis, Business Intelligence',
      avatar: '/assets/instructors/professional-faculty.svg',
      isActive: true,
    },
  })
  console.log(`✅ Instructor: ${instructor.name}`)

  // Check if course already exists
  const existingCourse = await db.course.findFirst({
    where: { id: 'course-advanced-excel' },
  })

  if (existingCourse) {
    console.log('⚠️  Course "Advanced Excel for Professionals" already exists!')
    console.log(`   Course ID: ${existingCourse.id}`)
    console.log(`   Title: ${existingCourse.title}`)
    
    // Update the course thumbnail if needed
    if (existingCourse.thumbnail !== '/assets/courses/advanced-excel.svg') {
      await db.course.update({
        where: { id: existingCourse.id },
        data: { thumbnail: '/assets/courses/advanced-excel.svg' }
      })
      console.log('✅ Updated course thumbnail')
    }
    
    console.log('\n👌 No changes needed - course already exists!')
    return
  }

  // Create the Advanced Excel course
  const course = await db.course.upsert({
    where: { id: 'course-advanced-excel' },
    update: {},
    create: {
      id: 'course-advanced-excel',
      title: 'Advanced Excel for Professionals',
      description: 'Master advanced Microsoft Excel skills including formulas, pivot tables, dashboards, automation, and data analysis for real-world business applications.',
      thumbnail: '/assets/courses/advanced-excel.svg',
      difficulty: 'INTERMEDIATE',
      duration: 720, // 12 hours in minutes
      instructorId: instructor.id,
      categoryId: category.id,
      isActive: true,
      courseType: 'GENERAL',
    },
  })
  console.log(`✅ Course: ${course.title}`)

  // Create Module 1: Advanced Excel Foundations (2 Hours)
  const module1Lessons = [
    { title: 'Excel Interface Optimization', order: 1, duration: 30 },
    { title: 'Keyboard Shortcuts & Productivity Tips', order: 2, duration: 30 },
    { title: 'Named Ranges & Dynamic References', order: 3, duration: 30 },
    { title: 'Workbook Structuring Best Practices', order: 4, duration: 30 },
  ]

  // Create Module 2: Advanced Formulas & Functions (3 Hours)
  const module2Lessons = [
    { title: 'Logical Functions (IF, IFS, AND, OR)', order: 101, duration: 30 },
    { title: 'Lookup Functions (XLOOKUP, VLOOKUP, HLOOKUP)', order: 102, duration: 30 },
    { title: 'INDEX & MATCH Mastery', order: 103, duration: 30 },
    { title: 'TEXT, DATE & TIME Functions', order: 104, duration: 30 },
    { title: 'Array Formulas & Dynamic Arrays', order: 105, duration: 30 },
    { title: 'Advanced Formula Techniques', order: 106, duration: 30 },
  ]

  // Create Module 3: Pivot Tables & Pivot Charts (2 Hours)
  const module3Lessons = [
    { title: 'Creating & Customizing Pivot Tables', order: 201, duration: 25 },
    { title: 'Grouping & Calculated Fields', order: 202, duration: 25 },
    { title: 'Slicers & Timelines', order: 203, duration: 20 },
    { title: 'Pivot Charts for Reporting', order: 204, duration: 25 },
    { title: 'Real-World Business Use Cases', order: 205, duration: 25 },
  ]

  // Create Module 4: Data Analysis & Visualization (2 Hours)
  const module4Lessons = [
    { title: 'Data Cleaning & Validation', order: 301, duration: 25 },
    { title: 'Conditional Formatting (Advanced)', order: 302, duration: 25 },
    { title: 'Charts & Data Visualization Best Practices', order: 303, duration: 25 },
    { title: 'Dashboard Design Principles', order: 304, duration: 25 },
    { title: 'KPI & MIS Reporting', order: 305, duration: 25 },
  ]

  // Create Module 5: Excel Automation with Macros (2 Hours)
  const module5Lessons = [
    { title: 'Macro Recording & Editing', order: 401, duration: 25 },
    { title: 'Introduction to VBA', order: 402, duration: 25 },
    { title: 'Automating Repetitive Tasks', order: 403, duration: 25 },
    { title: 'Button-Based Automation', order: 404, duration: 20 },
    { title: 'Error Handling Basics', order: 405, duration: 25 },
  ]

  // Create Module 6: Business Use Cases & Projects (1 Hour)
  const module6Lessons = [
    { title: 'Finance & Accounting Models', order: 501, duration: 20 },
    { title: 'Sales & Operations Dashboards', order: 502, duration: 20 },
    { title: 'HR & Payroll Tracking', order: 503, duration: 20 },
  ]

  const allLessons = [
    ...module1Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
    ...module2Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
    ...module3Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
    ...module4Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
    ...module5Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
    ...module6Lessons.map(l => ({ ...l, courseId: course.id, content: `Comprehensive lesson on ${l.title} for Advanced Excel proficiency.` })),
  ]

  // Insert all lessons
  for (const lesson of allLessons) {
    await db.lesson.create({
      data: lesson,
    })
  }

  console.log(`✅ Created ${allLessons.length} lessons across 6 modules`)

  // Create assessments
  const assessments = [
    { title: 'Excel Foundations Quiz', type: 'QUIZ' as const },
    { title: 'Advanced Formulas Assessment', type: 'QUIZ' as const },
    { title: 'Pivot Tables & Data Analysis Test', type: 'PRACTICE' as const },
    { title: 'Automation & Macros Quiz', type: 'QUIZ' as const },
    { title: 'Final Excel Assessment', type: 'PRACTICE' as const },
  ]

  for (const assessment of assessments) {
    await db.assessment.create({
      data: {
        title: assessment.title,
        type: assessment.type,
        courseId: course.id,
        isActive: true,
      },
    })
  }

  console.log(`✅ Created ${assessments.length} assessments`)

  console.log('\n🎉 Advanced Excel for Professionals created successfully!')
  console.log(`📚 Total Lessons: ${allLessons.length}`)
  console.log(`⏱️  Total Duration: 12 hours`)
  console.log(`📊 6 Modules with comprehensive coverage`)
}

main()
  .catch(e => {
    console.error('Error creating course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
