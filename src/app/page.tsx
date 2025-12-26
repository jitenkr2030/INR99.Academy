"use client"

import { useState, useEffect } from 'react'
import { NewNavigation } from '@/components/new-navigation'

export default function NewLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'white' }}>
        <div style={{ paddingTop: '64px' }}>
          <div style={{ height: '600px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)' }}></div>
        </div>
      </div>
    )
  }

  const learningPaths = [
    {
      icon: '📚',
      title: 'School Learning',
      description: 'Class 1-12 with all boards - Math, Science, English, and more',
      color: '#dbeafe'
    },
    {
      icon: '🎓',
      title: 'College Foundation',
      description: 'UG degrees - Commerce, Science, Engineering prep',
      color: '#f3e8ff'
    },
    {
      icon: '💼',
      title: 'Career Skills',
      description: 'Professional development - Communication, Leadership',
      color: '#dcfce7'
    },
    {
      icon: '💰',
      title: 'Money & Business',
      description: 'Financial literacy - Investment, Business basics',
      color: '#fef3c7'
    }
  ]

  const features = [
    {
      icon: '🎯',
      title: 'Concept Clarity',
      description: 'Understanding concepts, not just exam shortcuts',
      bgColor: '#eff6ff'
    },
    {
      icon: '💵',
      title: '₹99/Month',
      description: 'Affordable like UPI - accessible to every Indian',
      bgColor: '#f0fdf4'
    },
    {
      icon: '🏫',
      title: 'Complete Ecosystem',
      description: 'School + College + Skills + Career in one platform',
      bgColor: '#faf5ff'
    },
    {
      icon: '📱',
      title: 'India-First Design',
      description: 'Built for Indian students with local context',
      bgColor: '#fffbeb'
    }
  ]

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white',
        padding: '8rem 1rem 5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Badges */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              🚀 Learning Utility Model
            </span>
            <span style={{
              background: 'rgba(74, 222, 128, 0.2)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem'
            }}>
              🎥 New: Live Learning
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            From Class 1 to Career — <br />
            <span style={{ color: '#facc15' }}>Learning for Every Indian</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            A learning utility, just like UPI — for every Indian student
          </p>

          {/* CTA Button */}
          <a href="/auth/login" style={{
            display: 'inline-block',
            background: 'white',
            color: '#2563eb',
            padding: '0.875rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            marginBottom: '3rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            Start Learning Today
          </a>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>1-12</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>School Classes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>14+</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Learning Paths</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#facc15' }}>₹99</div>
              <div style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section style={{
        padding: '5rem 1rem',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Four Main Learning Paths
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive learning structure for every stage of your educational journey
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {learningPaths.map((path, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '0.75rem',
                  background: path.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1rem'
                }}>
                  {path.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {path.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {path.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Why We're Different
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We're not a coaching center. We're a learning utility focused on foundation building.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: feature.bgColor,
                  borderRadius: '0.75rem'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '4rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <span style={{
              display: 'inline-block',
              background: '#fed7aa',
              color: '#c2410c',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Our Philosophy
            </span>
            <blockquote style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              fontStyle: 'italic',
              lineHeight: '1.4',
              marginBottom: '1.5rem'
            }}>
              "INR99 Academy is a growing learning utility. Content is added continuously based on real user needs."
            </blockquote>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Unlike static coaching programs, we evolve based on what learners actually need. Every new course, tutorial, and resource is developed in response to genuine student requests and community feedback.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.875rem' }}>
                <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></span>
                Live & Growing
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                📝 User-Driven Content
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                🎯 Community Feedback
              </span>
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of learners across India building their future with INR99.Academy
          </p>
          <a href="/subscription" style={{
            display: 'inline-block',
            background: 'white',
            color: '#2563eb',
            padding: '0.875rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Learning at ₹99/month
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            INR99.Academy
          </h3>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            India's Learning Infrastructure - As reliable as UPI
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem',
            lineHeight: '1.5'
          }}>
            This platform provides conceptual learning and academic support. It is not affiliated with any board, university, or examination authority.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            color: '#9ca3af',
            fontSize: '0.75rem'
          }}>
            <span>© 2024 INR99.Academy</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
