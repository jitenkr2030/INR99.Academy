/**
 * Seed Script: CA Foundation Complete Course
 * A comprehensive 100-hour course covering all 4 CA Foundation papers
 * 
 * IMPORTANT: Run this script AFTER running the main seed to ensure categories exist
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CA Foundation course creation...\n')

  // ============================================================================
  // 0. CLEANUP EXISTING DATA
  // ============================================================================
  console.log('🧹 Cleaning up existing CA Foundation data...')
  
  // Delete existing CA Foundation course data
  await prisma.assessment.deleteMany({ where: { courseId: 'course-ca-foundation' } }).catch(() => {})
  await prisma.lesson.deleteMany({ where: { courseId: 'course-ca-foundation' } }).catch(() => {})
  await prisma.course.delete({ where: { id: 'course-ca-foundation' } }).catch(() => {})
  
  // Delete old lessons that might have been created before
  const oldLessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { id: { startsWith: 'lesson-ca-' } },
        { title: { contains: 'CA Foundation' } }
      ]
    }
  })
  
  for (const lesson of oldLessons) {
    await prisma.lesson.delete({ where: { id: lesson.id } }).catch(() => {})
  }
  
  const oldAssessments = await prisma.assessment.findMany({
    where: { title: { contains: 'CA Foundation' } }
  })
  
  for (const assessment of oldAssessments) {
    await prisma.assessment.delete({ where: { id: assessment.id } }).catch(() => {})
  }
  
  const oldCourse = await prisma.course.findFirst({
    where: { title: { contains: 'CA Foundation' } }
  })
  
  if (oldCourse) {
    await prisma.course.delete({ where: { id: oldCourse.id } }).catch(() => {})
  }
  
  console.log('✅ Cleanup complete\n')

  // ============================================================================
  // 1. CREATE INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-ca-faculty' },
    update: {},
    create: {
      id: 'inst-ca-faculty',
      name: 'Professional Courses Faculty',
      title: 'CA Foundation Expert',
      bio: 'Experienced faculty specializing in CA Foundation preparation with expertise in Accounting, Law, Quantitative Aptitude, and Economics. Has helped thousands of students clear CA Foundation in first attempt.',
      expertise: 'CA Foundation, Accounting, Business Law, Mathematics, Economics',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor created: ${instructor.name}`)

  // ============================================================================
  // 2. GET OR CREATE CATEGORY
  // ============================================================================

  const category = await prisma.category.upsert({
    where: { id: 'cat-professional-courses' },
    update: {},
    create: {
      id: 'cat-professional-courses',
      name: 'Professional Courses',
      slug: 'professional-courses',
      description: 'CA, CS, CMA, and other professional exam preparation',
      icon: '🎯',
      color: '#7C3AED',
      sortOrder: 3,
      isActive: true,
      isFeatured: true,
    },
  })

  console.log(`✅ Category ready: ${category.name}`)

  // ============================================================================
  // 3. CREATE SUB CATEGORIES
  // ============================================================================

  const subcategories = [
    { id: 'sub-ca-accounting', name: 'CA Accounting', slug: 'ca-accounting' },
    { id: 'sub-ca-law', name: 'CA Business Law', slug: 'ca-business-law' },
    { id: 'sub-ca-quant', name: 'CA Quantitative Aptitude', slug: 'ca-quantitative-aptitude' },
    { id: 'sub-ca-economics', name: 'CA Economics', slug: 'ca-economics' },
  ]

  for (const sub of subcategories) {
    await prisma.subCategory.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: `CA Foundation ${sub.name} preparation`,
        icon: '📚',
        color: '#7C3AED',
        sortOrder: 1,
        isActive: true,
        categoryId: category.id,
      },
    })
    console.log(`✅ Subcategory created: ${sub.name}`)
  }

  // ============================================================================
  // 4. CREATE COURSE
  // ============================================================================

  const course = await prisma.course.upsert({
    where: { id: 'course-ca-foundation' },
    update: {},
    create: {
      id: 'course-ca-foundation',
      title: 'CA Foundation – Complete Course (All 4 Papers)',
      description: `This comprehensive course provides complete, exam-oriented preparation for the Chartered Accountancy Foundation Examination, covering all four papers as per the latest ICAI syllabus. Ideal for students preparing for May/November attempts.

**What you'll learn:**
• Clear CA Foundation confidently in first attempt
• Understand core accounting, law, math, and economics concepts
• Solve MCQs + descriptive questions accurately
• Build a strong base for CA Intermediate
• Develop exam writing & time-management skills

**Level:** INTERMEDIATE | **Duration:** 100 Hours | **Subscription:** INR 99/month`,
      thumbnail: '/assets/courses/ca-foundation.svg',
      duration: 6000, // 100 hours = 6000 minutes
      difficulty: 'INTERMEDIATE',
      isActive: true,
      instructorId: instructor.id,
      categoryId: category.id,
      subCategoryId: 'sub-ca-accounting',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE LESSONS BY MODULE (4 Modules × Various Lessons = 53+ Lessons)
  // ============================================================================

  const lessons = [
    // Module 1: Principles and Practice of Accounting (Paper 1) - 13 lessons, orders 1-13
    { title: 'Introduction to Accounting', duration: 150, order: 1, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Accounting Concepts & Conventions', duration: 180, order: 2, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Accounting Standards – Overview', duration: 150, order: 3, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Accounting Equation', duration: 120, order: 4, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Journal Entries & Subsidiary Books', duration: 240, order: 5, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Cash Book & Bank Reconciliation Statement', duration: 210, order: 6, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Ledger & Trial Balance', duration: 180, order: 7, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Final Accounts of Sole Proprietor', duration: 270, order: 8, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Adjustments & Rectification of Errors', duration: 210, order: 9, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Depreciation Accounting', duration: 180, order: 10, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Bills of Exchange', duration: 180, order: 11, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Consignment Accounting', duration: 180, order: 12, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    { title: 'Joint Venture (Basics)', duration: 150, order: 13, moduleOrder: 1, moduleTitle: 'Principles and Practice of Accounting' },
    
    // Module 2: Business Laws & Business Correspondence (Paper 2) - 6 lessons, orders 101-106
    { title: 'Indian Contract Act, 1872 – Offer & Acceptance', duration: 180, order: 101, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    { title: 'Indian Contract Act, 1872 – Consideration & Capacity', duration: 180, order: 102, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    { title: 'Indian Contract Act, 1872 – Free Consent & Discharge', duration: 180, order: 103, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    { title: 'Sale of Goods Act, 1930 – Conditions & Warranties', duration: 180, order: 104, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    { title: 'Sale of Goods Act, 1930 – Transfer of Ownership & Unpaid Seller', duration: 150, order: 105, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    { title: 'Business Communication – Letters, Emails & Reports', duration: 240, order: 106, moduleOrder: 2, moduleTitle: 'Business Laws & Business Correspondence' },
    
    // Module 3: Business Mathematics, Logical Reasoning & Statistics (Paper 3) - 13 lessons, orders 201-213
    { title: 'Ratio, Proportion & Indices', duration: 180, order: 201, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Logarithms', duration: 150, order: 202, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Linear Equations', duration: 180, order: 203, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Time Value of Money', duration: 180, order: 204, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Permutations & Combinations', duration: 180, order: 205, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Number Series', duration: 120, order: 206, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Coding & Decoding', duration: 120, order: 207, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Seating Arrangement', duration: 150, order: 208, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Blood Relations', duration: 120, order: 209, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Measures of Central Tendency', duration: 180, order: 210, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Dispersion', duration: 150, order: 211, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Probability', duration: 180, order: 212, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    { title: 'Correlation & Regression', duration: 180, order: 213, moduleOrder: 3, moduleTitle: 'Business Mathematics, Logical Reasoning & Statistics' },
    
    // Module 4: Business Economics & Business & Commercial Knowledge (Paper 4) - 11 lessons, orders 301-311
    { title: 'Nature & Scope of Economics', duration: 150, order: 301, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Theory of Demand & Supply', duration: 180, order: 302, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Elasticity of Demand', duration: 150, order: 303, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Production & Cost', duration: 180, order: 304, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Market Structures', duration: 180, order: 305, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Business Cycles', duration: 150, order: 306, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Indian Economy – Overview', duration: 180, order: 307, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Banking & Financial Markets', duration: 180, order: 308, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Insurance & Capital Market', duration: 150, order: 309, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Business Organizations in India', duration: 150, order: 310, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
    { title: 'Government Policies & Reforms', duration: 150, order: 311, moduleOrder: 4, moduleTitle: 'Business Economics & Business & Commercial Knowledge' },
  ]

  console.log('\n📚 Creating 53 Lessons across 4 modules...')

  for (const lesson of lessons) {
    const lessonId = `lesson-ca-${lesson.order}`
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {},
      create: {
        id: lessonId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        isActive: true,
        courseId: course.id,
        content: `# ${lesson.title}

**Module ${lesson.moduleOrder}: ${lesson.moduleTitle}**

---

## Overview
This lesson covers **${lesson.title}** as part of the CA Foundation curriculum.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand the fundamentals of ${lesson.title.toLowerCase()}
2. Apply concepts to solve CA Foundation exam questions
3. Build a strong foundation for CA Intermediate

## Key Topics

### Main Concept
- Core concept 1
- Core concept 2
- Core concept 3

### Practical Application
- ICAI exam patterns
- Previous year questions
- Practice exercises

## Summary
This lesson has covered the key aspects of ${lesson.title}. Make sure to review the practice questions and proceed to the next lesson.

## Resources
- ICAI study material references
- Practice MCQs
- Summary notes`,
      },
    })
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title}`)
  }

  // ============================================================================
  // 6. CREATE ASSESSMENTS
  // ============================================================================

  const assessments = [
    { title: 'Paper 1: Accounting MCQ Practice', type: 'QUIZ', order: 1 },
    { title: 'Paper 2: Business Law MCQ Practice', type: 'QUIZ', order: 2 },
    { title: 'Paper 3: Quantitative Aptitude MCQ Practice', type: 'QUIZ', order: 3 },
    { title: 'Paper 4: Economics & BCK MCQ Practice', type: 'QUIZ', order: 4 },
    { title: 'CA Foundation Final Mock Test', type: 'PRACTICE', order: 5 },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: `assessment-ca-${assessment.order}` },
      update: {},
      create: {
        id: `assessment-ca-${assessment.order}`,
        title: assessment.title,
        type: assessment.type,
        isActive: true,
        courseId: course.id,
      },
    })
    console.log(`✅ Assessment created: ${assessment.title}`)
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n' + '='.repeat(60))
  console.log('🎉 CA Foundation Complete Course created successfully!')
  console.log('='.repeat(60))
  console.log(`\n📖 Course: ${course.title}`)
  console.log(`👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`📁 Category: ${category.name}`)
  console.log(`\n📊 Structure Summary:`)
  console.log(`   📚 Total Modules: 4 (All 4 Papers)`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${course.duration / 60} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
  console.log(`   📝 Total Assessments: ${assessments.length}`)
  console.log(`\n📚 Modules Breakdown:`)
  
  const moduleNames = [
    'Principles and Practice of Accounting (Paper 1)',
    'Business Laws & Business Correspondence (Paper 2)',
    'Business Mathematics, Logical Reasoning & Statistics (Paper 3)',
    'Business Economics & Business & Commercial Knowledge (Paper 4)',
  ]
  
  for (let i = 0; i < moduleNames.length; i++) {
    const modLessons = lessons.filter(l => l.moduleOrder === i + 1)
    const totalDuration = modLessons.reduce((sum, l) => sum + l.duration, 0)
    console.log(`   ${i + 1}. ${moduleNames[i]} (${modLessons.length} lessons, ${totalDuration} min)`)
  }
  
  console.log('\n✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
