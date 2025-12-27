"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  instructor?: {
    id: string
    name: string
    avatar?: string
    expertise?: string
  }
  learningPath?: {
    id: string
    title: string
    color: string
    icon?: string
  }
  lessonCount: number
  assessmentCount: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  courseCount: number
  color: string
}

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [activeTab, setActiveTab] = useState<'courses' | 'paths'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCourses, setTotalCourses] = useState(0)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch courses from API
      const coursesRes = await fetch('/api/courses')
      const coursesData = await coursesRes.json()
      
      if (coursesData.success) {
        setCourses(coursesData.courses)
        setTotalCourses(coursesData.pagination?.total || coursesData.courses.length)
      }

      // Fetch learning paths
      const pathsRes = await fetch('/api/learning-paths')
      const pathsData = await pathsRes.json()
      
      if (pathsData.success) {
        setLearningPaths(pathsData.learningPaths || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays on error - page will show empty state
      setCourses([])
      setLearningPaths([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  ).filter(course =>
    !selectedDifficulty || course.difficulty === selectedDifficulty
  )

  const filteredPaths = learningPaths.filter(path =>
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (loading) {
    return (
      <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <NewNavigation />
        <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    )
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
            filteredCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No courses found matching your criteria.</p>
                <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
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
                        background: course.learningPath?.color || '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '4rem' }}>📚</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          {course.learningPath && (
                            <span style={{
                              background: course.learningPath.color || '#e0e7ff',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {course.learningPath.title}
                            </span>
                          )}
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
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              By {course.instructor?.name || 'Unknown Instructor'}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {formatDuration(course.duration)} • {course.lessonCount} lessons
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
            )
          ) : (
            filteredPaths.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No learning paths found.</p>
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
                      {path.icon || '🎯'}
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
            )
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
                { icon: '📚', number: totalCourses.toString(), label: 'Expert Courses', color: '#ea580c' },
                { icon: '🎯', number: learningPaths.length.toString(), label: 'Learning Paths', color: '#16a34a' },
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
