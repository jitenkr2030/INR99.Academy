import DashboardLayout from '@/components/DashboardLayout'

const courses = [
  { id: 1, title: 'Complete React Course', instructor: 'John Instructor', duration: '20 hours', progress: 65, color: '#dbeafe', enrolled: '2024-01-15' },
  { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Instructor', duration: '15 hours', progress: 30, color: '#f3e8ff', enrolled: '2024-02-01' },
  { id: 3, title: 'Web Development Basics', instructor: 'Bob Instructor', duration: '10 hours', progress: 100, color: '#dcfce7', enrolled: '2024-01-10' },
  { id: 4, title: 'Python for Beginners', instructor: 'Alice Instructor', duration: '18 hours', progress: 0, color: '#fef3c7', enrolled: '2024-02-20' }
]

export default function StudentCourses() {
  const profile = {
    name: 'Demo Student 1',
    email: 'student1@inr99.com'
  }

  return (
    <DashboardLayout userRole="student" userInfo={profile}>
      <div>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '2rem' 
        }}>
          📚 My Courses
        </h1>

        {/* Course Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ea580c' }}>{courses.length}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Enrolled</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#16a34a' }}>
              {courses.filter(c => c.progress === 100).length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#eab308' }}>
              {courses.filter(c => c.progress > 0 && c.progress < 100).length}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Progress</div>
          </div>
        </div>

        {/* Courses Grid */}
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem' 
        }}>
          {courses.map(course => (
            <div 
              key={course.id}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ 
                    fontWeight: '700', 
                    fontSize: '1.25rem', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem' 
                  }}>
                    {course.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    👨‍🏫 {course.instructor}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    ⏱️ {course.duration}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    📅 Enrolled: {course.enrolled}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: course.progress === 100 ? '#16a34a' : course.progress > 0 ? '#eab308' : '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {course.progress}% Complete
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {course.progress === 100 ? 'Completed' : 
                     course.progress > 0 ? 'In Progress' : 'Not Started'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#f3f4f6', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${course.progress}%`,
                    height: '100%',
                    background: course.progress === 100 ? '#16a34a' : '#ea580c',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review' : 'Continue'}
                </button>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}