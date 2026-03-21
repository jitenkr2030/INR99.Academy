import type { Metadata } from "next";
import { NewNavigation } from "@/components/new-navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About INR99 Academy | White-Label Online Education Platform",
  description: "Learn about INR99 Academy - a white-label online education platform helping teachers, coaching institutes, and schools launch their branded academy at ₹99 per student/month.",
  keywords: ["about INR99 Academy", "white-label education platform", "online academy India", "learning management system", "education technology", "coaching institute software"],
};

export default function AboutPage() {
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
            🎓 About INR99 Academy
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            About INR99 Academy
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Empowering educators across India with affordable, branded learning infrastructure
          </p>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              The Problem We Solve
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Traditional education platforms are expensive, complicated, and out of reach for most Indian teachers, coaching institutes, and schools.
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
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                High Costs
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Most LMS platforms charge thousands of rupees monthly, making them inaccessible for small coaching centers and individual teachers.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Technical Complexity
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Complex setups require technical expertise that most educators simply do not have. You should teach, not struggle with software.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                No Branding
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Generic platforms mean your students never see YOUR brand. You invest in marketing but benefit someone else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Who INR99 Academy Is For
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Our platform is designed for educators who want to focus on teaching while we handle the technology.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Individual Teachers */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Individual Teachers
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Subject experts, tutors, and freelance educators who want to monetize their knowledge with their own branded platform.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Create and sell courses
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Host live classes
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Track student progress
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Accept payments directly
                </li>
              </ul>
            </div>

            {/* Coaching Institutes */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Coaching Institutes
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                JEE, NEET, CAT, UPSC, SSC, Banking, and other competitive exam preparation centers looking to go digital.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Full digital ecosystem
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Batch management
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Test series integration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> White-label domain
                </li>
              </ul>
            </div>

            {/* Schools & Colleges */}
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
                Schools & Colleges
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Educational institutions wanting to offer online learning to their students with their own branded portal.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom subdomain
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Parent/student portals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Attendance tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Progress reports
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
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            We believe every educator deserves access to professional learning infrastructure.
          </p>

          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
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
              marginBottom: '1.5rem'
            }}>
              ✨ Most Affordable in India
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '4rem', fontWeight: '800', color: '#16a34a' }}>₹99</span>
              <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>per student/month</span>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              For institutions with fewer than 1000 students
            </p>

            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Platform Access</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓ Unlimited</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Course Creation</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓ Unlimited</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Live Classes</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓ Included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>White-Label Domain</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓ Included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#374151' }}>Student Dashboard</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓ Included</span>
              </div>
            </div>

            <a href="/institution/signup" style={{
              display: 'block',
              background: '#16a34a',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.125rem',
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
              Start Your Platform Today
            </a>

            <div style={{
              background: '#f0fdf4',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1.5rem'
            }}>
              <p style={{ color: '#166534', fontSize: '0.875rem', margin: 0 }}>
                <strong>Free for Large Institutions:</strong> Schools and colleges with 1000+ students get full access absolutely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Context Section */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Built for India
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Every feature designed with Indian educators and students in mind.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📱</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Mobile-First Design
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Works seamlessly on low-end smartphones with 2G/3G connections
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌐</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Multi-Language Support
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Content and interface available in multiple Indian languages
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💳</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                UPI Integration
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Accept payments via UPI, cards, and net banking seamlessly
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Low Data Mode
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Optimized for users with limited data plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1.5rem'
            }}>
              Our Vision
            </h2>
            <blockquote style={{
              fontSize: '1.375rem',
              fontWeight: '600',
              color: '#1f2937',
              fontStyle: 'italic',
              lineHeight: '1.5',
              marginBottom: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto 1.5rem'
            }}>
              "To democratize quality education by giving every teacher, institute, and school the tools to launch their own professional online academy — starting at just ₹99 per student."
            </blockquote>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We believe that geography should never limit access to quality education. Just as UPI transformed financial transactions, we aim to transform education delivery across India.
            </p>
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
            Ready to Launch Your Academy?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Join thousands of educators who trust INR99 Academy to power their online learning journey.
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