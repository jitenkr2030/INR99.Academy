import DashboardLayout from '@/components/DashboardLayout'

// Mock data for instructor
const instructorCourses = [
  { id: 1, title: 'Complete React Course', students: 45, published: true },
  { id: 2, title: 'Advanced JavaScript', students: 32, published: true },
  { id: 3, title: 'Web Development Basics', students: 67, published: true }
]

const recentStudents = [
  { name: 'Alice Johnson', course: 'React Course', progress: 85, lastActive: '2024-03-10' },
  { name: 'Bob Smith', course: 'JavaScript', progress: 60, lastActive: '2024-03-09' },
  { name: 'Carol Davis', course: 'Web Dev Basics', progress: 95, lastActive: '2024-03-08' }
]

export default function InstructorOverview() {
  const profile = {
    name: 'Demo Instructor 1',
    email: 'instructor1@inr99.com'
  }

  const totalStudents = instructorCourses.reduce((sum, course) => sum + course.students, 0)
  const totalCourses = instructorCourses.length
  const avgStudentsPerCourse = Math.round(totalStudents / totalCourses)

  return (
    <DashboardLayout userRole="instructor" userInfo={profile}>
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
            Welcome back, {profile.name.split(' ')[0]}! 👨‍🏫
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Here's your teaching overview and student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
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
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{totalCourses}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Students</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{totalStudents}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Avg Students/Course</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{avgStudentsPerCourse}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
          {/* My Courses */}
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
              My Courses
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {instructorCourses.map(course => (
                <div 
                  key={course.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {course.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        👥 {course.students} students enrolled
                      </p>
                    </div>
                    <span style={{
                      background: course.published ? '#16a34a' : '#eab308',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
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
                      View Details
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      Edit Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Student Activity */}
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
              Recent Student Activity
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recentStudents.map((student, index) => (
                <div 
                  key={index}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {student.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        📚 {student.course}
                      </p>
                    </div>
                    <span style={{
                      background: '#9333ea',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {student.progress}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Last active: {student.lastActive}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}