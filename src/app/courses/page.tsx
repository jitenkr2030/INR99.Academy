"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

// Demo courses data
const demoCourses = [
  {
    id: '1',
    title: 'Complete React Development',
    description: 'Master React from scratch with hands-on projects',
    instructor: 'John Doe',
    difficulty: 'BEGINNER',
    duration: '20 hours',
    lessonCount: 45,
    color: '#dbeafe'
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Learn advanced JS concepts and design patterns',
    instructor: 'Jane Smith',
    difficulty: 'ADVANCED',
    duration: '15 hours',
    lessonCount: 32,
    color: '#f3e8ff'
  },
  {
    id: '3',
    title: 'Python for Data Science',
    description: 'Start your data science journey with Python',
    instructor: 'Bob Wilson',
    difficulty: 'INTERMEDIATE',
    duration: '25 hours',
    lessonCount: 50,
    color: '#dcfce7'
  },
  {
    id: '4',
    title: 'Web Development Basics',
    description: 'Learn HTML, CSS, and JavaScript fundamentals',
    instructor: 'Alice Brown',
    difficulty: 'BEGINNER',
    duration: '18 hours',
    lessonCount: 40,
    color: '#fef3c7'
  },
  {
    id: '5',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend services with Node.js',
    instructor: 'Charlie Davis',
    difficulty: 'INTERMEDIATE',
    duration: '22 hours',
    lessonCount: 38,
    color: '#fee2e2'
  },
  {
    id: '6',
    title: 'UI/UX Design Fundamentals',
    description: 'Create beautiful and user-friendly interfaces',
    instructor: 'Diana Lee',
    difficulty: 'BEGINNER',
    duration: '16 hours',
    lessonCount: 28,
    color: '#e0e7ff'
  }
]

const demoLearningPaths = [
  {
    id: 'school',
    title: 'School Learning',
    description: 'Class 1-12 with all boards',
    courseCount: 150,
    color: '#dbeafe'
  },
  {
    id: 'college',
    title: 'College Foundation',
    description: 'UG degrees preparation',
    courseCount: 80,
    color: '#f3e8ff'
  },
  {
    id: 'career',
    title: 'Career Skills',
    description: 'Professional development',
    courseCount: 100,
    color: '#dcfce7'
  },
  {
    id: 'business',
    title: 'Money & Business',
    description: 'Financial literacy',
    courseCount: 60,
    color: '#fef3c7'
  }
]

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [activeTab, setActiveTab] = useState<'courses' | 'paths'>('courses')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const filteredCourses = demoCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPaths = demoLearningPaths.filter(path =>
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return { bg: '#dcfce7', text: '#16a34a' }
      case 'INTERMEDIATE': return { bg: '#fef3c7', text: '#d97706' }
      case 'ADVANCED': return { bg: '#fee2e2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '3rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                Explore Our Course Library
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                Discover courses designed for Indian learners with practical skills and real-world applications.
              </p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    fontSize: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                display: 'inline-flex'
              }}>
                <button
                  onClick={() => setActiveTab('courses')}
                  style={{
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: activeTab === 'courses' ? 'white' : 'transparent',
                    color: activeTab === 'courses' ? '#111827' : '#6b7280',
                    boxShadow: activeTab === 'courses' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  📚 All Courses
                </button>
                <button
                  onClick={() => setActiveTab('paths')}
                  style={{
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: activeTab === 'paths' ? 'white' : 'transparent',
                    color: activeTab === 'paths' ? '#111827' : '#6b7280',
                    boxShadow: activeTab === 'paths' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  🎯 Learning Paths
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
              Filters:
            </span>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            {(selectedDifficulty || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedDifficulty('')
                  setSearchTerm('')
                }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}

            <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>
              {activeTab === 'courses' 
                ? `${filteredCourses.length} courses found`
                : `${filteredPaths.length} learning paths found`
              }
            </div>
          </div>

          {/* Content */}
          {activeTab === 'courses' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredCourses.map((course) => {
                const diffColors = getDifficultyColor(course.difficulty)
                return (
                  <div
                    key={course.id}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      aspectRatio: '16/9',
                      background: course.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      📚
                    </div>
                    
                    {/* Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {course.difficulty}
                        </span>
                      </div>
                      
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
                        lineHeight: '1.5'
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
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            By {course.instructor}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {course.duration} • {course.lessonCount} lessons
                          </p>
                        </div>
                        <Link href={`/courses/${course.id}`} style={{
                          display: 'inline-block',
                          background: '#ea580c',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredPaths.map((path) => (
                <div
                  key={path.id}
                  style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '2rem',
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
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '0.75rem',
                    background: path.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1rem'
                  }}>
                    {path.id === 'school' ? '📚' : path.id === 'college' ? '🎓' : path.id === 'career' ? '💼' : '💰'}
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {path.title}
                  </h3>
                  
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    {path.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {path.courseCount} courses
                    </span>
                    <Link href={`/learning-paths/${path.id}`} style={{
                      color: '#ea580c',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      Explore →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              {[
                { icon: '📚', number: '150+', label: 'Expert Courses', color: '#ea580c' },
                { icon: '🎯', number: '4', label: 'Learning Paths', color: '#16a34a' },
                { icon: '⏱️', number: '500+', label: 'Video Lessons', color: '#2563eb' },
                { icon: '👨‍🏫', number: '50+', label: 'Expert Instructors', color: '#9333ea' }
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stat.label}</div>
                </div>
              ))}
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
            © 2024 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
