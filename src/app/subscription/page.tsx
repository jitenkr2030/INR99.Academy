"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NewNavigation } from '@/components/new-navigation'

// Tiered pricing based on student count
const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    maxStudents: 500,
    pricePerStudent: 199,
    description: 'For smaller schools and institutions',
    features: [
      'Custom domain branding',
      'Course management system',
      'Student management dashboard',
      'Basic analytics',
      'Email support',
      'Video hosting (10GB)',
      'Live sessions (10/month)'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    maxStudents: 750,
    pricePerStudent: 149,
    description: 'For mid-size institutions',
    popular: true,
    features: [
      'Everything in Starter',
      'Advanced analytics',
      'Priority email support',
      'Video hosting (50GB)',
      'Live sessions (25/month)',
      'Bulk user import',
      'Custom branding controls'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    maxStudents: null, // 1000+
    pricePerStudent: 99,
    description: 'For large schools (1000+ students)',
    features: [
      'Everything in Growth',
      'Unlimited video hosting',
      'Unlimited live sessions',
      '24/7 priority support',
      'API access',
      'SSO integration',
      'Dedicated account manager'
    ]
  }
]

export default function SubscriptionPage() {
  const [mounted, setMounted] = useState(false)
  const [studentCount, setStudentCount] = useState<number>(100)
  const [selectedTier, setSelectedTier] = useState<string>('growth')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate monthly total based on student count and tier
  const calculateMonthlyTotal = (tier: typeof PRICING_TIERS[0]) => {
    if (tier.maxStudents === null) {
      return studentCount * tier.pricePerStudent
    }
    return Math.min(studentCount, tier.maxStudents) * tier.pricePerStudent
  }

  // Determine recommended tier based on student count
  useEffect(() => {
    if (studentCount >= 1000) {
      setSelectedTier('enterprise')
    } else if (studentCount >= 500) {
      setSelectedTier('growth')
    } else {
      setSelectedTier('starter')
    }
  }, [studentCount])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const handleSubscribe = () => {
    router.push('/institution/signup')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
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
                background: '#dbeafe',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                color: '#2563eb',
                fontWeight: '600'
              }}>
                Transparent Pricing for Schools
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              White-Label Learning Platform
              <span style={{ color: '#ea580c', display: 'block' }}>For Schools & Institutions</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Launch your own branded online academy. Choose a plan based on your student count.
              The more students you have, the lower the per-student cost!
            </p>
          </div>

          {/* Pricing Calculator */}
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', textAlign: 'center' }}>
              Calculate Your Monthly Cost
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Number of Students
              </label>
              <input
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  textAlign: 'center'
                }}
              />
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Your estimated monthly cost:
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                {formatCurrency(calculateMonthlyTotal(PRICING_TIERS.find(t => t.id === selectedTier)!))}
                <span style={{ fontSize: '1rem', fontWeight: '400', color: '#6b7280' }}>/month</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem' }}>
                Based on {studentCount} students @ {formatCurrency(PRICING_TIERS.find(t => t.id === selectedTier)!.pricePerStudent)}/student/month
              </p>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: selectedTier === tier.id ? '0 20px 25px -5px rgba(234, 88, 12, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: selectedTier === tier.id ? '2px solid #ea580c' : '1px solid #e5e7eb',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#ea580c',
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    ⭐ Most Popular
                  </div>
                )}

                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    {tier.name}
                  </h3>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#e0e7ff',
                      color: '#4338ca',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {tier.maxStudents ? `Up to ${tier.maxStudents} students` : '1000+ students'}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    {tier.description}
                  </p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.5rem', color: '#ea580c', fontWeight: 'bold' }}>₹</span>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
                      {tier.pricePerStudent}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '1rem' }}>/student/month</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                    {tier.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        <span style={{ color: '#16a34a', fontSize: '1rem' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleSubscribe}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: selectedTier === tier.id ? '#ea580c' : '#111827',
                      color: 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#c2410c'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selectedTier === tier.id ? '#ea580c' : '#111827'
                    }}
                  >
                    Get Started with {tier.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid #f59e0b'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#92400e', marginBottom: '1rem', textAlign: 'center' }}>
              How Pricing Works
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏫</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Up to 500 Students</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ea580c' }}>₹199/student/month</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total: ₹99,500/month</p>
              </div>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Up to 750 Students</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ea580c' }}>₹149/student/month</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total: ₹111,750/month</p>
              </div>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>1000+ Students</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>₹99/student/month</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Best value!</p>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
              All Plans Include
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: '🎨', title: 'White-Label Branding', desc: 'Custom domain with your school name' },
                { icon: '📚', title: 'Course Management', desc: 'Create and manage courses easily' },
                { icon: '👥', title: 'Student Dashboard', desc: 'Track progress and performance' },
                { icon: '🎥', title: 'Video Hosting', desc: 'Upload and stream video content' },
                { icon: '🔔', title: 'Live Sessions', desc: 'Host live classes and webinars' },
                { icon: '📊', title: 'Analytics', desc: 'Comprehensive insights and reports' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {[
                { q: 'How is pricing calculated?', a: 'Pricing is based on the number of enrolled students. Schools with more students pay less per student, making it more affordable as you grow.' },
                { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and bank transfers for annual subscriptions.' },
                { q: 'Is there a free trial?', a: 'Yes, all plans come with a 14-day free trial. No credit card required to start.' }
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

          {/* CTA */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            marginBottom: '4rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Launch your branded learning platform today. Join hundreds of schools already using INR99 Academy.
            </p>
            <button
              onClick={handleSubscribe}
              style={{
                padding: '1rem 3rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#ea580c',
                color: 'white',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c2410c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ea580c'
              }}
            >
              Register Your School - It's Free to Start
            </button>
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
