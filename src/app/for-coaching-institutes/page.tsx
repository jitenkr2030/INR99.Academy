import type { Metadata } from "next";
import { NewNavigation } from "@/components/new-navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Online Coaching Platform India | Launch Digital Academy at ₹99/month",
  description: "INR99 Academy provides coaching institutes with a white-label online coaching platform to launch their branded digital academy at just ₹99 per student/month. Transform your coaching center into a digital powerhouse.",
  keywords: ["online coaching platform India", "coaching institute software", "digital coaching center", "JEE NEET coaching online", "white label LMS for coaching", "coaching management software"],
};

export default function ForCoachingInstitutesPage() {
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white',
        padding: '6rem 1rem 4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            marginBottom: '1.5rem'
          }}>
            🏫 For Coaching Institutes
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Transform Your Coaching Institute into a Digital Academy
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Take your coaching business online. Reach more students, increase revenue, and build your brand with INR99 Academy.
          </p>
        </div>
      </section>

      {/* Why Go Digital Section */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Why Coaching Institutes Are Going Digital
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              The education landscape has changed. Students expect online options. Coaching centers that adapt will thrive.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Expand Beyond Local
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Your coaching center is limited by local students. Go digital and reach students across India, even globally.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                New Revenue Streams
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Sell online courses, recorded classes, and test series. Generate revenue even when students aren't physically present.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Build Your Brand
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                A white-label platform puts YOUR coaching institute's brand front and center. Students know who to thank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Everything Your Coaching Institute Needs
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              A complete digital ecosystem designed specifically for coaching institutes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Batch Management */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Batch Management
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Organize students into batches. Track progress by batch. Manage multiple courses simultaneously.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Create unlimited batches
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Batch-wise content access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Performance comparison
                </li>
              </ul>
            </div>

            {/* Test Series */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Test Series Platform
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Create and sell test series. Full-length mocks, chapter tests, and practice quizzes.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Create unlimited tests
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Auto-grading
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Detailed analytics
                </li>
              </ul>
            </div>

            {/* Live Classes */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Live Classes
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Host live teaching sessions. Interactive doubt clearing and real-time engagement.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> HD video streaming
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Screen sharing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Session recording
                </li>
              </ul>
            </div>

            {/* Content Library */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Content Library
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Build a comprehensive content library. Videos, PDFs, presentations, and more.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Video hosting
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> PDF documents
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Presentation support
                </li>
              </ul>
            </div>

            {/* Student Portal */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Student Dashboard
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Give students their own dashboard. Track progress, view courses, and access content.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Progress tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Performance reports
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Mobile access
                </li>
              </ul>
            </div>

            {/* White-Label */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                White-Label Platform
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Your logo, your colors, your subdomain. Complete brand control.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom subdomain
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Your logo
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom colors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Affordable Pricing for Coaching Institutes
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Choose the plan that fits your institute size. Volume discounts automatically applied.
          </p>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Starter Plan */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#dbeafe',
                color: '#1e40af',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Starter
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937' }}>₹199</span>
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>/student/month</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                For institutes with up to 500 students
              </p>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Full platform access
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Live classes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Test series
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom domain
                </div>
              </div>
            </div>

            {/* Growth Plan */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '2px solid #2563eb',
              position: 'relative',
              transform: 'scale(1.05)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2563eb',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Most Popular
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#dcfce7',
                color: '#166534',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Growth
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#16a34a' }}>₹149</span>
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>/student/month</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                For institutes with up to 750 students
              </p>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Everything in Starter
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Priority support
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Advanced analytics
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom branding
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fef3c7',
                color: '#92400e',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                Enterprise
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937' }}>₹99</span>
                <span style={{ fontSize: '1rem', color: '#6b7280' }}>/student/month</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                For institutes with 1000+ students
              </p>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Everything in Growth
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Dedicated account manager
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom integrations
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> SLA guarantee
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#f0fdf4',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginTop: '2.5rem',
            maxWidth: '600px',
            margin: '2.5rem auto 0'
          }}>
            <p style={{ color: '#166534', fontSize: '0.9375rem', margin: 0 }}>
              <strong>Volume Discounts:</strong> Larger institutes benefit from lower per-student rates. Contact our sales team for institutes above 2000 students.
            </p>
          </div>

          <a href="/institution/signup" style={{
            display: 'inline-block',
            background: '#16a34a',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1.125rem',
            marginTop: '2rem',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#15803d'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#16a34a'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          >
            Start Your Digital Academy
          </a>
        </div>
      </section>

      {/* Exam Categories */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Perfect for All Exam Categories
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Whether you coach for engineering, medical, civil services, or banking, we have you covered.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>JEE</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Engineering Entrance</p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚕️</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>NEET</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Medical Entrance</p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>CAT</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Management Entrance</p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏛️</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>UPSC</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Civil Services</p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏦</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>SSC</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Staff Selection</p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💼</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Banking</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>IBPS, SBI, RBI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        padding: '5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Ready to Go Digital?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Transform your coaching institute into a modern digital academy with volume-based pricing starting from ₹99 per student per month.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/institution/signup" style={{
              display: 'inline-block',
              background: 'white',
              color: '#2563eb',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Free Trial
            </a>
            <a href="/contact" style={{
              display: 'inline-block',
              background: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              border: '2px solid white',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}