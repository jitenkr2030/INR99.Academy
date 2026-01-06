import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking CFA Level III course in database...\n');

  // Check if cfa_level3 course exists
  const course = await prisma.course.findUnique({
    where: { id: 'cfa_level3' },
    include: {
      lessons: true,
      assessments: true,
    },
  });

  if (course) {
    console.log('✅ Course found:', course.title);
    console.log(`   - Lessons count: ${course.lessons.length}`);
    console.log(`   - Assessments count: ${course.assessments.length}`);
  } else {
    console.log('❌ Course "cfa_level3" does not exist in database');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
