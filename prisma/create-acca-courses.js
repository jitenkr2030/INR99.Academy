const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating ACCA Level 1 and Level 2 courses...')
  
  try {
    // Get the Professional Courses instructor
    const instructor = await prisma.instructor.findFirst({
      where: {
        OR: [
          { name: { contains: 'Professional', mode: 'insensitive' } },
          { name: { contains: 'CMA', mode: 'insensitive' } }
        ]
      }
    })
    
    const instructorId = instructor?.id || 'inst_professional'
    
    // Create ACCA Level 1 course
    const level1Course = await prisma.course.upsert({
      where: { id: 'acca_level1' },
      update: {
        title: 'ACCA Level 1 (Applied Knowledge) – Complete Course',
        description: 'Complete preparation for ACCA Level 1 (Applied Knowledge) covering BT, MA, and FA papers. Build strong accounting, business, and finance fundamentals.',
        thumbnail: '/assets/courses/acca-level1.svg',
        difficulty: 'INTERMEDIATE',
        duration: 10800, // 180 hours in minutes
        isActive: true,
        instructorId: instructorId,
        courseType: 'GENERAL'
      },
      create: {
        id: 'acca_level1',
        title: 'ACCA Level 1 (Applied Knowledge) – Complete Course',
        description: 'Complete preparation for ACCA Level 1 (Applied Knowledge) covering BT, MA, and FA papers. Build strong accounting, business, and finance fundamentals.',
        thumbnail: '/assets/courses/acca-level1.svg',
        difficulty: 'INTERMEDIATE',
        duration: 10800, // 180 hours in minutes
        isActive: true,
        instructorId: instructorId,
        courseType: 'GENERAL'
      }
    })
    
    console.log('✅ Created/Updated ACCA Level 1:', level1Course.title)
    console.log('   Duration:', level1Course.duration, 'minutes (180 hours)')
    
    // Create ACCA Level 2 course
    const level2Course = await prisma.course.upsert({
      where: { id: 'acca_level2' },
      update: {
        title: 'ACCA Level 2 (Applied Skills) – Complete Course',
        description: 'Complete preparation for ACCA Level 2 (Applied Skills) covering LW, PM, TX, FR, AA, and FM papers. Master practical accounting and finance skills.',
        thumbnail: '/assets/courses/acca-level2.svg',
        difficulty: 'ADVANCED',
        duration: 18000, // 300 hours in minutes
        isActive: true,
        instructorId: instructorId,
        courseType: 'GENERAL'
      },
      create: {
        id: 'acca_level2',
        title: 'ACCA Level 2 (Applied Skills) – Complete Course',
        description: 'Complete preparation for ACCA Level 2 (Applied Skills) covering LW, PM, TX, FR, AA, and FM papers. Master practical accounting and finance skills.',
        thumbnail: '/assets/courses/acca-level2.svg',
        difficulty: 'ADVANCED',
        duration: 18000, // 300 hours in minutes
        isActive: true,
        instructorId: instructorId,
        courseType: 'GENERAL'
      }
    })
    
    console.log('✅ Created/Updated ACCA Level 2:', level2Course.title)
    console.log('   Duration:', level2Course.duration, 'minutes (300 hours)')
    
  } catch (error) {
    console.error('❌ Error creating courses:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()