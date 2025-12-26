"use client"

import { useState, useEffect } from 'react'

// Courses data
const courses = [
  { id: 1, title: 'Complete React Course', instructor: 'John Instructor', duration: '20 hours', progress: 65, color: '#dbeafe' },
  { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Instructor', duration: '15 hours', progress: 30, color: '#f3e8ff' },
  { id: 3, title: 'Web Development Basics', instructor: 'Bob Instructor', duration: '10 hours', progress: 100, color: '#dcfce7' },
  { id: 4, title: 'Python for Beginners', instructor: 'Alice Instructor', duration: '18 hours', progress: 0, color: '#fef3c7' }
]

// Certificates data  
const certificates = [
  { id: 1, number: 'INR99-2024-001', course: 'Web Development Basics', date: '2024-03-15' },
  { id: 2, number: 'INR99-2024-002', course: 'Introduction to Python', date: '2024-02-20' }
]

// Profile data
const profile = {
  name: 'Demo Student 1',
  email: 'student1@inr99.com',
  mobile: '+91 9876543210',
  location: 'India',
  memberSince: 'January 2024',
  bio: 'Passionate learner exploring web development and programming.'
}

export default function StudentDashboard() {
  const [tab, setTab] = useState('dashboard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #ea580c', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'certificates', label: '🎓 Certificates' }
  ]

  const totalCourses = courses.length
  const completedCourses = courses.filter(c => c.progress === 100).length
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length
  const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)

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
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
                {profile.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{profile.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{profile.email}</div>
              </div>
            </div>

            {/* Tab Buttons */}
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
                    background: tab === t.id ? '#ea580c' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, {profile.name}!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Continue your learning journey and track your progress</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Courses', value: totalCourses, icon: '📚' },
                { label: 'Completed', value: completedCourses, icon: '✅' },
                { label: 'In Progress', value: inProgressCourses, icon: '📖' },
                { label: 'Avg Progress', value: `${avgProgress}%`, icon: '📊' }
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

            {courses.find(c => c.progress > 0 && c.progress < 100) && (
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #fed7aa' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#9a3412', marginBottom: '1rem' }}>📺 Continue Learning</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ aspectRatio: '16/9', background: '#dbeafe', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📚</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Complete React Course</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>By John Instructor • 20 hours</p>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>65% complete</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                        <div style={{ width: '65%', height: '100%', background: '#ea580c', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                    <button type="button" style={{ marginTop: '1rem', background: '#ea580c', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Continue Learning</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
                  {profile.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{profile.name}</h3>
                <p style={{ color: '#6b7280' }}>{profile.email}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Student</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: profile.name, icon: '👤' },
                  { label: 'Email', value: profile.email, icon: '📧' },
                  { label: 'Mobile', value: profile.mobile, icon: '📱' },
                  { label: 'Location', value: profile.location, icon: '📍' },
                  { label: 'Member Since', value: profile.memberSince, icon: '📅' },
                  { label: 'Bio', value: profile.bio, icon: '✍️' }
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

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>📚 My Courses</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {courses.map(course => (
                <div key={course.id} style={{ background: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ aspectRatio: '16/9', background: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                    {course.progress === 100 ? '🎉' : '📚'}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{course.instructor} • {course.duration}</p>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{course.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                        <div style={{ width: `${course.progress}%`, height: '100%', background: course.progress === 100 ? '#22c55e' : '#ea580c', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                    <button type="button" style={{ display: 'block', width: '100%', padding: '0.5rem', background: course.progress === 100 ? '#22c55e' : '#ea580c', color: 'white', borderRadius: '0.375rem', border: 'none', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
                      {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {tab === 'certificates' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>🎓 My Certificates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {certificates.map(cert => (
                <div key={cert.id} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: '#dcfce7', color: '#166534' }}>BEGINNER</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>✅ Verified</span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{cert.course}</h3>
                  <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#6b7280' }}>Certificate:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#374151' }}>{cert.number}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Issued:</span>
                      <span style={{ color: '#374151' }}>{cert.date}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" style={{ flex: 1, padding: '0.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>⬇️ Download</button>
                    <button type="button" style={{ flex: 1, padding: '0.5rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>🔗 Verify</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
