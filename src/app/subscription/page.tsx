"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { PaymentProcessor } from '@/components/payment-processor'

export default function SubscriptionPage() {
  const [mounted, setMounted] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [studentCount, setStudentCount] = useState<number>(100)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const handleSubscribe = () => {
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    alert('Subscription Activated! Welcome to INR99.Academy!')
    setShowPayment(false)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (showPayment) {
    return (
      <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <NewNavigation />
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <PaymentProcessor 
              defaultAmount={99 * studentCount}
              planType="essential"
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '4rem 0 3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                background: '#dcfce7',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                color: '#16a34a',
                fontWeight: '600'
              }}>
                Free Platform Access for Schools
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              White-Label Learning Platform
              <span style={{ color: '#ea580c', display: 'block' }}>For Schools & Parents</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Launch your own branded online academy at no cost to your school. 
              Parents pay only ₹99/month per student for premium learning content.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { icon: '✓', text: 'Free for schools', bg: '#dcfce7', color: '#16a34a' },
                { icon: '✓', text: '₹99/month per student', bg: '#dbeafe', color: '#2563eb' },
                { icon: '✓', text: 'Full branding control', bg: '#f3e8ff', color: '#9333ea' }
              ].map((item, index) => (
                <span key={index} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: item.bg,
                  color: item.color,
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#92400e' }}>
                How the Essential Plan Works
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏫</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>For Schools</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Get a fully branded learning platform with custom subdomain, course management, and student tracking — completely free for your institution.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍👩‍👧</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>For Parents</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Pay just ₹99/month per student for access to premium courses, video lessons, live sessions, and personalized learning paths.
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Revenue Share</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Schools earn 30% commission on every parent subscription. With 1,000 students paying ₹99/month, your school earns ₹29,700/month!
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Calculate Your School's Earnings
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Enter the number of students at your school to see how much revenue you can generate through parent subscriptions.
            </p>
            
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', textAlign: 'left' }}>
                Number of Students
              </label>
              <input
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
                min="1"
              />
              
              <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Revenue</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{formatCurrency(99 * studentCount)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>School Commission (30%)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>{formatCurrency(99 * studentCount * 0.3)}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annual Earnings Potential</p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#ea580c' }}>{formatCurrency(99 * studentCount * 0.3 * 12)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Essential Plan */}
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '2px solid #ea580c',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                ⭐ RECOMMENDED
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Essential Plan</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>The most popular choice for schools transitioning to digital learning</p>
            </div>
            
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', color: '#ea580c', fontWeight: 'bold' }}>₹</span>
                <span style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111827' }}>99</span>
                <span style={{ color: '#6b7280', fontSize: '1rem' }}>/month per student</span>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Schools get <strong>FREE platform access</strong> — no monthly fees, no hidden costs
              </p>
              
              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  What's Included for Schools
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'White-label platform access',
                    'Custom subdomain & branding',
                    'Course management system',
                    'Student management dashboard',
                    'Analytics & progress tracking',
                    'Live session hosting',
                    'Video hosting with PPTX conversion',
                    'Email & chat support',
                    '30% commission on parent subscriptions'
                  ].map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0',
                      fontSize: '0.875rem',
                      color: '#374151',
                      borderBottom: index < 8 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <span style={{ color: '#16a34a', fontSize: '1rem' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ background: '#f0fdf4', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                  What Parents Get
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  Premium access to all courses, unlimited video lessons, live classes, downloadable content, and personalized learning paths for their child.
                </p>
              </div>
              
              <button
                onClick={handleSubscribe}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: '#ea580c',
                  color: 'white',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c2410c'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ea580c'
                }}
              >
                Get Started - Free for Schools
              </button>
              
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
                Parents pay ₹99/month per student. Schools earn 30% commission.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
              Everything You Need for Digital Learning
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: '🎥',
                  title: 'Video Hosting',
                  description: 'Upload and stream video content with our built-in CDN. Supports PPTX to video conversion.'
                },
                {
                  icon: '📚',
                  title: 'Course Management',
                  description: 'Create, organize, and manage courses with ease. Drag-and-drop course builder.'
                },
                {
                  icon: '👥',
                  title: 'Student Tracking',
                  description: 'Monitor student progress, completion rates, and performance with detailed analytics.'
                },
                {
                  icon: '🔔',
                  title: 'Live Sessions',
                  description: 'Host live classes and webinars with integrated video conferencing.'
                },
                {
                  icon: '📊',
                  title: 'Analytics Dashboard',
                  description: 'Comprehensive insights into student engagement and course effectiveness.'
                },
                {
                  icon: '🎨',
                  title: 'White-Label',
                  description: 'Full branding control with custom domains, logos, and color schemes.'
                }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                30-Day Money Back Guarantee
              </h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '600px', margin: '0 auto' }}>
              Not satisfied with your learning experience? Get a full refund within 30 days of purchase. 
              No questions asked, no hassle.
            </p>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {[
                {
                  q: 'How is this free for schools?',
                  a: 'Schools receive the platform at no cost. We generate revenue through parent subscriptions, and schools earn a 30% commission on all payments made by parents of their students.'
                },
                {
                  q: 'What if a parent cannot afford ₹99/month?',
                  a: 'Schools can use their commission earnings to subsidize or cover the cost for students from economically weaker sections.'
                },
                {
                  q: 'Can we use our own domain name?',
                  a: 'Yes! The Essential plan includes custom subdomain access. For a fully custom domain (e.g., learning.yourschool.com), contact our sales team.'
                },
                {
                  q: 'How do we receive our commission?',
                  a: 'Commissions are processed monthly via bank transfer. Schools receive their earnings within 15 days of the billing cycle.'
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>{faq.q}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2026 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
