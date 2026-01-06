const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🎓 Creating School Education (INR99 Academy) Course...\n');

  const courseId = 'school_education';

  // Create the main course
  const course = await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      title: '🏫 School Education (INR99 Academy)',
      description: 'Complete K-12 education platform covering Primary, Middle, Secondary, and Senior Secondary levels with all subjects, exam preparation, and life skills. From Class 1 to Class 12 - Math, Science, Commerce, Arts, Board Exams, and more!',
      duration: 5000, // Extended duration for comprehensive content
      difficulty: 'BEGINNER',
      thumbnail: '/assets/courses/school-education.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });

  console.log('✅ Course created:', course.title);

  // Store course ID for lesson creation
  global.schoolCourseId = courseId;
  global.lessonCounter = 1;
  global.assessmentCounter = 1;

  console.log('\n📚 Now creating lessons for all school levels...\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
