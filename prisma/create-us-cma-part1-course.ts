import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating US CMA Part 1 course record...');

  const course = await prisma.course.create({
    data: {
      id: 'us_cma_part1',
      title: 'US CMA Part 1 – Complete Course',
      description: 'Master financial planning, performance analytics, and technology & analytics with our comprehensive US CMA Part 1 course. This course covers all essential topics for the CMA examination.',
      thumbnail: '/assets/courses/us-cma-part1.svg',
      isPremium: true,
      isPublished: true,
      level: 'ADVANCED',
      category: 'PROFESSIONAL_CERTIFICATION',
      totalDuration: 3000, // in minutes
      totalLessons: 100,
      totalAssessments: 5,
      author: 'INR99 Academy',
      language: 'ENGLISH',
      validityPeriod: 365, // 1 year in days
      price: 199.99,
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
