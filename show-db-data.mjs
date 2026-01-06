import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('📊 DATABASE OVERVIEW')
  console.log('='.repeat(60))
  
  // Contact Messages
  console.log('\n📬 CONTACT MESSAGES')
  console.log('-'.repeat(40))
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  if (messages.length === 0) {
    console.log('No contact messages found.')
  } else {
    messages.forEach((msg, i) => {
      console.log(`\n${i + 1}. ${msg.subject}`)
      console.log(`   From: ${msg.firstName} ${msg.lastName} (${msg.email})`)
      console.log(`   Status: ${msg.status}`)
      console.log(`   Date: ${msg.createdAt}`)
      console.log(`   Attachment: ${msg.attachmentName || 'None'}`)
    })
  }
  
  // Courses Count
  console.log('\n\n📚 COURSES')
  console.log('-'.repeat(40))
  const courseCount = await prisma.course.count()
  console.log(`Total Courses: ${courseCount}`)
  
  // Users Count
  console.log('\n\n👥 USERS')
  console.log('-'.repeat(40))
  const userCount = await prisma.user.count()
  console.log(`Total Users: ${userCount}`)
  
  // Categories
  console.log('\n\n📁 CATEGORIES')
  console.log('-'.repeat(40))
  const categories = await prisma.category.findMany()
  categories.forEach(cat => {
    console.log(`- ${cat.name} (${cat.slug})`)
  })
  
  console.log('\n' + '='.repeat(60))
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(async () => await prisma.$disconnect())
