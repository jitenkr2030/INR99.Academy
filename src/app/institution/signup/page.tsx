'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Eligibility threshold constant
const ELIGIBILITY_THRESHOLD = 1000

export default function InstitutionSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)
  const [checkingDomain, setCheckingDomain] = useState(false)
  const [eligible, setEligible] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'school',
    email: '',
    phone: '',
    adminName: '',
    adminPassword: '',
    confirmPassword: '',
    customDomain: '',
    studentCount: '',
  })

  // Check domain availability
  useEffect(() => {
    if (formData.customDomain.length >= 3) {
      checkDomain()
    } else {
      setDomainAvailable(null)
    }
  }, [formData.customDomain])

  // Check eligibility based on student count
  useEffect(() => {
    const count = parseInt(formData.studentCount)
    if (formData.studentCount && !isNaN(count) && count > 0) {
      setEligible(count >= ELIGIBILITY_THRESHOLD)
    } else {
      setEligible(null)
    }
  }, [formData.studentCount])

  const checkDomain = async () => {
    setCheckingDomain(true)
    setDomainAvailable(null)

    try {
      const response = await fetch(`/api/domains/check?name=${formData.customDomain}`)
      const data = await response.json()

      if (response.ok) {
        setDomainAvailable(data.available)
      } else {
        setDomainAvailable(false)
      }
    } catch (err) {
      setDomainAvailable(false)
    } finally {
      setCheckingDomain(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-convert custom domain to lowercase
    if (name === 'customDomain') {
      setFormData((prev) => ({
        ...prev,
        customDomain: value.toLowerCase().replace(/[^a-z0-9-.]/g, ''),
      }))
    }
  }

  const validateStep1 = () => {
    if (!formData.institutionName || formData.institutionName.length < 3) {
      return 'Institution name must be at least 3 characters'
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address'
    }
    if (!formData.phone || formData.phone.length < 10) {
      return 'Please enter a valid phone number'
    }
    // Validate student count
    const studentCount = parseInt(formData.studentCount)
    if (!formData.studentCount || isNaN(studentCount) || studentCount < 10) {
      return 'Please enter a valid number of students (minimum 10)'
    }
    return null
  }

  const validateStep2 = () => {
    if (!formData.customDomain || formData.customDomain.length < 3) {
      return 'Please enter a valid domain name'
    }
    // Validate domain format
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/
    if (!domainRegex.test(formData.customDomain)) {
      return 'Please enter a valid domain name (e.g., yourschool.com)'
    }
    return null
  }

  const validateStep3 = () => {
    if (!formData.adminName || formData.adminName.length < 2) {
      return 'Admin name must be at least 2 characters'
    }
    if (!formData.adminPassword || formData.adminPassword.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  }

  const handleNext = () => {
    let error = null

    if (step === 1) {
      error = validateStep1()
    } else if (step === 2) {
      error = validateStep2()
    }

    if (error) {
      setError(error)
      return
    }

    setError('')
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const error = validateStep3()
    if (error) {
      setError(error)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/tenants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionName: formData.institutionName,
          email: formData.email,
          phone: formData.phone,
          customDomain: formData.customDomain,
          adminName: formData.adminName,
          adminPassword: formData.adminPassword,
          studentCount: parseInt(formData.studentCount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to success page or login
      router.push(
        `/auth/login?registered=true&email=${encodeURIComponent(formData.email)}`
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-orange-600">INR99</span>
              <span className="text-3xl font-bold text-gray-900">.Academy</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Institution
          </h1>
          <p className="text-gray-600">
            Get started with your own branded learning platform
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600">
              {step === 1 && 'Institution Details'}
              {step === 2 && 'Custom Domain'}
              {step === 3 && 'Admin Account'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Step 1: Institution Details */}
          {step === 1 && (
            <div className="p-8 space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Institution Details
                </h3>
                <p className="text-gray-600">
                  Tell us about your institution
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Delhi Public School"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type *
                </label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="school">School</option>
                  <option value="college">College/University</option>
                  <option value="coaching">Coaching Institute</option>
                  <option value="corporate">Corporate Training</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Students *
                </label>
                <input
                  type="number"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  min="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter total number of students"
                />
                {formData.studentCount && (
                  <div className="mt-2">
                    {eligible === true ? (
                      <div className="flex items-center text-green-700 bg-green-50 w-full p-3 rounded-lg">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">
                          Congratulations! Your institution qualifies for free white-label access
                        </span>
                      </div>
                    ) : eligible === false ? (
                      <div className="flex items-center text-amber-700 bg-amber-50 w-full p-3 rounded-lg">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium">
                          Institutions with 1000+ students qualify for free white-label access
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@institution.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          )}

          {/* Step 2: Custom Domain */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Set Up Your Custom Domain
                </h3>
                <p className="text-gray-600">
                  Your institution will have its own branded domain
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain *
                  </label>
                  <input
                    type="text"
                    name="customDomain"
                    value={formData.customDomain}
                    onChange={handleChange}
                    maxLength={253}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourschool.com"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your domain name (e.g., schoolname.com). You will need to configure DNS settings after registration.
                  </p>

                  {/* Domain Status */}
                  {formData.customDomain.length >= 3 && (
                    <div className="mt-3 flex items-center">
                      {checkingDomain ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-blue-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="text-gray-600">Checking availability...</span>
                        </>
                      ) : domainAvailable === true ? (
                        <>
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-green-600">
                            {formData.customDomain} is available!
                          </span>
                        </>
                      ) : domainAvailable === false ? (
                        <>
                          <svg
                            className="h-5 w-5 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-red-600">
                            This domain is already registered
                          </span>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* DNS Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    DNS Configuration Required
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    After registration, you will need to add the following DNS record to your domain:
                  </p>
                  <div className="bg-white rounded p-3 font-mono text-sm">
                    <p><strong>Type:</strong> CNAME</p>
                    <p><strong>Name:</strong> @ (or leave blank)</p>
                    <p><strong>Value:</strong> cname.inr99.academy</p>
                    <p><strong>TTL:</strong> 3600 (1 hour)</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    Important Note
                  </h4>
                  <p className="text-sm text-amber-800">
                    Your custom domain will be activated after DNS verification, which may take up to 24-48 hours due to DNS propagation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="p-8 space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Create Admin Account
                </h3>
                <p className="text-gray-600">
                  Set up your administrator login credentials
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Registration Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Institution:</span> <span className="font-medium">{formData.institutionName}</span></p>
                  <p><span className="text-gray-600">Domain:</span> <span className="font-medium">{formData.customDomain}</span></p>
                  <p><span className="text-gray-600">Students:</span> <span className="font-medium">{formData.studentCount}</span></p>
                  <p><span className="text-gray-600">Plan:</span> <span className="font-medium text-green-600">{eligible ? 'Free White-Label' : 'Standard'}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
