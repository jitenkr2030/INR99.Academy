"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'

interface Course {
  id: string
  title: string
  description: string
  isActive: boolean
  _count: {
    lessons: number
    progress: number
  }
  createdAt: string
}

export default function InstructorCourses() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/instructor/courses')
      const data = await res.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const userName = session?.user?.name || 'Instructor'
  const userEmail = session?.user?.email || ''

  if (loading) {
    return (
      <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading courses...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              My Courses 👨‍🏫
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage and track your course progress
            </p>
          </div>
          <a
            href="/dashboard/instructor/overview"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#9333ea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            + Create New Course
          </a>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '3rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No courses yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Create your first course to start teaching!
            </p>
            <a
              href="/dashboard/instructor/overview"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Create Course
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {courses.map(course => (
              <div 
                key={course.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {course.description}
                    </p>
                  </div>
                  <span style={{
                    background: course.isActive ? '#16a34a' : '#eab308',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {course.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <span>📚 {course._count.lessons} Lessons</span>
                  <span>👥 {course._count.progress} Students</span>
                  <span>📅 {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Edit Course
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    View Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
