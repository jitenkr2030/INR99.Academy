const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Reorganizing School Education Category...\n');

  // 1. Update the main School Learning Category
  const schoolCategory = await prisma.category.update({
    where: { id: 'cat-school-learning' },
    data: {
      name: '🏫 School Education',
      description: 'Complete school education from Class 1-12 with board exam prep, concept clarity, and skill development',
      icon: '🏫',
      color: '#3B82F6',
      isFeatured: true,
    }
  });
  console.log('Updated main category:', schoolCategory.name);

  // 2. Update Learning Paths for School Education
  
  // Primary School (Class 1-5)
  const primarySchool = await prisma.learningPath.update({
    where: { id: 'primary-school' },
    data: {
      title: '📘 Primary School (Class 1-5)',
      description: 'Foundation education with basics of Math, English, EVS, and concept building',
      icon: 'BookOpen',
      color: '#10B981',
      categoryId: 'school-education',
      sortOrder: 1,
    }
  });
  console.log('Updated:', primarySchool.title);

  // Middle School (Class 6-8)
  const middleSchool = await prisma.learningPath.update({
    where: { id: 'middle-school' },
    data: {
      title: '📘 Middle School (Class 6-8)',
      description: 'Building blocks - Math, Science, Social Science with concept clarity',
      icon: 'GraduationCap',
      color: '#F59E0B',
      categoryId: 'school-education',
      sortOrder: 2,
    }
  });
  console.log('Updated:', middleSchool.title);

  // High School (Class 9-10)
  const highSchool = await prisma.learningPath.update({
    where: { id: 'high-school' },
    data: {
      title: '📗 Secondary School (Class 9-10)',
      description: 'Board exam preparation for CBSE, ICSE, and State Boards',
      icon: 'Award',
      color: '#8B5CF6',
      categoryId: 'school-education',
      sortOrder: 3,
    }
  });
  console.log('Updated:', highSchool.title);

  // Senior Secondary (Class 11-12)
  const seniorSecondary = await prisma.learningPath.upsert({
    where: { id: 'senior-secondary' },
    update: {
      title: '🔹 Senior Secondary (Class 11-12)',
      description: 'Science, Commerce, and Arts streams with career-oriented learning',
      icon: 'Star',
      color: '#EF4444',
      categoryId: 'school-education',
      sortOrder: 4,
    },
    create: {
      id: 'senior-secondary',
      title: '🔹 Senior Secondary (Class 11-12)',
      description: 'Science, Commerce, and Arts streams with career-oriented learning',
      icon: 'Star',
      color: '#EF4444',
      categoryId: 'school-education',
      sortOrder: 4,
      pathType: 'GENERAL',
      isActive: true,
    }
  });
  console.log('Updated:', seniorSecondary.title);

  // 3. Create NEW Learning Paths for Exam-Focused Sections
  
  // Board Exam Crash Prep
  const boardExamPrep = await prisma.learningPath.upsert({
    where: { id: 'board-exam-crash-prep' },
    update: {},
    create: {
      id: 'board-exam-crash-prep',
      title: '📝 Board Exam Crash Prep',
      description: '30-60 day strategies, important questions, PYQs, revision notes, and mock tests',
      icon: 'FileText',
      color: '#DC2626',
      categoryId: 'school-education',
      sortOrder: 5,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', boardExamPrep.title);

  // Concept Clarity & Doubt Solving
  const conceptClarity = await prisma.learningPath.upsert({
    where: { id: 'concept-clarity-doubt' },
    update: {},
    create: {
      id: 'concept-clarity-doubt',
      title: '🧠 Concept Clarity & Doubt Solving',
      description: 'Weak topic simplification, one-shot videos, formula breakdowns, and common mistakes explained',
      icon: 'Lightbulb',
      color: '#7C3AED',
      categoryId: 'school-education',
      sortOrder: 6,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', conceptClarity.title);

  // 4. Create NEW Learning Paths for Stream-wise Senior Secondary
  
  // Science Stream (Class 11-12)
  const scienceStream = await prisma.learningPath.upsert({
    where: { id: 'science-stream-class11-12' },
    update: {},
    create: {
      id: 'science-stream-class11-12',
      title: '🔬 Science Stream (Class 11-12)',
      description: 'Physics, Chemistry, Mathematics, Biology for Science stream students',
      icon: 'Flask',
      color: '#059669',
      categoryId: 'school-education',
      sortOrder: 7,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', scienceStream.title);

  // Commerce Stream (Class 11-12)
  const commerceStream = await prisma.learningPath.upsert({
    where: { id: 'commerce-stream-class11-12' },
    update: {},
    create: {
      id: 'commerce-stream-class11-12',
      title: '📊 Commerce Stream (Class 11-12)',
      description: 'Accountancy, Business Studies, Economics, and Mathematics for Commerce students',
      icon: 'TrendingUp',
      color: '#D97706',
      categoryId: 'school-education',
      sortOrder: 8,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', commerceStream.title);

  // Arts/Humanities Stream (Class 11-12)
  const artsStream = await prisma.learningPath.upsert({
    where: { id: 'arts-stream-class11-12' },
    update: {},
    create: {
      id: 'arts-stream-class11-12',
      title: '🎭 Arts / Humanities (Class 11-12)',
      description: 'History, Political Science, Geography, Economics, Sociology, Psychology',
      icon: 'Palette',
      color: '#DB2777',
      categoryId: 'school-education',
      sortOrder: 9,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', artsStream.title);

  // 5. Create Skill Add-ons Learning Path
  const skillAddons = await prisma.learningPath.upsert({
    where: { id: 'skill-addons-school' },
    update: {},
    create: {
      id: 'skill-addons-school',
      title: '🎯 Skill Add-ons for School Students',
      description: 'English Speaking, Handwriting, Mental Math, Study Techniques, Memory Training, Exam Fear Reduction',
      icon: 'Zap',
      color: '#0EA5E9',
      categoryId: 'school-education',
      sortOrder: 10,
      pathType: 'SCHOOL',
      isActive: true,
    }
  });
  console.log('Created:', skillAddons.title);

  // 6. Update existing secondary-school learning path
  const secondarySchool = await prisma.learningPath.update({
    where: { id: 'secondary-school' },
    data: {
      title: '📗 Class 9-10 Board Prep',
      description: 'Complete board exam preparation with CBSE/ICSE syllabus coverage',
      icon: 'BookOpen',
      color: '#6366F1',
      categoryId: 'school-education',
      sortOrder: 3,
    }
  });
  console.log('Updated:', secondarySchool.title);

  console.log('\n✅ School Education Category reorganization complete!');
  
  // Show all school-related learning paths
  console.log('\n📋 School Education Learning Paths:');
  const allSchoolPaths = await prisma.learningPath.findMany({
    where: {
      categoryId: { in: ['school-education', 'school-exam-prep', 'school-senior-secondary', 'school-skills'] }
    },
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }]
  });
  
  for (const path of allSchoolPaths) {
    console.log(`  • ${path.title} (${path.categoryId})`);
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
