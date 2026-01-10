"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { NewNavigation } from '@/components/new-navigation'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  difficulty: string
  duration: number
  lessonCount: number
  instructor: {
    name: string
  }
}

interface ApiResponse {
  success: boolean
  course: Course
}

// List of major Indian universities grouped by region
const UNIVERSITY_REGIONS = [
  {
    region: 'North India',
    universities: [
      { id: 'du', name: 'Delhi University (DU)', state: 'Delhi' },
      { id: 'jnu', name: 'Jawaharlal Nehru University (JNU)', state: 'Delhi' },
      { id: 'bhu', name: 'Banaras Hindu University (BHU)', state: 'Uttar Pradesh' },
      { id: 'aligarh', name: 'Aligarh Muslim University (AMU)', state: 'Uttar Pradesh' },
      { id: 'lucknow', name: 'Lucknow University', state: 'Uttar Pradesh' },
      { id: 'pu', name: 'Punjab University', state: 'Punjab' },
      { id: 'hpu', name: 'Himachal Pradesh University', state: 'Himachal Pradesh' },
      { id: 'ku', name: 'Kurukshetra University', state: 'Haryana' },
    ]
  },
  {
    region: 'South India',
    universities: [
      { id: 'bangalore', name: 'Bangalore University', state: 'Karnataka' },
      { id: 'manipal', name: 'Manipal University', state: 'Karnataka' },
      { id: 'anna', name: 'Anna University', state: 'Tamil Nadu' },
      { id: 'vit', name: 'VIT University', state: 'Tamil Nadu' },
      { id: 'srm', name: 'SRM University', state: 'Tamil Nadu' },
      { id: 'osmania', name: 'Osmania University', state: 'Telangana' },
      { id: 'hydrabad', name: 'University of Hyderabad', state: 'Telangana' },
      { id: 'kerala', name: 'University of Kerala', state: 'Kerala' },
    ]
  },
  {
    region: 'East India',
    universities: [
      { id: 'cu', name: 'Calcutta University', state: 'West Bengal' },
      { id: 'jadavpur', name: 'Jadavpur University', state: 'West Bengal' },
      { id: 'bhu_bihar', name: 'Bihar University', state: 'Bihar' },
      { id: 'patna', name: 'Patna University', state: 'Bihar' },
      { id: 'rrc', name: 'Ranchi University', state: 'Jharkhand' },
      { id: 'ouat', name: 'Odisha University', state: 'Odisha' },
    ]
  },
  {
    region: 'West India',
    universities: [
      { id: 'mdu', name: 'Mumbai University (MU)', state: 'Maharashtra' },
      { id: 'pune', name: 'Savitribai Phule Pune University', state: 'Maharashtra' },
      { id: 'gu', name: 'Gujarat University', state: 'Gujarat' },
      { id: 'msu', name: 'M.S. University', state: 'Gujarat' },
      { id: 'rajasthan', name: 'Rajasthan University', state: 'Rajasthan' },
      { id: 'jodhpur', name: 'Jodhpur University', state: 'Rajasthan' },
    ]
  },
  {
    region: 'Central India',
    universities: [
      { id: 'bu', name: 'Barkatullah University', state: 'Madhya Pradesh' },
      { id: 'du_indore', name: 'Devi Ahilya University', state: 'Madhya Pradesh' },
      { id: 'rgtu', name: 'RGPV University', state: 'Madhya Pradesh' },
    ]
  }
]

// PG course categories
const PG_CATEGORIES = [
  { id: 'mba', name: 'MBA', icon: '💼', courses: ['pg_mba_finance', 'pg_mba_marketing', 'pg_mba_hr', 'pg_mba_operations'] },
  { id: 'mcom', name: 'M.Com', icon: '📊', courses: ['pg_mcom_accounting', 'pg_mcom_finance', 'pg_mcom_business'] },
  { id: 'msc', name: 'M.Sc', icon: '🔬', courses: ['pg_msc_maths', 'pg_msc_physics', 'pg_msc_chemistry', 'pg_msc_cs', 'pg_msc_data_science'] },
  { id: 'mca', name: 'MCA', icon: '💻', courses: ['pg_mca'] },
  { id: 'ma', name: 'M.A.', icon: '📚', courses: ['pg_ma_economics', 'pg_ma_history', 'pg_ma_psychology', 'pg_ma_english'] },
  { id: 'llm', name: 'LL.M.', icon: '⚖️', courses: ['pg_llm_corporate', 'pg_llm_criminal', 'pg_llm_constitutional'] },
  { id: 'support', name: 'Support Courses', icon: '🎯', courses:['pg_net_prep', 'pg_gate_prep', 'pg_career_guidance'] },
]

// Thumbnail mapping for PG courses
const PG_COURSE_THUMBNAILS: Record<string, string> = {
  'pg_mba_finance': '/assets/courses/pg-mba-finance.svg',
  'pg_mba_marketing': '/assets/courses/pg-mba-marketing.svg',
  'pg_mba_hr': '/assets/courses/pg-mba-hr.svg',
  'pg_mba_operations': '/assets/courses/pg-mba-operations.svg',
  'pg_mcom_accounting': '/assets/courses/pg-mcom-accounting.svg',
  'pg_mcom_finance': '/assets/courses/pg-mcom-finance.svg',
  'pg_mcom_business': '/assets/courses/pg-mcom-business.svg',
  'pg_msc_maths': '/assets/courses/pg-msc-maths.svg',
  'pg_msc_physics': '/assets/courses/pg-msc-physics.svg',
  'pg_msc_chemistry': '/assets/courses/pg-msc-chemistry.svg',
  'pg_msc_cs': '/assets/courses/pg-msc-cs.svg',
  'pg_msc_data_science': '/assets/courses/pg-msc-data-science.svg',
  'pg_mca': '/assets/courses/pg-mca.svg',
  'pg_ma_economics': '/assets/courses/pg-ma-economics.svg',
  'pg_ma_history': '/assets/courses/pg-ma-history.svg',
  'pg_ma_psychology': '/assets/courses/pg-ma-psychology.svg',
  'pg_ma_english': '/assets/courses/pg-ma-english.svg',
  'pg_llm_corporate': '/assets/courses/pg-llm-corporate.svg',
  'pg_llm_criminal': '/assets/courses/pg-llm-criminal.svg',
  'pg_llm_constitutional': '/assets/courses/pg-llm-constitutional.svg',
  'pg_net_prep': '/assets/courses/pg-net-prep.svg',
  'pg_gate_prep': '/assets/courses/pg-gate-prep.svg',
  'pg_career_guidance': '/assets/courses/pg-career-guidance.svg',
}

