/**
 * Seed Script: CA Intermediate Complete Course
 * A comprehensive 166+ hour course covering all 8 CA Intermediate papers
 * 
 * IMPORTANT: Run this script AFTER running the main seed to ensure categories exist
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CA Intermediate course creation...\n')

  // ============================================================================
  // 0. CLEANUP EXISTING DATA
  // ============================================================================
  console.log('🧹 Cleaning up existing CA Intermediate data...')
  
  // Delete existing CA Intermediate course data
  await prisma.assessment.deleteMany({ where: { courseId: 'course-ca-intermediate' } }).catch(() => {})
  await prisma.lesson.deleteMany({ where: { courseId: 'course-ca-intermediate' } }).catch(() => {})
  await prisma.course.delete({ where: { id: 'course-ca-intermediate' } }).catch(() => {})
  
  // Delete old lessons that might have been created before
  const oldLessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { id: { startsWith: 'lesson-ca-int-' } },
        { title: { contains: 'CA Intermediate' } }
      ]
    }
  })
  
  for (const lesson of oldLessons) {
    await prisma.lesson.delete({ where: { id: lesson.id } }).catch(() => {})
  }
  
  const oldAssessments = await prisma.assessment.findMany({
    where: { title: { contains: 'CA Intermediate' } }
  })
  
  for (const assessment of oldAssessments) {
    await prisma.assessment.delete({ where: { id: assessment.id } }).catch(() => {})
  }
  
  const oldCourse = await prisma.course.findFirst({
    where: { title: { contains: 'CA Intermediate' } }
  })
  
  if (oldCourse) {
    await prisma.course.delete({ where: { id: oldCourse.id } }).catch(() => {})
  }
  
  console.log('✅ Cleanup complete\n')

  // ============================================================================
  // 1. CREATE OR GET INSTRUCTOR
  // ============================================================================
  
  const instructor = await prisma.instructor.upsert({
    where: { id: 'inst-ca-faculty' },
    update: {},
    create: {
      id: 'inst-ca-faculty',
      name: 'Professional Courses Faculty',
      title: 'CA Intermediate Expert',
      bio: 'Experienced faculty specializing in CA Intermediate preparation with expertise in Advanced Accounting, Taxation, Law, Costing, Auditing, and Financial Management. Has helped thousands of students clear CA Intermediate in first attempt.',
      expertise: 'CA Intermediate, Advanced Accounting, Corporate Law, Taxation, Cost Management, Auditing, Financial Management',
      isActive: true,
    },
  })
  
  console.log(`✅ Instructor ready: ${instructor.name}`)

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
    { id: 'sub-ca-adv-accounting', name: 'CA Advanced Accounting', slug: 'ca-advanced-accounting' },
    { id: 'sub-ca-taxation', name: 'CA Taxation', slug: 'ca-taxation' },
    { id: 'sub-ca-cost-audit', name: 'CA Costing & Audit', slug: 'ca-costing-audit' },
    { id: 'sub-ca-fm-strategy', name: 'CA FM & Strategy', slug: 'ca-fm-strategy' },
  ]

  for (const sub of subcategories) {
    await prisma.subCategory.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: `CA Intermediate ${sub.name} preparation`,
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
    where: { id: 'course-ca-intermediate' },
    update: {},
    create: {
      id: 'course-ca-intermediate',
      title: 'CA Intermediate – Complete Course (Both Groups)',
      description: `This comprehensive course offers end-to-end preparation for CA Intermediate (New Scheme), covering all papers of Group I and Group II with advanced accounting, law, taxation, costing, auditing, FM & SM.

**What you'll learn:**
• Clear CA Intermediate (Both Groups) confidently
• Master advanced accounting & taxation concepts
• Apply law, costing & audit concepts to case-based questions
• Handle MCQ + descriptive papers effectively
• Build a solid foundation for CA Final

**Level:** ADVANCED | **Duration:** 166+ Hours | **Subscription:** INR 99/month`,
      thumbnail: '/assets/courses/ca-intermediate.svg',
      duration: 10000, // 166+ hours = 10000+ minutes
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: category.id,
      subCategoryId: 'sub-ca-adv-accounting',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE LESSONS BY MODULE (8 Modules × Various Lessons = 60+ Lessons)
  // ============================================================================

  const lessons = [
    // Module 1: Advanced Accounting (Group I – Paper 1) - 10 lessons, orders 1-10
    { title: 'Accounting Standards (AS) – In-depth', duration: 240, order: 1, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Company Accounts – Issue, Forfeiture, Buy-back', duration: 300, order: 2, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Amalgamation, Absorption & Reconstruction', duration: 300, order: 3, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Internal Reconstruction', duration: 240, order: 4, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Branch Accounting', duration: 180, order: 5, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Consignment Accounting (Advanced)', duration: 180, order: 6, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Hire Purchase & Installment System', duration: 240, order: 7, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Insurance Claims', duration: 180, order: 8, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Cash Flow Statements', duration: 240, order: 9, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    { title: 'Accounting Adjustments & ICAI Practice Questions', duration: 300, order: 10, moduleOrder: 1, moduleTitle: 'Advanced Accounting (Group I – Paper 1)' },
    
    // Module 2: Corporate & Other Laws (Group I – Paper 2) - 10 lessons, orders 101-110
    { title: 'Companies Act, 2013 – Overview', duration: 180, order: 101, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Incorporation of Company', duration: 240, order: 102, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Share Capital & Debentures', duration: 300, order: 103, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Directors & Key Managerial Personnel', duration: 240, order: 104, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Meetings & Resolutions', duration: 240, order: 105, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Accounts & Audit (Company Law perspective)', duration: 240, order: 106, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Indian Contract Act (Advanced)', duration: 240, order: 107, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Negotiable Instruments Act', duration: 180, order: 108, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'General Clauses Act', duration: 150, order: 109, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    { title: 'Interpretation of Statutes', duration: 150, order: 110, moduleOrder: 2, moduleTitle: 'Corporate & Other Laws (Group I – Paper 2)' },
    
    // Module 3: Taxation (Group I – Paper 3) - 11 lessons, orders 201-211
    { title: 'Basic Concepts & Residential Status', duration: 240, order: 201, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Heads of Income', duration: 300, order: 202, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Deductions & Set-off', duration: 240, order: 203, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Computation of Total Income', duration: 300, order: 204, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Clubbing & Aggregation', duration: 180, order: 205, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Assessment Procedure', duration: 240, order: 206, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Supply under GST', duration: 240, order: 207, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Levy & Collection', duration: 180, order: 208, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Input Tax Credit', duration: 240, order: 209, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'Registration & Returns', duration: 180, order: 210, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    { title: 'GST Compliance & Case Studies', duration: 240, order: 211, moduleOrder: 3, moduleTitle: 'Taxation (Group I – Paper 3)' },
    
    // Module 4: Cost and Management Accounting (Group II – Paper 4) - 7 lessons, orders 301-307
    { title: 'Cost Concepts & Classification', duration: 180, order: 301, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Material, Labour & Overheads', duration: 300, order: 302, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Cost Sheet & Reconciliation', duration: 240, order: 303, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Marginal Costing', duration: 240, order: 304, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Budgetary Control', duration: 240, order: 305, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Standard Costing', duration: 240, order: 306, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    { title: 'Decision Making Tools', duration: 180, order: 307, moduleOrder: 4, moduleTitle: 'Cost and Management Accounting (Group II – Paper 4)' },
    
    // Module 5: Auditing & Ethics (Group II – Paper 5) - 6 lessons, orders 401-406
    { title: 'Nature, Objective & Scope of Audit', duration: 180, order: 401, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    { title: 'Audit Planning & Documentation', duration: 240, order: 402, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    { title: 'Internal Control & Internal Audit', duration: 240, order: 403, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    { title: 'Audit of Items of Financial Statements', duration: 300, order: 404, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    { title: 'Company Audit', duration: 240, order: 405, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    { title: 'Professional Ethics & Code of Conduct', duration: 180, order: 406, moduleOrder: 5, moduleTitle: 'Auditing & Ethics (Group II – Paper 5)' },
    
    // Module 6: Financial Management (Group II – Paper 6A) - 6 lessons, orders 501-506
    { title: 'Financial Management Overview', duration: 180, order: 501, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    { title: 'Time Value of Money', duration: 240, order: 502, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    { title: 'Capital Budgeting', duration: 300, order: 503, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    { title: 'Cost of Capital', duration: 240, order: 504, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    { title: 'Leverage Analysis', duration: 180, order: 505, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    { title: 'Working Capital Management', duration: 240, order: 506, moduleOrder: 6, moduleTitle: 'Financial Management (Group II – Paper 6A)' },
    
    // Module 7: Strategic Management (Group II – Paper 6B) - 6 lessons, orders 601-606
    { title: 'Strategic Analysis', duration: 180, order: 601, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    { title: 'Competitive Advantage', duration: 150, order: 602, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    { title: 'Business Level Strategies', duration: 180, order: 603, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    { title: 'Corporate Level Strategies', duration: 180, order: 604, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    { title: 'Functional Strategies', duration: 150, order: 605, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    { title: 'Case Studies', duration: 180, order: 606, moduleOrder: 7, moduleTitle: 'Strategic Management (Group II – Paper 6B)' },
    
    // Module 8: Exam Preparation & Revision - lessons orders 701+
    { title: 'ICAI Study Material Coverage', duration: 180, order: 701, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
    { title: 'RTP, MTP & Past Year Question Analysis', duration: 240, order: 702, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
    { title: 'Full-length Mock Tests (Group I)', duration: 300, order: 703, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
    { title: 'Full-length Mock Tests (Group II)', duration: 300, order: 704, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
    { title: '60-30-15 Day Revision Plans', duration: 180, order: 705, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
    { title: 'Exam Writing Strategy & Time Management', duration: 120, order: 706, moduleOrder: 8, moduleTitle: 'Exam Preparation & Revision' },
  ]

  console.log('\n📚 Creating 62 lessons across 8 modules...')

  for (const lesson of lessons) {
    const lessonId = `lesson-ca-int-${lesson.order}`
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
This lesson covers **${lesson.title}** as part of the CA Intermediate curriculum.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand advanced concepts of ${lesson.title.toLowerCase()}
2. Apply concepts to solve CA Intermediate exam questions
3. Build expertise for CA Final

## Key Topics

### Main Concept
- Core concept 1
- Core concept 2
- Core concept 3

### Practical Application
- ICAI exam patterns
- Previous year questions
- Practice exercises
- Case study approaches

## Summary
This lesson has covered the key aspects of ${lesson.title}. Make sure to review the practice questions and proceed to the next lesson.

## Resources
- ICAI study material references
- Practice MCQs
- Summary notes
- Formula sheets`,
      },
    })
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title}`)
  }

  // ============================================================================
  // 6. CREATE ASSESSMENTS
  // ============================================================================

  const assessments = [
    { title: 'Group I: Advanced Accounting & Law Mock Test', type: 'PRACTICE', order: 1 },
    { title: 'Group I: Taxation Comprehensive Quiz', type: 'QUIZ', order: 2 },
    { title: 'Group II: Costing & Audit Mock Test', type: 'PRACTICE', order: 3 },
    { title: 'Group II: FM & Strategy Comprehensive Quiz', type: 'QUIZ', order: 4 },
    { title: 'CA Intermediate Final Mock Test (Both Groups)', type: 'PRACTICE', order: 5 },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: `assessment-ca-int-${assessment.order}` },
      update: {},
      create: {
        id: `assessment-ca-int-${assessment.order}`,
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
  console.log('🎉 CA Intermediate Complete Course created successfully!')
  console.log('='.repeat(60))
  console.log(`\n📖 Course: ${course.title}`)
  console.log(`👨‍🏫 Instructor: ${instructor.name}`)
  console.log(`📁 Category: ${category.name}`)
  console.log(`\n📊 Structure Summary:`)
  console.log(`   📚 Total Modules: 8 (Both Groups)`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${course.duration} minutes (${Math.round(course.duration / 60)} hours)`)
  console.log(`   📊 Difficulty: ${course.difficulty}`)
  console.log(`   📝 Total Assessments: ${assessments.length}`)
  console.log(`\n📚 Modules Breakdown:`)
  
  const moduleNames = [
    'Advanced Accounting (Group I – Paper 1)',
    'Corporate & Other Laws (Group I – Paper 2)',
    'Taxation (Group I – Paper 3)',
    'Cost and Management Accounting (Group II – Paper 4)',
    'Auditing & Ethics (Group II – Paper 5)',
    'Financial Management (Group II – Paper 6A)',
    'Strategic Management (Group II – Paper 6B)',
    'Exam Preparation & Revision',
  ]
  
  for (let i = 0; i < moduleNames.length; i++) {
    const modLessons = lessons.filter(l => l.moduleOrder === i + 1)
    const totalDuration = modLessons.reduce((sum, l) => sum + l.duration, 0)
    console.log(`   ${i + 1}. ${moduleNames[i]} (${modLessons.length} lessons, ${Math.round(totalDuration / 60)}h)`)
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
