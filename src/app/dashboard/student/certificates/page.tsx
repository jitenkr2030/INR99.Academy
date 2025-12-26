import DashboardLayout from '@/components/DashboardLayout'

const certificates = [
  { id: 1, number: 'INR99-2024-001', course: 'Web Development Basics', date: '2024-03-15', instructor: 'Bob Instructor' },
  { id: 2, number: 'INR99-2024-002', course: 'Introduction to Python', date: '2024-02-20', instructor: 'Alice Instructor' }
]

export default function StudentCertificates() {
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
          🎓 My Certificates
        </h1>

        {/* Certificate Stats */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: '700', color: '#ea580c', marginBottom: '0.5rem' }}>
            {certificates.length}
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Certificates Earned
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Keep learning to earn more certificates!
          </div>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '3rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              No certificates yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Complete your courses to earn certificates and showcase your achievements.
            </p>
            <button style={{
              padding: '0.75rem 2rem',
              background: '#ea580c',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Browse Courses
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {certificates.map(cert => (
              <div 
                key={cert.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  position: 'relative'
                }}
              >
                {/* Certificate Ribbon */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#16a34a',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  ✓ VERIFIED
                </div>

                <div style={{ display: 'flex', alignItems: 'start', gap: '2rem', flexWrap: 'wrap' }}>
                  {/* Certificate Icon */}
                  <div style={{
                    minWidth: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #ea580c, #f59e0b)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    🏆
                  </div>

                  {/* Certificate Details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      marginBottom: '1rem' 
                    }}>
                      Certificate of Completion
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#374151', minWidth: '100px' }}>Course:</span>
                        <span style={{ color: '#6b7280' }}>{cert.course}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#374151', minWidth: '100px' }}>Instructor:</span>
                        <span style={{ color: '#6b7280' }}>{cert.instructor}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#374151', minWidth: '100px' }}>Date:</span>
                        <span style={{ color: '#6b7280' }}>{cert.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#374151', minWidth: '100px' }}>ID:</span>
                        <span style={{ color: '#6b7280', fontFamily: 'monospace' }}>{cert.number}</span>
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
                        📥 Download PDF
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
                        🔗 Share Certificate
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
                        ✅ Verify Online
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}