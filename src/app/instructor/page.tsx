"use client"

import { useState, useEffect } from 'react'

// Instructor data
const instructorStats = {
  totalCourses: 5,
  totalStudents: 156,
  totalEarnings: 45800,
  averageRating: 4.8
}

const instructorCourses = [
  { id: 1, title: 'Complete React Course', students: 45, lessons: 24, active: true },
  { id: 2, title: 'Advanced JavaScript', students: 23, lessons: 18, active: true },
  { id: 3, title: 'Node.js Backend Development', students: 67, lessons: 32, active: true }
]

const students = [
  { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', courses: 3 },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', courses: 2 },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', courses: 1 }
]

export default function InstructorDashboard() {
  const [tab, setTab] = useState('instructor')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #9333ea', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'students', label: '👥 Students' },
    { id: 'instructor', label: '📚 Instructor' }
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    console.log('Tab clicked:', tabId, 'Current tab:', tab)
    e.preventDefault()
    e.stopPropagation()
    setTab(tabId)
    console.log('Tab updated to:', tabId)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>I</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>Demo Instructor 1</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>instructor1@inr99.com</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => handleTabClick(t.id, e)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    background: tab === t.id ? '#9333ea' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {tab === 'dashboard' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, Instructor!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Track your teaching progress and student engagement</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Courses', value: instructorStats.totalCourses, icon: '📚' },
                { label: 'Total Students', value: instructorStats.totalStudents, icon: '👥' },
                { label: 'Total Earnings', value: formatCurrency(instructorStats.totalEarnings), icon: '💰' },
                { label: 'Avg Rating', value: instructorStats.averageRating.toFixed(1), icon: '⭐' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #ddd6fe' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b21a8', marginBottom: '1rem' }}>📈 Teaching Performance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f5f3ff', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9333ea' }}>{instructorStats.averageRating}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Average Rating</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Based on student feedback across all courses</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} style={{ fontSize: '1.5rem', color: star <= instructorStats.averageRating ? '#fbbf24' : '#d1d5db' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>I</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Demo Instructor 1</h3>
                <p style={{ color: '#6b7280' }}>instructor1@inr99.com</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#ddd6fe', color: '#7c3aed', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Instructor</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: 'Demo Instructor 1', icon: '👤' },
                  { label: 'Email', value: 'instructor1@inr99.com', icon: '📧' },
                  { label: 'Role', value: 'Instructor', icon: '📚' },
                  { label: 'Member Since', value: 'January 2024', icon: '📅' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</p>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>📚 My Courses</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {instructorCourses.map(course => (
                <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{course.students} students • {course.lessons} lessons</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: course.active ? '#dcfce7' : '#fef3c7', color: course.active ? '#166534' : '#854d0e' }}>{course.active ? 'Active' : 'Inactive'}</span>
                    <button type="button" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '500', background: 'white' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'students' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>👥 My Students</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {students.map(student => (
                <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#6b7280' }}>{student.name.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{student.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.email}</p>
                    </div>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', background: '#dbeafe', color: '#1e40af' }}>{student.courses} courses</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'instructor' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>📚 Instructor Dashboard</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Manage your courses and track student progress</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Courses', value: instructorStats.totalCourses, icon: '📚' },
                { label: 'Total Students', value: instructorStats.totalStudents, icon: '👥' },
                { label: 'Total Earnings', value: formatCurrency(instructorStats.totalEarnings), icon: '💰' },
                { label: 'Avg Rating', value: instructorStats.averageRating.toFixed(1), icon: '⭐' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: '#9333ea', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>➕ Create Course</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📊 View Analytics</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>💬 Student Messages</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
