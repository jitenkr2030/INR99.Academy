import { db } from '@/lib/db'

async function checkWebDevLessons() {
  try {
    const courseId = 'career1'
    
    const lessons = await db.lesson.findMany({
      where: {
        courseId: courseId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    })

    console.log(`Total lessons: ${lessons.length}`)
    console.log('\nLessons by order range:\n')

    // Check distribution of lessons
    const ranges = [
      { name: '1-20', min: 1, max: 20 },
      { name: '21-40', min: 21, max: 40 },
      { name: '41-60', min: 41, max: 60 },
      { name: '61-80', min: 61, max: 80 },
      { name: '81-100', min: 81, max: 100 },
      { name: '101-120', min: 101, max: 120 },
      { name: '121-140', min: 121, max: 140 },
      { name: '141-160', min: 141, max: 160 },
      { name: '161-180', min: 161, max: 180 },
      { name: '181-200', min: 181, max: 200 },
      { name: '201-220', min: 201, max: 220 },
      { name: '221-240', min: 221, max: 240 },
      { name: '241-260', min: 241, max: 260 },
      { name: '261-280', min: 261, max: 280 },
      { name: '281-300', min: 281, max: 300 },
      { name: '301-320', min: 301, max: 320 },
    ]

    for (const range of ranges) {
      const rangeLessons = lessons.filter(l => l.order >= range.min && l.order <= range.max)
      console.log(`\n=== ${range.name} (${rangeLessons.length} lessons) ===`)
      rangeLessons.forEach(l => {
        console.log(`  ${l.order}: ${l.title}`)
      })
    }

    // Check if there are any gaps
    console.log('\n=== Checking for gaps ===')
    const allOrders = lessons.map(l => l.order).sort((a, b) => a - b)
    const missingOrders: number[] = []
    
    for (let i = 1; i <= 320; i++) {
      if (!allOrders.includes(i)) {
        missingOrders.push(i)
      }
    }
    
    if (missingOrders.length > 0) {
      console.log(`Missing lesson orders: ${missingOrders.slice(0, 50).join(', ')}${missingOrders.length > 50 ? '...' : ''}`)
      console.log(`Total missing: ${missingOrders.length}`)
    } else {
      console.log('All lesson orders 1-320 are present!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkWebDevLessons()
