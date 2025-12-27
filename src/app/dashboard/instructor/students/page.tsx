"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  lastActive: string
}

export default function InstructorStudents() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/instructor/students')
      const data = await res.json()
      if (data.success) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
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
          <p>Loading students...</p>
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            My Students 👥
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Track student progress and engagement across your courses
          </p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #9333ea' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Students</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{students.length}</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Active This Week</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
              {students.filter(s => new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
          </div>
        </div>

        {/* Students List */}
        {students.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '3rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No students yet
            </h2>
            <p style={{ color: '#6b7280' }}>
              Students will appear here once they enroll in your courses.
            </p>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              All Students ({students.length})
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {students.map((student, index) => (
                <div 
                  key={student.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      background: '#9333ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}>
                      {student.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {student.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {student.email}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{student.enrolledCourses}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Courses</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last active</div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>
                        {new Date(student.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
