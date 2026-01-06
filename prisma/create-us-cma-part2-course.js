const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating US CMA Part 2 course record...');

  // First, let's check what instructors exist
  const instructors = await prisma.instructor.findMany({ take: 5 });
  console.log('Available instructors:', instructors.length, 'instructors found');

  // Get the first instructor ID
  const instructorId = instructors.length > 0 ? instructors[0].id : 'inst-ca-faculty';

  const course = await prisma.course.create({
    data: {
      id: 'us_cma_part2',
      title: 'US CMA Part 2 – Complete Course',
      description: 'Strategic Financial Management covering Financial Statement Analysis, Corporate Finance, Decision Analysis, Risk Management, Investment Decisions, Professional Ethics, and Strategic Planning for CMA Part 2 examination success.',
      thumbnail: '/assets/courses/us-cma-part2.svg',
      difficulty: 'ADVANCED',
      duration: 9000, // 150 hours = 9000 minutes
      isActive: true,
      instructorId: instructorId,
      courseType: 'GENERAL',
    },
  });

  console.log('Course created successfully!');
  console.log('Course ID:', course.id);
  console.log('Course Title:', course.title);
  console.log('Duration:', course.duration, 'minutes');
  console.log('Difficulty:', course.difficulty);
}

main()
  .catch((e) => {
    console.error('Error creating course:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
