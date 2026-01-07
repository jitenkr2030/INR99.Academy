import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
const courses = await p.course.findMany({ 
  where: { title: { contains: 'Risk', mode: 'insensitive' } }, 
  select: { id: true, title: true } 
})
courses.forEach(c => console.log(c.id, c.title))
