"use client"

import { useState, useEffect } from 'react'

// Admin data
const adminStats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalCourses: 45,
  totalRevenue: 124500
}

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' }
]

const courses = [
  { id: 1, title: 'Introduction to Programming', students: 45, difficulty: 'BEGINNER' },
  { id: 2, title: 'Advanced JavaScript', students: 23, difficulty: 'ADVANCED' },
  { id: 3, title: 'Web Development Basics', students: 12, difficulty: 'BEGINNER' }
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('admin')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #dc2626', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'users', label: '👥 Users' },
    { id: 'admin', label: '⚙️ Admin' }
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>Demo Admin 1</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin1@inr99.com</div>
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
                    background: tab === t.id ? '#dc2626' : '#f3f4f6',
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, Admin!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Monitor your platform performance and manage users</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: adminStats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: adminStats.totalCourses, icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(adminStats.totalRevenue), icon: '💰' }
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
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>A</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Demo Admin 1</h3>
                <p style={{ color: '#6b7280' }}>admin1@inr99.com</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Administrator</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: 'Demo Admin 1', icon: '👤' },
                  { label: 'Email', value: 'admin1@inr99.com', icon: '📧' },
                  { label: 'Role', value: 'Administrator', icon: '🛡️' },
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>📚 All Courses</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {courses.map(course => (
                <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{course.students} students</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: course.difficulty === 'BEGINNER' ? '#dcfce7' : '#fee2e2', color: course.difficulty === 'BEGINNER' ? '#166534' : '#991b1b' }}>{course.difficulty}</span>
                    <button type="button" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '500', background: 'white' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>👥 All Users</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {users.map(user => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#6b7280' }}>{user.name.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{user.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</p>
                    </div>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', background: user.status === 'Active' ? '#dcfce7' : '#fef3c7', color: user.status === 'Active' ? '#166534' : '#854d0e' }}>{user.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'admin' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>⚙️ Admin Dashboard</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Complete platform overview and management</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: adminStats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: adminStats.totalCourses, icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(adminStats.totalRevenue), icon: '💰' }
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
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>➕ Add Course</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>👤 Add User</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📊 View Reports</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
