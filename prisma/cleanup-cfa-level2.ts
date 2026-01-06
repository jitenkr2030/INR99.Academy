import { db } from '@/lib/db'

async function cleanupCFALevel2Course() {
  try {
    console.log('🧹 Cleaning up existing CFA Level 2 course data...')
    
    // Delete existing lessons
    const deletedLessons = await db.lesson.deleteMany({
      where: {
        courseId: 'cfa_level2',
      },
    })
    console.log(`✅ Deleted ${deletedLessons.count} lessons`)
    
    // Delete existing assessments
    const deletedAssessments = await db.assessment.deleteMany({
      where: {
        courseId: 'cfa_level2',
      },
    })
    console.log(`✅ Deleted ${deletedAssessments.count} assessments`)
    
    console.log('\n✨ Cleanup complete! Ready for fresh data.')
    
  } catch (error) {
    console.error('Error cleaning up:', error)
  } finally {
    await db.$disconnect()
  }
}

cleanupCFALevel2Course()
