import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking all CMA courses in database...\n');

  // Find all courses with 'cma' in the ID
  const courses = await prisma.course.findMany({
    where: {
      id: {
        contains: 'cma',
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (courses.length > 0) {
    console.log('✅ Found CMA courses:');
    courses.forEach(course => {
      console.log(`   - ID: ${course.id} | Title: ${course.title}`);
    });
  } else {
    console.log('❌ No CMA courses found in database');
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
