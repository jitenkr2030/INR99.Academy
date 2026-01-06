import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Searching for courses with us/cma/part...\n');

  // Search for courses containing us, cma, or part
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { id: { contains: 'us' } },
        { id: { contains: 'cma' } },
        { title: { contains: 'CMA', mode: 'insensitive' } },
        { title: { contains: 'US', mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  if (courses.length > 0) {
    console.log(`✅ Found ${courses.length} matching courses:`);
    courses.forEach(course => {
      console.log(`   - ID: ${course.id} | Title: ${course.title}`);
    });
  } else {
    console.log('❌ No matching courses found');
    
    // List all CMA courses
    console.log('\n📋 All CMA-related courses:');
    const cmaCourses = await prisma.course.findMany({
      where: {
        OR: [
          { id: { contains: 'cma' } },
          { title: { contains: 'CMA', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
      },
    });
    cmaCourses.forEach(course => {
      console.log(`   - ID: ${course.id} | Title: ${course.title}`);
    });
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
