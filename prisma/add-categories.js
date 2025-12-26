import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding missing categories and subcategories...')

  // Add missing categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'cat4',
        name: 'Data Science',
        slug: 'data-science',
        description: 'Data analysis, machine learning, and AI',
        icon: 'BarChart3',
        color: 'bg-orange-100',
        isFeatured: false,
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        id: 'cat5',
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'SEO, social media, and online marketing strategies',
        icon: 'Megaphone',
        color: 'bg-pink-100',
        isFeatured: false,
        sortOrder: 5,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Added 2 missing categories: Data Science and Digital Marketing')

  // Add additional subcategories
  const subCategories = await Promise.all([
    {
      id: 'sub8',
      name: 'Machine Learning',
      slug: 'machine-learning',
      description: 'Machine learning algorithms and applications',
      icon: 'Brain',
      color: 'bg-orange-200',
      categoryId: 'cat4',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'sub9',
      name: 'Data Visualization',
      slug: 'data-visualization',
      description: 'Data visualization techniques and tools',
      icon: 'BarChart3',
      color: 'bg-orange-200',
      categoryId: 'cat4',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'sub10',
      name: 'Social Media Marketing',
      slug: 'social-media-marketing',
      description: 'Social media marketing strategies',
      icon: 'Share2',
      color: 'bg-pink-200',
      categoryId: 'cat5',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'sub11',
      name: 'SEO & SEM',
      slug: 'seo-sem',
      description: 'Search engine optimization and marketing',
      icon: 'Search',
      color: 'bg-pink-200',
      categoryId: 'cat5',
      sortOrder: 2,
      isActive: true,
    },
  ])

  await prisma.subCategory.createMany({
    data: subCategories,
  })

  console.log('✅ Added 4 additional subcategories')

  // Add the 4th learning path
  const learningPath = await prisma.learningPath.create({
    data: {
      id: 'lp4',
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing, SEO, social media, and online advertising',
      icon: 'Megaphone',
      color: 'bg-pink-100',
      sortOrder: 4,
      isActive: true,
    },
  })

  console.log('✅ Added 4th learning path: Digital Marketing Mastery')

  console.log('🎉 Missing categories and learning path added successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })