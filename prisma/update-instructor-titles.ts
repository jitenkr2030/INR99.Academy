import { db } from '@/lib/db'

async function updateInstructorTitles() {
  console.log('Updating instructor titles...\n')

  // Update Dr. Meera Krishnan / Meera Iyer
  const instructor1 = await db.instructor.findFirst({
    where: { 
      OR: [
        { name: { contains: 'Meera' } },
        { name: { contains: 'Krishnan' } }
      ]
    }
  })

  if (instructor1) {
    await db.instructor.update({
      where: { id: instructor1.id },
      data: { 
        title: 'Physics Professor',
        name: 'Dr. Meera Krishnan' // Ensure correct name
      }
    })
    console.log(`✅ Updated instructor: ${instructor1.name} -> Title: Physics Professor`)
  }

  // Update Prof. Rajesh Kumar
  const instructor2 = await db.instructor.findFirst({
    where: { name: { contains: 'Rajesh' } }
  })

  if (instructor2) {
    await db.instructor.update({
      where: { id: instructor2.id },
      data: { title: 'English Professor' }
    })
    console.log(`✅ Updated instructor: ${instructor2.name} -> Title: English Professor`)
  }

  // List all instructors
  console.log('\nAll instructors in database:')
  const allInstructors = await db.instructor.findMany({
    select: {
      id: true,
      name: true,
      title: true,
      bio: true
    }
  })

  allInstructors.forEach(inst => {
    console.log(`  - ${inst.name} (${inst.title || 'No title'})`)
  })

  console.log('\n✅ Instructor titles updated successfully!')
}

updateInstructorTitles()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
