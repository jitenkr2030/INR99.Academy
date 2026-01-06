import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up CFA Level III course data...\n');

  const courseId = 'cfa_level3';

  // Delete all lessons for this course
  const deletedLessons = await prisma.lesson.deleteMany({
    where: { courseId: courseId },
  });
  console.log(`✅ Deleted ${deletedLessons.count} lessons`);

  // Delete all assessments for this course
  const deletedAssessments = await prisma.assessment.deleteMany({
    where: { courseId: courseId },
  });
  console.log(`✅ Deleted ${deletedAssessments.count} assessments`);

  console.log('\n🧹 Cleanup completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
