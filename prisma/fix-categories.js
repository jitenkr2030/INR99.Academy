const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fixing category organization...');
  
  // Professional courses category ID
  const professionalCategoryId = 'cat-professional-courses';
  
  // Update CS Foundation to use Professional category
  const csFoundation = await prisma.course.update({
    where: { id: 'cs_foundation' },
    data: { categoryId: professionalCategoryId }
  });
  console.log(`Updated: ${csFoundation.title} → Professional Courses`);
  
  // Update CMA courses that might be in wrong category
  const cmaCourses = ['cma_foundation', 'cma_intermediate', 'cma_final'];
  for (const courseId of cmaCourses) {
    const course = await prisma.course.updateMany({
      where: { id: courseId, categoryId: { not: professionalCategoryId } },
      data: { categoryId: professionalCategoryId }
    });
    if (course.count > 0) {
      console.log(`Updated: ${courseId} → Professional Courses`);
    }
  }
  
  // Update CS courses that might be in wrong category
  const csCourses = ['cs_executive', 'cs_professional'];
  for (const courseId of csCourses) {
    const course = await prisma.course.updateMany({
      where: { id: courseId, categoryId: { not: professionalCategoryId } },
      data: { categoryId: professionalCategoryId }
    });
    if (course.count > 0) {
      console.log(`Updated: ${courseId} → Professional Courses`);
    }
  }
  
  console.log('\nCategory consolidation complete!');
  
  // Verify the changes
  console.log('\nVerifying course categories...');
  
  // Check CS courses
  const allCsCourses = await prisma.course.findMany({
    where: { id: { in: ['cs_foundation', 'cs_executive', 'cs_professional'] } },
    select: { id: true, title: true, categoryId: true }
  });
  console.log('CS Courses:');
  allCsCourses.forEach(c => console.log(`  - ${c.title}: ${c.categoryId}`));
  
  // Check CMA courses
  const allCmaCourses = await prisma.course.findMany({
    where: { id: { in: ['cma_foundation', 'cma_intermediate', 'cma_final'] } },
    select: { id: true, title: true, categoryId: true }
  });
  console.log('\nCMA Courses:');
  allCmaCourses.forEach(c => console.log(`  - ${c.title}: ${c.categoryId}`));
  
  // Check category counts
  const catCounts = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: 'asc' }
  });
  console.log('\nCategory Summary:');
  catCounts.forEach(c => console.log(`  ${c.name}: ${c._count.courses} courses`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
