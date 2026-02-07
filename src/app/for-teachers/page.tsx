import type { Metadata } from "next";
import { NewNavigation } from "@/components/new-navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Online Teaching Platform for Teachers India | Launch Your Academy at ₹99/month",
  description: "INR99 Academy provides teachers with a white-label online teaching platform to launch their own branded academy at just ₹99 per student/month. Create courses, host live classes, and grow your teaching business.",
  keywords: ["online teaching platform for teachers India", "teacher course platform", "create online courses India", "white label teaching platform", "earn from teaching online", "₹99 teaching platform"],
};

export default function ForTeachersPage() {
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
            👨‍🏫 For Teachers
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Launch Your Own Teaching Academy
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Turn your expertise into a thriving online business. Create courses, host live classes, and build your brand with INR99 Academy.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '5rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              The Struggle Every Teacher Faces
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              You have knowledge that students need, but traditional platforms make it impossible to share it effectively.
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
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📹</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                No Professional Setup
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Zoom and Google Meet are for meetings, not teaching. You need a platform built specifically for education.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Expensive Platforms
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Teaching platforms charge ₹10,000+ monthly. You barely make that much profit after sharing revenue with intermediaries.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏷️</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                No Personal Brand
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                You teach on someone else's platform. All your hard work builds THEIR brand, not yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Your Own Teaching Platform
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              INR99 Academy gives you everything you need to launch your professional online teaching business.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Feature 1 */}
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
                Your Brand, Your Identity
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Your logo, your colors, your subdomain. Students see YOUR brand, not a generic platform.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Custom subdomain (you.inr99.academy)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Your logo and colors
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Professional landing page
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
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
                Unlimited Course Creation
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Create as many courses as you want. Upload videos, PDFs, quizzes, and more.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Unlimited course uploads
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Video, PDF, and content support
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Quiz and assessment tools
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
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
                Live Classes Built-In
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Host live sessions with your students. Interactive teaching, real-time doubt clearing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> HD video streaming
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Screen sharing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Chat and Q&A features
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Direct Payments
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Accept payments directly from students. No middleman taking a cut of your earnings.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> UPI integration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Card payments
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Net banking support
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Student Management
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Track student progress, engagement, and performance. Know your students better.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Progress tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Attendance reports
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Performance analytics
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Mobile Friendly
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Students can learn on any device. Your courses work on mobile, tablet, and desktop.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Responsive design
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Low data mode
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Offline viewing
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
            Pricing That Works for Teachers
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            No setup fees. No monthly固定 charges. Just ₹99 per student per month.
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
              You set your pricing, we handle the platform
            </p>

            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '2rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                <strong>What You Get:</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Your branded platform</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Unlimited courses</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Live classes</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#374151' }}>Payment collection</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#374151' }}>Student analytics</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>✓</span>
              </div>
            </div>

            <a href="/instructor/signup" style={{
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
              Start Teaching Today
            </a>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Teachers Love INR99 Academy
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Join thousands of teachers who have transformed their teaching with INR99 Academy.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📖</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Subject Experts
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Physics, Chemistry, Math, English, or any subject. Create comprehensive courses for JEE, NEET, CAT, or board exams.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Skills Instructors
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Teach programming, digital marketing, graphic design, or any skill. Build a skills-based learning business.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🗣️</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Language Trainers
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Teach English, Hindi, or any language. Offer speaking, writing, and grammar courses to students across India.
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '1rem'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🧘</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Wellness Coaches
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                Yoga, meditation, fitness, or nutrition. Share your wellness expertise through structured courses.
              </p>
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
            Ready to Share Your Knowledge?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Join INR99 Academy today and start building your online teaching business at just ₹99 per student per month.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/instructor/signup" style={{
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
              Start Free
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
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}