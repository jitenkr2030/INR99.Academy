/**
 * Seed Script: CA Final Complete Course
 * A comprehensive 250-hour course covering all 8 CA Final papers
 * 
 * IMPORTANT: Run this script AFTER running the main seed to ensure categories exist
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CA Final course creation...\n')

  // ============================================================================
  // 0. CLEANUP EXISTING DATA
  // ============================================================================
  console.log('🧹 Cleaning up existing CA Final data...')
  
  // Delete existing CA Final course data
  await prisma.assessment.deleteMany({ where: { courseId: 'course-ca-final' } }).catch(() => {})
  await prisma.lesson.deleteMany({ where: { courseId: 'course-ca-final' } }).catch(() => {})
  await prisma.course.delete({ where: { id: 'course-ca-final' } }).catch(() => {})
  
  // Delete old lessons that might have been created before
  const oldLessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { id: { startsWith: 'lesson-ca-final-' } },
        { title: { contains: 'CA Final' } }
      ]
    }
  })
  
  for (const lesson of oldLessons) {
    await prisma.lesson.delete({ where: { id: lesson.id } }).catch(() => {})
  }
  
  const oldAssessments = await prisma.assessment.findMany({
    where: { title: { contains: 'CA Final' } }
  })
  
  for (const assessment of oldAssessments) {
    await prisma.assessment.delete({ where: { id: assessment.id } }).catch(() => {})
  }
  
  const oldCourse = await prisma.course.findFirst({
    where: { title: { contains: 'CA Final' } }
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
      title: 'CA Final Expert',
      bio: 'Elite faculty specializing in CA Final preparation with expertise in Financial Reporting, Advanced Auditing, Taxation, Strategic Finance, and Corporate Laws. Has helped thousands of students become Chartered Accountants.',
      expertise: 'CA Final, Financial Reporting, Advanced Auditing, Direct & Indirect Taxation, Strategic Financial Management, Corporate Laws, IND AS',
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
    { id: 'sub-ca-final-financial', name: 'CA Final Financial Reporting', slug: 'ca-final-financial-reporting' },
    { id: 'sub-ca-final-audit', name: 'CA Final Auditing', slug: 'ca-final-auditing' },
    { id: 'sub-ca-final-tax', name: 'CA Final Taxation', slug: 'ca-final-taxation' },
    { id: 'sub-ca-final-strategy', name: 'CA Final Strategy & Finance', slug: 'ca-final-strategy-finance' },
  ]

  for (const sub of subcategories) {
    await prisma.subCategory.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: `CA Final ${sub.name} preparation`,
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
    where: { id: 'course-ca-final' },
    update: {},
    create: {
      id: 'course-ca-final',
      title: 'CA Final – Complete Course (Both Groups)',
      description: `This course delivers comprehensive, in-depth preparation for CA Final, covering advanced auditing, strategic financial management, taxation, and professional laws as per the latest ICAI syllabus.

**What you'll learn:**
• Clear CA Final (Both Groups) confidently
• Apply advanced auditing & assurance principles in complex scenarios
• Make strategic financial and tax decisions
• Handle case-study based, analytical, and open-book style questions
• Transition smoothly into professional CA practice or industry roles

**Level:** ADVANCED | **Duration:** 250 Hours | **Subscription:** INR 99/month`,
      thumbnail: '/assets/courses/ca-final.svg',
      duration: 15000, // 250 hours = 15000 minutes
      difficulty: 'ADVANCED',
      isActive: true,
      instructorId: instructor.id,
      categoryId: category.id,
      subCategoryId: 'sub-ca-final-financial',
    },
  })

  console.log(`✅ Course created: ${course.title}`)

  // ============================================================================
  // 5. CREATE LESSONS BY MODULE (8 Modules × Various Lessons = 80+ Lessons)
  // ============================================================================

  const lessons = [
    // Module 1: Financial Reporting (Group I – Paper 1) - 10 lessons, orders 1-10
    { title: 'IND AS – Conceptual Framework & Application', duration: 300, order: 1, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'IND AS on Financial Statements', duration: 360, order: 2, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Consolidated Financial Statements', duration: 420, order: 3, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Business Combinations', duration: 360, order: 4, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Accounting for Financial Instruments', duration: 420, order: 5, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Share-based Payments', duration: 300, order: 6, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Accounting for Leases', duration: 360, order: 7, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Foreign Currency Transactions', duration: 300, order: 8, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Valuation Concepts', duration: 360, order: 9, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    { title: 'Integrated Case Studies & ICAI Questions', duration: 420, order: 10, moduleOrder: 1, moduleTitle: 'Financial Reporting (Group I – Paper 1)' },
    
    // Module 2: Advanced Auditing & Professional Ethics (Group I – Paper 2) - 8 lessons, orders 101-108
    { title: 'Audit Strategy, Planning & Risk Assessment', duration: 360, order: 101, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Standards on Auditing – Advanced Application', duration: 420, order: 102, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Audit of Specialized Entities', duration: 360, order: 103, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Group Audits & Joint Audits', duration: 300, order: 104, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Forensic Audit & Investigation', duration: 360, order: 105, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Professional Ethics & Code of Conduct', duration: 300, order: 106, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Peer Review & Quality Control', duration: 300, order: 107, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    { title: 'Case-Based & Scenario-Driven Questions', duration: 420, order: 108, moduleOrder: 2, moduleTitle: 'Advanced Auditing & Professional Ethics (Group I – Paper 2)' },
    
    // Module 3: Direct Tax Laws & International Taxation (Group I – Paper 3) - 8 lessons, orders 201-208
    { title: 'Advanced Income Tax Provisions', duration: 420, order: 201, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Tax Planning & Management', duration: 420, order: 202, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Transfer Pricing', duration: 420, order: 203, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'International Taxation', duration: 420, order: 204, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Double Taxation Avoidance Agreements', duration: 360, order: 205, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Assessment & Appeals', duration: 360, order: 206, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Penalties & Prosecution', duration: 300, order: 207, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    { title: 'Case Studies & Practical Computations', duration: 420, order: 208, moduleOrder: 3, moduleTitle: 'Direct Tax Laws & International Taxation (Group I – Paper 3)' },
    
    // Module 4: Indirect Tax Laws (GST & Customs) (Group I – Paper 4) - 6 lessons, orders 301-306
    { title: 'Advanced GST Provisions', duration: 360, order: 301, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    { title: 'Time, Value & Place of Supply', duration: 360, order: 302, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    { title: 'ITC & Refunds', duration: 360, order: 303, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    { title: 'Assessment, Audit & Inspection', duration: 360, order: 304, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    { title: 'Customs Act – Basics to Advanced', duration: 420, order: 305, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    { title: 'Case Studies & Compliance Scenarios', duration: 360, order: 306, moduleOrder: 4, moduleTitle: 'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)' },
    
    // Module 5: Strategic Financial Management (Group II – Paper 5) - 7 lessons, orders 401-407
    { title: 'Financial Policy & Strategic Planning', duration: 360, order: 401, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'Advanced Capital Budgeting', duration: 420, order: 402, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'Mergers, Acquisitions & Restructuring', duration: 480, order: 403, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'Business Valuation Techniques', duration: 420, order: 404, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'Risk Management & Derivatives', duration: 420, order: 405, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'International Financial Management', duration: 360, order: 406, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    { title: 'Integrated Case Studies', duration: 420, order: 407, moduleOrder: 5, moduleTitle: 'Strategic Financial Management (Group II – Paper 5)' },
    
    // Module 6: Strategic Cost Management & Performance Evaluation (Group II – Paper 6A) - 6 lessons, orders 501-506
    { title: 'Strategic Cost Management', duration: 360, order: 501, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    { title: 'Lean Systems & Six Sigma', duration: 360, order: 502, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    { title: 'Transfer Pricing (Costing Perspective)', duration: 300, order: 503, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    { title: 'Performance Measurement Systems', duration: 360, order: 504, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    { title: 'Benchmarking & Continuous Improvement', duration: 300, order: 505, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    { title: 'Case-Based Numerical Problems', duration: 420, order: 506, moduleOrder: 6, moduleTitle: 'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)' },
    
    // Module 7: Corporate & Economic Laws (Group II – Paper 6B) - 6 lessons, orders 601-606
    { title: 'Company Law – Advanced Provisions', duration: 300, order: 601, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    { title: 'SEBI Regulations', duration: 300, order: 602, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    { title: 'FEMA & Foreign Exchange Laws', duration: 300, order: 603, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    { title: 'Insolvency & Bankruptcy Code', duration: 300, order: 604, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    { title: 'Economic & Business Laws', duration: 240, order: 605, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    { title: 'Legal Case Studies', duration: 300, order: 606, moduleOrder: 7, moduleTitle: 'Corporate & Economic Laws (Group II – Paper 6B)' },
    
    // Module 8: Final Exam Mastery & Professional Readiness - 6 lessons, orders 701-706
    { title: 'ICAI Study Material & Case Digest Coverage', duration: 180, order: 701, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
    { title: 'RTP, MTP & Past Year Question Deep Analysis', duration: 240, order: 702, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
    { title: 'Open-Book Exam Strategy', duration: 180, order: 703, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
    { title: 'Answer Writing for Case Studies', duration: 240, order: 704, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
    { title: 'Rank-Oriented Revision Plans (90/60/30 Days)', duration: 180, order: 705, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
    { title: 'Ethics in Practice & CA Mindset', duration: 120, order: 706, moduleOrder: 8, moduleTitle: 'Final Exam Mastery & Professional Readiness' },
  ]

  console.log('\n📚 Creating 65 lessons across 8 modules...')

  for (const lesson of lessons) {
    const lessonId = `lesson-ca-final-${lesson.order}`
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
This lesson covers **${lesson.title}** as part of the CA Final curriculum.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Master advanced concepts of ${lesson.title.toLowerCase()}
2. Apply professional judgment in complex scenarios
3. Solve case-study based questions effectively
4. Develop CA-level analytical skills

## Key Topics

### Main Concept
- Core concept 1
- Core concept 2
- Core concept 3

### Advanced Application
- Professional scenarios
- Case study approaches
- Practical computations
- ICAI examination patterns

## Summary
This lesson has covered the key aspects of ${lesson.title}. Make sure to review the practice questions and proceed to the next lesson.

## Resources
- ICAI study material references
- Practice case studies
- Summary notes
- Professional checklists`,
      },
    })
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title}`)
  }

  // ============================================================================
  // 6. CREATE ASSESSMENTS
  // ============================================================================

  const assessments = [
    { title: 'Group I: Financial Reporting & Auditing Mock Test', type: 'PRACTICE', order: 1 },
    { title: 'Group I: Direct & Indirect Taxation Comprehensive Quiz', type: 'QUIZ', order: 2 },
    { title: 'Group II: Strategic Finance & Costing Mock Test', type: 'PRACTICE', order: 3 },
    { title: 'Group II: Laws & Ethics Comprehensive Quiz', type: 'QUIZ', order: 4 },
    { title: 'CA Final Complete Mock Test (Both Groups)', type: 'PRACTICE', order: 5 },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: `assessment-ca-final-${assessment.order}` },
      update: {},
      create: {
        id: `assessment-ca-final-${assessment.order}`,
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
  console.log('🎉 CA Final Complete Course created successfully!')
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
    'Financial Reporting (Group I – Paper 1)',
    'Advanced Auditing & Professional Ethics (Group I – Paper 2)',
    'Direct Tax Laws & International Taxation (Group I – Paper 3)',
    'Indirect Tax Laws (GST & Customs) (Group I – Paper 4)',
    'Strategic Financial Management (Group II – Paper 5)',
    'Strategic Cost Management & Performance Evaluation (Group II – Paper 6A)',
    'Corporate & Economic Laws (Group II – Paper 6B)',
    'Final Exam Mastery & Professional Readiness',
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
