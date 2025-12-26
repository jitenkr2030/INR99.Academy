import { redirect } from 'next/navigation'
import { auth } from '@/auth'

// Demo course data - very simple
const demoCourses = [
  { id: '1', title: 'Complete React Course', progress: 65 },
  { id: '2', title: 'Advanced JavaScript', progress: 30 },
  { id: '3', title: 'Web Development Basics', progress: 100 },
]

export default async function DashboardPage() {
  let session = null
  let isAuthenticated = false

  try {
    session = await auth()
    isAuthenticated = !!session?.user
  } catch (error) {
    // If session check fails, try to continue
    isAuthenticated = false
  }

  if (!isAuthenticated || !session?.user) {
    // Redirect to login if not authenticated
    redirect('/auth/login')
  }

  const user = session.user
  const userName = (user as { name?: string }).name || user.name || 'User'

  // Calculate simple stats
  const totalCourses = demoCourses.length
  const completedCourses = demoCourses.filter(c => c.progress === 100).length
  const avgProgress = Math.round(demoCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome back, {userName}!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Continue your learning journey</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Courses</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalCourses}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Completed</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{completedCourses}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Progress</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{avgProgress}%</p>
          </div>
        </div>

        {/* Courses */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>My Courses</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {demoCourses.map(course => (
            <div key={course.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '600' }}>{course.title}</h3>
                <span style={{ background: course.progress === 100 ? '#22c55e' : '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}>
                  {course.progress}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: `${course.progress}%`, height: '100%', background: course.progress === 100 ? '#22c55e' : '#ea580c', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
