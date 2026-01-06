const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting empty categories...\n');

  // Categories to delete
  const categoriesToDelete = [
    { id: 'cat_cma', name: 'CMA (Cost & Management Accountant)' },
    { id: 'cat_cs', name: 'Company Secretary' }
  ];

  for (const cat of categoriesToDelete) {
    try {
      // Check if category exists and has no courses
      const category = await prisma.category.findUnique({
        where: { id: cat.id },
        include: {
          _count: {
            select: { courses: true }
          }
        }
      });

      if (category) {
        console.log(`Found: ${cat.name} (${cat.id}) - ${category._count.courses} courses`);

        if (category._count.courses === 0) {
          await prisma.category.delete({
            where: { id: cat.id }
          });
          console.log(`✅ Deleted: ${cat.name}`);
        } else {
          console.log(`⚠️  Skipped: ${cat.name} has ${category._count.courses} courses - not empty`);
        }
      } else {
        console.log(`❌ Not found: ${cat.name} (${cat.id})`);
      }
    } catch (error) {
      console.error(`❌ Error deleting ${cat.name}:`, error.message);
    }
  }

  console.log('\n✨ Done! Empty categories have been removed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
