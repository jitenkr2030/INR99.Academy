const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Course IDs that the API route code expects (from the route.ts file)
const EXPECTED_COURSE_IDS = [
  // Confusion Removers
  'cr_english_mastery', 'cr_indian_constitution', 'cr_upi', 'cr_digital', 
  'cr_fraud', 'cr_bulk', 'cr_community', 'cr_foodwork', 'cr_money', 'cr_gov', 'cr_english',
  
  // Additional courses mentioned in API
  'python-masterclass', 'data-science-python', 'web-development-bootcamp',
  'ui-ux-design-masterclass', 'digital-marketing-complete', 'personal-finance-mastery',
  'stock-market-fundamentals', 'indian-constitution-citizenship', 'excel-mastery',
  'cyber-safety-awareness', 'job-prep-complete', 'startup-foundation',
  'meditation-mindfulness', 'bcom-financial-accounting', 'class10-mathematics',
  'course_public_speaking', 'career14',
  
  // School Education
  'school_primary_1_5', 'school_primary_6_8', 'school_secondary_9_10',
  'school_senior_science', 'school_senior_commerce', 'school_senior_arts',
  'school_exam_prep', 'school_skills',
  
  // College Education
  'college_bsc_pcm', 'college_bsc_pcb', 'college_bsc_cs', 'college_bsc_bio',
  'college_bsc_stats', 'college_bcom', 'college_bba', 'college_ba_history',
  'college_ba_polsc', 'college_ba_psychology', 'college_btech_cs', 'college_llb',
  'college_semester_support', 'college_exam_prep', 'college_career_skills',
  
  // Government Exams
  'upsc_prelims', 'upsc_mains', 'upsc_interview', 'advanced-answer-writing-mastery',
  'ssc_chsl', 'ssc_cgl', 'ssc_mts', 'state_police', 'state_tet',
  
  // Professional Courses
  'course-commerce-basics', 'course-ca-foundation', 'course-ca-intermediate',
  'course-ca-final', 'cs_executive', 'cs_foundation', 'cs_professional',
  'cma_foundation', 'cma_intermediate', 'cma_final', 'cfa_level1', 'cfa_level2',
  'cfa_level3', 'frm_part1', 'frm_part2', 'us_cma_part1', 'us_cma_part2',
  'us_cpa', 'acca_level1', 'acca_level2', 'acca_level3',
  
  // Advanced Trading Courses
  'stock-market-basics', 'stock-market-advanced-trading', 'options-trading-mastery',
  'technical-analysis-master', 'price-action-trading', 'risk-management-masterclass',
  'no-code-algo-trading', 'mutual-funds-sip-mastery',
  
  // Misc
  'course-actuarial-science', 'advanced-excel-pro'
]

async function main() {
  console.log('🔍 Checking which expected course IDs exist in database...\n')

  try {
    const existingCourses = await prisma.course.findMany({
      select: { id: true, title: true }
    })

    const existingIds = new Set(existingCourses.map(c => c.id))
    
    console.log(`📊 Database has ${existingCourses.length} courses\n`)
    
    console.log('❌ Expected IDs that are MISSING from database:')
    console.log('='.repeat(70))
    
    const missing = []
    const found = []
    
    for (const expectedId of EXPECTED_COURSE_IDS) {
      if (existingIds.has(expectedId)) {
        found.push(expectedId)
      } else {
        missing.push(expectedId)
        console.log(`❌ ${expectedId}`)
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`✅ Found: ${found.length} courses`)
    console.log(`❌ Missing: ${missing.length} courses`)
    
    console.log('\n\n📚 Courses that ARE in the database:')
    console.log('='.repeat(70))
    existingCourses.forEach((course, i) => {
      console.log(`${String(i + 1).padStart(2)}. ${course.id.padEnd(25)} - ${course.title}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
