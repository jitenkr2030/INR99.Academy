/**
 * Seed Script: CS Executive Complete Course
 * Updates the existing CS Executive course with proper module structure
 * 
 * IMPORTANT: This script adds lessons to the existing "cs_executive" course
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CS Executive course update...\n')

  // ============================================================================
  // 0. CLEANUP EXISTING DATA
  // ============================================================================
  console.log('🧹 Cleaning up existing CS Executive lessons...')
  
  const courseId = 'cs_executive'
  
  // Delete existing lessons
  await prisma.lesson.deleteMany({ where: { courseId: courseId } }).catch(() => {})
  await prisma.assessment.deleteMany({ where: { courseId: courseId } }).catch(() => {})
  
  console.log('✅ Cleanup complete\n')

  // ============================================================================
  // 1. GET COURSE
  // ============================================================================
  
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    console.error('❌ Course not found: cs_executive')
    process.exit(1)
  }
  
  console.log(`✅ Course found: ${course.title}`)

  // ============================================================================
  // 2. CREATE LESSONS BY MODULE (8 Modules × Various Lessons = 67 Lessons)
  // ============================================================================

  const lessons = [
    // Module 1: Jurisprudence, Interpretation & General Laws (Module I – Paper 1) - 7 lessons, orders 1-7
    { title: 'Jurisprudence – Nature & Schools of Law', duration: 120, order: 1, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'Sources of Law', duration: 120, order: 2, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'Constitution of India – Key Provisions', duration: 180, order: 3, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'Interpretation of Statutes', duration: 150, order: 4, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'General Clauses Act', duration: 120, order: 5, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'Limitation Act', duration: 120, order: 6, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    { title: 'Administrative & Criminal Laws (Overview)', duration: 150, order: 7, moduleOrder: 1, moduleTitle: 'Jurisprudence, Interpretation & General Laws' },
    
    // Module 2: Company Law (Module I – Paper 2) - 10 lessons, orders 101-110
    { title: 'Introduction to Company Law', duration: 150, order: 101, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Incorporation of Companies', duration: 240, order: 102, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Memorandum & Articles of Association', duration: 180, order: 103, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Share Capital & Debentures', duration: 240, order: 104, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Members & Shareholders', duration: 180, order: 105, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Directors & Key Managerial Personnel', duration: 240, order: 106, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Board & General Meetings', duration: 240, order: 107, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Corporate Governance', duration: 180, order: 108, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Accounts, Audit & Dividends', duration: 240, order: 109, moduleOrder: 2, moduleTitle: 'Company Law' },
    { title: 'Compromises, Arrangements & Winding Up', duration: 240, order: 110, moduleOrder: 2, moduleTitle: 'Company Law' },
    
    // Module 3: Setting up of Business, Industrial & Labour Laws (Module I – Paper 3) - 6 lessons, orders 201-206
    { title: 'Forms of Business Organization', duration: 180, order: 201, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    { title: 'Setting up of Business', duration: 240, order: 202, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    { title: 'Industrial Laws', duration: 240, order: 203, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    { title: 'Labour Laws', duration: 240, order: 204, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    { title: 'Environment & Sustainability Laws', duration: 180, order: 205, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    { title: 'Case Studies & Legal Applications', duration: 180, order: 206, moduleOrder: 3, moduleTitle: 'Setting up of Business, Industrial & Labour Laws' },
    
    // Module 4: Tax Laws & Practice (Module I – Paper 4) - 7 lessons, orders 301-307
    { title: 'Basic Concepts of Income Tax', duration: 180, order: 301, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'Heads of Income', duration: 240, order: 302, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'Computation of Total Income', duration: 240, order: 303, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'Deductions & Exemptions', duration: 180, order: 304, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'GST – Overview & Key Provisions', duration: 240, order: 305, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'Tax Compliance & Returns', duration: 180, order: 306, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    { title: 'Practical Problems & Case Studies', duration: 240, order: 307, moduleOrder: 4, moduleTitle: 'Tax Laws & Practice' },
    
    // Module 5: Corporate & Management Accounting (Module II – Paper 5) - 6 lessons, orders 401-406
    { title: 'Corporate Accounting Basics', duration: 180, order: 401, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    { title: 'Cost Accounting Fundamentals', duration: 180, order: 402, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    { title: 'Marginal & Budgetary Costing', duration: 180, order: 403, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    { title: 'Financial Statement Analysis', duration: 180, order: 404, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    { title: 'Management Accounting Tools', duration: 180, order: 405, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    { title: 'Decision-Making Techniques', duration: 180, order: 406, moduleOrder: 5, moduleTitle: 'Corporate & Management Accounting' },
    
    // Module 6: Securities Laws & Capital Markets (Module II – Paper 6) - 7 lessons, orders 501-507
    { title: 'SEBI Act & Regulations', duration: 240, order: 501, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Securities Contracts Regulation Act', duration: 180, order: 502, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Depositories Act', duration: 150, order: 503, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Listing Obligations & Disclosure Requirements (LODR)', duration: 240, order: 504, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Insider Trading Regulations', duration: 180, order: 505, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Takeover Code', duration: 180, order: 506, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    { title: 'Case-based Market Scenarios', duration: 180, order: 507, moduleOrder: 6, moduleTitle: 'Securities Laws & Capital Markets' },
    
    // Module 7: Economic, Commercial & Intellectual Property Laws (Module II – Paper 7) - 6 lessons, orders 601-606
    { title: 'Economic Laws', duration: 150, order: 601, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    { title: 'Competition Act', duration: 150, order: 602, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    { title: 'FEMA & FDI Policy', duration: 180, order: 603, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    { title: 'Consumer Protection Act', duration: 150, order: 604, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    { title: 'Intellectual Property Rights', duration: 180, order: 605, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    { title: 'Cyber Laws & E-Commerce', duration: 180, order: 606, moduleOrder: 7, moduleTitle: 'Economic, Commercial & Intellectual Property Laws' },
    
    // Module 8: Exam Preparation, Case Writing & Revision - 8 lessons, orders 701-708
    { title: 'ICSI Study Material Coverage', duration: 60, order: 701, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: 'Past Year Question & RTP Analysis', duration: 90, order: 702, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: 'Case Law Answer Writing Techniques', duration: 90, order: 703, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: 'Module-wise Mock Tests (Module I)', duration: 120, order: 704, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: 'Module-wise Mock Tests (Module II)', duration: 120, order: 705, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: '60-Day Revision Strategy', duration: 60, order: 706, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: '30-Day Revision Strategy', duration: 60, order: 707, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
    { title: '15-Day Revision Strategy', duration: 60, order: 708, moduleOrder: 8, moduleTitle: 'Exam Preparation, Case Writing & Revision' },
  ]

  console.log('\n📚 Creating 67 lessons across 8 modules...')

  let totalDuration = 0
  for (const lesson of lessons) {
    const lessonId = `lesson-cs-exec-${lesson.order}`
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {},
      create: {
        id: lessonId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        isActive: true,
        courseId: courseId,
        content: `# ${lesson.title}

**Module ${lesson.moduleOrder}: ${lesson.moduleTitle}**

---

## Overview
This lesson covers **${lesson.title}** as part of the CS Executive curriculum.

## Learning Objectives
By the end of this lesson, you will be able to:
1. Understand the fundamentals of ${lesson.title.toLowerCase()}
2. Apply concepts to CS Executive exam questions
3. Build a strong foundation for CS Professional

## Key Topics

### Main Concept
- Core concept 1
- Core concept 2
- Core concept 3

### Practical Application
- ICSI exam patterns
- Previous year questions
- Case study approaches
- Legal provisions

## Summary
This lesson has covered the key aspects of ${lesson.title}. Make sure to review the practice questions and proceed to the next lesson.

## Resources
- ICSI study material references
- Practice questions
- Legal provisions summary
- Case law notes`,
      },
    })
    totalDuration += lesson.duration
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title}`)
  }

  // ============================================================================
  // 3. CREATE ASSESSMENTS
  // ============================================================================

  const assessments = [
    { title: 'Module I: Jurisprudence & Company Law Mock Test', type: 'PRACTICE', order: 1 },
    { title: 'Module I: Business & Tax Laws Quiz', type: 'QUIZ', order: 2 },
    { title: 'Module II: Accounting & Securities Laws Mock Test', type: 'PRACTICE', order: 3 },
    { title: 'Module II: Economic & Commercial Laws Quiz', type: 'QUIZ', order: 4 },
    { title: 'CS Executive Complete Mock Test', type: 'PRACTICE', order: 5 },
  ]

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: `assessment-cs-exec-${assessment.order}` },
      update: {},
      create: {
        id: `assessment-cs-exec-${assessment.order}`,
        title: assessment.title,
        type: assessment.type,
        isActive: true,
        courseId: courseId,
      },
    })
    console.log(`✅ Assessment created: ${assessment.title}`)
  }

  // ============================================================================
  // 4. UPDATE COURSE DURATION
  // ============================================================================

  await prisma.course.update({
    where: { id: courseId },
    data: {
      duration: totalDuration,
      description: `This course provides comprehensive and exam-oriented preparation for the Company Secretary (CS) Executive Programme, covering both modules with a strong focus on Company Law, Securities Law, Economic & Commercial Laws, and Taxation.

**What you'll learn:**
• Clear CS Executive (Both Modules) confidently
• Understand and interpret Company & Securities Laws
• Apply legal provisions to case-based questions
• Handle MCQs and descriptive answers effectively
• Build a strong foundation for CS Professional

**Level:** INTERMEDIATE | **Duration:** ${Math.round(totalDuration / 60)} Hours | **Subscription:** INR 99/month`
    }
  })

  console.log(`✅ Course duration updated to ${Math.round(totalDuration / 60)} hours`)

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n' + '='.repeat(60))
  console.log('🎉 CS Executive Complete Course updated successfully!')
  console.log('='.repeat(60))
  console.log(`\n📖 Course: ${course.title}`)
  console.log(`📁 Course ID: ${courseId}`)
  console.log(`\n📊 Structure Summary:`)
  console.log(`   📚 Total Modules: 8 (Both Modules)`)
  console.log(`   📝 Total Lessons: ${lessons.length}`)
  console.log(`   ⏱️ Total Duration: ${totalDuration} minutes (${Math.round(totalDuration / 60)} hours)`)
  console.log(`   📝 Total Assessments: ${assessments.length}`)
  console.log(`\n📚 Modules Breakdown:`)
  
  const moduleNames = [
    'Jurisprudence, Interpretation & General Laws (Module I – Paper 1)',
    'Company Law (Module I – Paper 2)',
    'Setting up of Business, Industrial & Labour Laws (Module I – Paper 3)',
    'Tax Laws & Practice (Module I – Paper 4)',
    'Corporate & Management Accounting (Module II – Paper 5)',
    'Securities Laws & Capital Markets (Module II – Paper 6)',
    'Economic, Commercial & Intellectual Property Laws (Module II – Paper 7)',
    'Exam Preparation, Case Writing & Revision',
  ]
  
  for (let i = 0; i < moduleNames.length; i++) {
    const modLessons = lessons.filter(l => l.moduleOrder === i + 1)
    const modDuration = modLessons.reduce((sum, l) => sum + l.duration, 0)
    console.log(`   ${i + 1}. ${moduleNames[i]} (${modLessons.length} lessons, ${Math.round(modDuration / 60)}h)`)
  }
  
  console.log('\n✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('❌ Error updating course:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
