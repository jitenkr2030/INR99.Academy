import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import DashboardLayout from '@/components/DashboardLayout'

// Mock admin data
const systemStats = {
  totalUsers: 1250,
  totalCourses: 89,
  activeStudents: 823,
  totalInstructors: 45,
  monthlyRevenue: 45600,
  completionRate: 78
}

const recentActivity = [
  { type: 'user', action: 'New student registered', user: 'Alice Johnson', time: '5 minutes ago' },
  { type: 'course', action: 'Course published', course: 'Advanced Python', instructor: 'Dr. Smith', time: '15 minutes ago' },
  { type: 'system', action: 'System backup completed', time: '1 hour ago' },
  { type: 'user', action: 'New instructor joined', user: 'Prof. Wilson', time: '2 hours ago' }
]

export default async function AdminOverview() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const userName = session.user.name || 'Admin'
  const userEmail = session.user.email || ''

  return (
    <DashboardLayout userRole="admin" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Welcome Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            Admin Dashboard 🛠️
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            System overview and management tools
          </p>
        </div>

        {/* System Stats */}
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
            borderLeft: '4px solid #059669' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Users</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{systemStats.totalUsers.toLocaleString()}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Active Students</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{systemStats.activeStudents.toLocaleString()}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #9333ea' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Instructors</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{systemStats.totalInstructors}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #ea580c' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{systemStats.totalCourses}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Monthly Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>₹{systemStats.monthlyRevenue.toLocaleString()}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #eab308' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Completion Rate</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{systemStats.completionRate}%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
          {/* Recent Activity */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Recent Activity
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activity.type === 'user' ? '#3b82f6' : 
                               activity.type === 'course' ? '#9333ea' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem'
                  }}>
                    {activity.type === 'user' ? '👤' : 
                     activity.type === 'course' ? '📚' : '⚙️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {activity.action}
                    </div>
                    {activity.user && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        User: {activity.user}
                      </div>
                    )}
                    {activity.course && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Course: {activity.course} by {activity.instructor}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button style={{
                padding: '1rem',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>👥</span>
                Manage Users
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📚</span>
                Course Management
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📊</span>
                Analytics & Reports
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                System Settings
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#eab308',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>💰</span>
                Financial Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}