export default function PGCoursesPage() {
  const router = useRouter()
  const [selectedUniversity, setSelectedUniversity] = useState<{id: string, name: string, state: string} | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRegion, setExpandedRegion] = useState<string>('North India')

  // Fetch all PG courses
  useEffect(() => {
    const fetchPGCourses = async () => {
      setLoading(true)
      try {
        const pgCourseIds = PG_CATEGORIES.flatMap(cat => cat.courses)
        const allCourses: Course[] = []
        
        for (const courseId of pgCourseIds) {
          const response = await fetch(`/api/courses/${courseId}`)
          if (response.ok) {
            const data: ApiResponse = await response.json()
            if (data.success) {
              allCourses.push(data.course)
            }
          }
        }
        
        setCourses(allCourses)
      } catch (err) {
        console.error('Failed to fetch PG courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPGCourses()
  }, [])

  // Filter courses based on selections
  const filteredCourses = useMemo(() => {
    let result = courses

    if (selectedCategory) {
      const category = PG_CATEGORIES.find(cat => cat.id === selectedCategory)
      if (category) {
        result = result.filter(course => category.courses.includes(course.id))
      }
    }

    return result
  }, [courses, selectedCategory])

  // Get course thumbnail
  const getCourseThumbnail = (courseId: string) => {
    return PG_COURSE_THUMBNAILS[courseId] || '/assets/courses/pg-mba-finance.svg'
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
          padding: '3rem 1rem',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Post-Graduate Education
              </h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                Advanced courses for Master's degrees and professional qualifications. 
                Select your university to get started!
              </p>
            </div>

            {/* University Selector */}
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              padding: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Select Your University
              </h2>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Choose from 100+ universities across India
              </p>

              {/* University List by Region */}
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {UNIVERSITY_REGIONS.map(region => (
                  <div key={region.region} style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setExpandedRegion(expandedRegion === region.region ? '' : region.region)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: expandedRegion === region.region ? '#ede9fe' : '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#5b21b6',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span>{region.region}</span>
                      <span style={{ 
                        transform: expandedRegion === region.region ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}>▼</span>
                    </button>
                    
                    {expandedRegion === region.region && (
                      <div style={{ 
                        padding: '0.5rem 0 0.5rem 1rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {region.universities.map(uni => (
                          <button
                            key={uni.id}
                            onClick={() => setSelectedUniversity(uni)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: selectedUniversity?.id === uni.id ? '#7c3aed' : 'white',
                              color: selectedUniversity?.id === uni.id ? 'white' : '#374151',
                              border: `1px solid ${selectedUniversity?.id === uni.id ? '#7c3aed' : '#d1d5db'}`,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              textAlign: 'left',
                              transition: 'all 0.2s'
                            }}
                          >
                            {uni.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Selected University Info */}
              {selectedUniversity && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#ecfdf5', 
                  borderRadius: '0.5rem',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#10b981', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#065f46' }}>
                      Selected: {selectedUniversity.name}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                      Showing courses aligned with your university curriculum
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUniversity(null)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      border: '1px solid #10b981',
                      borderRadius: '0.375rem',
                      color: '#10b981',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Categories */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Category Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedCategory === null ? '#7c3aed' : 'white',
                color: selectedCategory === null ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              All Courses
            </button>
            {PG_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedCategory === category.id ? '#7c3aed' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '1.25rem', color: '#6b7280' }}>Loading courses...</div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                {selectedCategory 
                  ? `No courses found in ${PG_CATEGORIES.find(c => c.id === selectedCategory)?.name}`
                  : 'No PG courses available yet'}
              </p>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                Check back soon for more courses!
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                  {selectedCategory 
                    ? PG_CATEGORIES.find(c => c.id === selectedCategory)?.name 
                    : 'All Post-Graduate Courses'}
                </h2>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {filteredCourses.length} courses
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      aspectRatio: '16/9',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      position: 'relative'
                    }}>
                      <img
                        src={getCourseThumbnail(course.id)}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 4rem;">📚</span>'
                        }}
                      />
                      {/* Duration Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {formatDuration(course.duration)}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#ede9fe',
                        color: '#5b21b6',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.75rem'
                      }}>
                        🎓 Master's Degree
                      </span>

                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {course.title}
                      </h3>

                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {course.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          By {course.instructor.name}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          background: '#7c3aed',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          View Course
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* University CTA Section */}
        <div style={{ 
          background: 'white', 
          borderTop: '1px solid #e5e7eb',
          padding: '3rem 1rem'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Don't See Your University?
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Our courses are designed following common university curricula across India. 
              Most M.Sc, M.Com, MBA, and MA programs follow similar syllabi.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Browse All Courses
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#7c3aed',
                border: '1px solid #7c3aed',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Request Your University
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2026 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
