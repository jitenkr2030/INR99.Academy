import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking all courses in database...\n');

  // Get all courses
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
    take: 50,
  });

  console.log(`✅ Found ${courses.length} courses:`);
  courses.forEach(course => {
    console.log(`   - ID: ${course.id} | Title: ${course.title}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
