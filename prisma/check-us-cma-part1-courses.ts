import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking US CMA Part 1 course in database...\n');

  // Check if us_cma_part1 course exists
  const course = await prisma.course.findUnique({
    where: { id: 'us_cma_part1' },
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
    console.log('❌ Course "us_cma_part1" does not exist in database');
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
