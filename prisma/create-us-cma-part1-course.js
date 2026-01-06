const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating US CMA Part 1 course record...');

  // First, let's check what instructors exist
  const instructors = await prisma.instructor.findMany({ take: 5 });
  console.log('Available instructors:', instructors);

  // Get the first instructor ID or use a default
  const instructorId = instructors.length > 0 ? instructors[0].id : 'default_instructor';

  const course = await prisma.course.create({
    data: {
      id: 'us_cma_part1',
      title: 'US CMA Part 1 – Complete Course',
      description: 'Master financial planning, performance analytics, and technology & analytics with our comprehensive US CMA Part 1 course. This course covers all essential topics for the CMA examination.',
      thumbnail: '/assets/courses/us-cma-part1.svg',
      difficulty: 'ADVANCED',
      duration: 3000,
      isActive: true,
      instructorId: instructorId,
      courseType: 'GENERAL',
    },
  });

  console.log('Course created successfully:', course);
}

main()
  .catch((e) => {
    console.error('Error creating course:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
