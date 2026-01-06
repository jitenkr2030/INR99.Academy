import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking FRM Part II course in database...\n');

  // Check if frm_part2 course exists
  const course = await prisma.course.findUnique({
    where: { id: 'frm_part2' },
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
    console.log('❌ Course "frm_part2" does not exist in database');
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
