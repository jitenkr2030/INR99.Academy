"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { PaymentProcessor } from '@/components/payment-processor'

interface SubscriptionPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  duration: string
  userLimit: string
  bestFor: string
  features: string[]
  popular?: boolean
  isCustom?: boolean
}

export default function SubscriptionPage() {
  const [mounted, setMounted] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlanId, setSelectedPlanId] = useState<string>('professional')

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

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'institutional',
      name: 'Institutional',
      monthlyPrice: 99,
      yearlyPrice: 990,
      duration: 'month',
      userLimit: '1,500+ students',
      bestFor: 'Large institutions (1500+ students)',
      features: [
        'White-label platform access',
        'Custom subdomain',
        'Basic branding controls',
        'Course management',
        'Student management',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 999,
      yearlyPrice: 8990,
      duration: 'month',
      userLimit: 'Up to 150 users',
      bestFor: 'Small coaching institutes',
      features: [
        'Custom subdomain',
        'Full branding suite',
        'Basic analytics',
        'Email support',
        'Course management',
        'Student management',
        'Live sessions (5/month)',
        'Bulk user import (up to 50)'
      ],
      popular: false
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 3499,
      yearlyPrice: 31490,
      duration: 'month',
      userLimit: 'Up to 500 users',
      bestFor: 'Mid-size institutes',
      features: [
        'Custom subdomain',
        'Full branding suite',
        'Advanced analytics',
        'Priority email support',
        'Course management',
        'Student management',
        'Live sessions (20/month)',
        'Bulk user import (up to 200)',
        'Custom domain',
        'API access'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      monthlyPrice: 6999,
      yearlyPrice: 62990,
      duration: 'month',
      userLimit: 'Up to 800 users',
      bestFor: 'Expanding schools',
      features: [
        'Custom domain',
        'Full branding suite',
        'Advanced analytics',
        'Priority support',
        'Course management',
        'Student management',
        'Live sessions (50/month)',
        'Bulk user import (unlimited)',
        'API access',
        'Custom integrations'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 9999,
      yearlyPrice: 89990,
      duration: 'month',
      userLimit: 'Up to 1,000 users',
      bestFor: 'Growing schools',
      features: [
        'Custom domain',
        'Advanced customization',
        'Full analytics suite',
        'Priority support',
        'API access',
        'Custom integrations',
        'Unlimited live sessions',
        'Bulk user import (unlimited)',
        'SSO integration'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 0,
      yearlyPrice: 0,
      duration: 'custom',
      userLimit: 'Unlimited users',
      bestFor: 'Large school chains',
      features: [
        'White-label solution',
        'Dedicated infrastructure',
        'Custom development',
        '24/7 phone support',
        'SLA guarantee',
        'On-premise option',
        'Custom integrations',
        'Dedicated account manager'
      ],
      isCustom: true
    }
  ]

  const handleSubscribe = (planId: string) => {
    setSelectedPlanId(planId)
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

  const getSelectedPlan = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlanId)
    if (!plan) return subscriptionPlans[2] // Default to Professional
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  }

  if (showPayment) {
    return (
      <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <NewNavigation />
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '64px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <PaymentProcessor 
              defaultAmount={getSelectedPlan()}
              planType={selectedPlanId}
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
                background: '#fef3c7',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                color: '#92400e',
                fontWeight: '600'
              }}>
                🚀 White-Label Platform for Schools - Starting at ₹99/month
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              White-Label Learning Platform
              <span style={{ color: '#ea580c', display: 'block' }}>For Schools & Institutions</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Launch your own branded online academy. Choose a plan based on your student count. 
              Custom subdomain, full branding controls, and powerful learning management features included.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { icon: '✅', text: 'Custom subdomain' },
                { icon: '✅', text: 'Full branding control' },
                { icon: '✅', text: 'Multi-tenant architecture' }
              ].map((item, index) => (
                <span key={index} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: index === 0 ? '#dcfce7' : index === 1 ? '#dbeafe' : '#f3e8ff',
                  color: index === 0 ? '#16a34a' : index === 1 ? '#2563eb' : '#9333ea',
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

          {/* Notice - Quarterly & Yearly Available */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#92400e' }}>
                White-Label Plans for Schools & Institutions
              </h3>
            </div>
            <p style={{ color: '#a16207', fontSize: '0.95rem' }}>
              Choose <strong>₹99/month</strong> (1,500+ students), <strong>₹999/month</strong> (150 users), <strong>₹3,499/month</strong> (500 users), <strong>₹6,999/month</strong> (800 users), <strong>₹9,999/month</strong> (1,000 users), or <strong>Enterprise</strong> for unlimited users! 
              Get <strong>10% off</strong> with yearly billing.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem'
          }}>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: billingCycle === 'monthly' ? '600' : '400',
              color: billingCycle === 'monthly' ? '#111827' : '#9ca3af'
            }}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                width: '60px',
                height: '32px',
                borderRadius: '9999px',
                background: billingCycle === 'yearly' ? '#16a34a' : '#d1d5db',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '4px',
                left: billingCycle === 'yearly' ? '32px' : '4px',
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </button>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: billingCycle === 'yearly' ? '600' : '400',
              color: billingCycle === 'yearly' ? '#111827' : '#9ca3af'
            }}>
              Yearly <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.875rem' }}>(Save 10%)</span>
            </span>
          </div>

          {/* Subscription Plans */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  border: plan.popular ? '2px solid #ea580c' : '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {plan.popular && (
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
                    {plan.name}
                  </h3>
                  
                  {/* User Limit Badge */}
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
                      {plan.userLimit}
                    </span>
                  </div>
                  
                  {/* Best For */}
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    {plan.bestFor}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    {plan.isCustom ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827' }}>
                          Custom
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '1.5rem', color: '#ea580c', fontWeight: 'bold' }}>₹</span>
                          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
                            {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '1rem' }}>/{billingCycle === 'yearly' ? 'year' : plan.duration}</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600' }}>
                              Save ₹{plan.monthlyPrice * 12 - plan.yearlyPrice} per year!
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        color: '#374151'
                      }}>
                        <span style={{
                          color: '#16a34a',
                          fontSize: '1rem',
                          flexShrink: 0
                        }}>
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => plan.isCustom ? window.location.href = '/contact' : handleSubscribe(plan.id)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: plan.popular
                          ? '#ea580c'
                          : plan.isCustom
                          ? '#7c3aed'
                          : '#111827',
                      color: 'white',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (plan.popular) {
                        e.currentTarget.style.background = '#c2410c'
                      } else if (plan.isCustom) {
                        e.currentTarget.style.background = '#6b21a8'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.popular) {
                        e.currentTarget.style.background = '#ea580c'
                      } else if (plan.isCustom) {
                        e.currentTarget.style.background = '#7c3aed'
                      }
                    }}
                  >
                    {plan.isCustom ? (
                      '📞 Contact Sales'
                    ) : plan.popular ? (
                      billingCycle === 'yearly' ? '🔥 Get Started - Best Value' : '🔥 Get Started - Most Popular'
                    ) : plan.id === 'institutional' ? (
                      billingCycle === 'yearly' ? '🚀 Start - ₹990/year' : '🚀 Start Free - 1,500+ Students'
                    ) : (
                      '✅ Get Started'
                    )}
                  </button>
                </div>
              </div>
            ))}
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
