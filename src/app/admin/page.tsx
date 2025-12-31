"use client"

import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalDiscussions: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalCertificates: number
  totalPayments: number
  totalRevenue: number
  monthlyRevenue: number
}

interface DashboardData {
  stats: AdminStats
  userGrowth: any[]
  courseStats: any[]
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  subscriptions: any[]
  _count: {
    progress: number
    certificates: number
    discussions: number
  }
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Course {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  isActive: boolean
  thumbnail: string | null
  createdAt: Date
  instructor: {
    id: string
    name: string
  }
  learningPath: {
    id: string
    title: string
  } | null
  _count: {
    lessons: number
    progress: number
    assessments: number
    discussions: number
  }
}

interface CoursesResponse {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Instructor {
  id: string
  name: string
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('admin')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  
  // Users management state
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Courses management state
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [coursesPagination, setCoursesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    duration: 60,
    instructorId: '',
    thumbnail: ''
  })

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const statsResponse = await fetch('/api/admin/stats')
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data: DashboardData = await statsResponse.json()
      setStats(data.stats)

      const userResponse = await fetch('/api/auth/session')
      if (userResponse.ok) {
        const session = await userResponse.json()
        if (session?.user) {
          setUser({
            name: session.user.name || 'Admin',
            email: session.user.email || 'admin@inr99.com',
            role: session.user.role || 'ADMIN'
          })
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setUsersLoading(true)
      const response = await fetch(`/api/admin/users?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setUsersPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchCourses = async (page = 1, search = '') => {
    try {
      setCoursesLoading(true)
      const response = await fetch(`/api/admin/courses?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data: CoursesResponse = await response.json()
      setCourses(data.courses)
      setCoursesPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
    } finally {
      setCoursesLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.instructors || [])
      }
    } catch (err) {
      console.error('Error fetching instructors:', err)
    }
  }

  useEffect(() => {
    if (tab === 'users') {
      fetchUsers(usersPagination.page, searchTerm)
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'courses') {
      fetchCourses(coursesPagination.page, courseSearchTerm)
      fetchInstructors()
    }
  }, [tab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchTerm)
  }

  const handleCourseSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCourses(1, courseSearchTerm)
  }

  const handlePageChange = (newPage: number, type: 'users' | 'courses') => {
    if (type === 'users') {
      fetchUsers(newPage, searchTerm)
    } else {
      fetchCourses(newPage, courseSearchTerm)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setShowEditModal(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editingUser.name,
          isActive: editingUser.isActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      fetchUsers(usersPagination.page, searchTerm)
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      fetchUsers(usersPagination.page, searchTerm)
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course })
    setShowCourseModal(true)
  }

  const handleSaveCourse = async () => {
    if (!editingCourse) return
    
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: editingCourse.id,
          title: editingCourse.title,
          description: editingCourse.description,
          difficulty: editingCourse.difficulty,
          duration: editingCourse.duration,
          isActive: editingCourse.isActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update course')
      }

      fetchCourses(coursesPagination.page, courseSearchTerm)
      setShowCourseModal(false)
      setEditingCourse(null)
    } catch (err) {
      console.error('Error updating course:', err)
      alert('Failed to update course')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      fetchCourses(coursesPagination.page, courseSearchTerm)
    } catch (err) {
      console.error('Error deleting course:', err)
      alert('Failed to delete course')
    }
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructorId) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      })

      if (!response.ok) {
        throw new Error('Failed to create course')
      }

      fetchCourses(1, courseSearchTerm)
      setShowCreateModal(false)
      setNewCourse({
        title: '',
        description: '',
        difficulty: 'BEGINNER',
        duration: 60,
        instructorId: '',
        thumbnail: ''
      })
    } catch (err) {
      console.error('Error creating course:', err)
      alert('Failed to create course')
    }
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #dc2626', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'users', label: '👥 Users' },
    { id: 'admin', label: '⚙️ Admin' }
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTab(tabId)
  }

  // Loading state
  if (loading && (tab === 'dashboard' || tab === 'admin')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Loading...</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fetching data</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '20px', background: '#e5e7eb', borderRadius: '4px', width: '60%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '32px', background: '#e5e7eb', borderRadius: '4px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && (tab === 'dashboard' || tab === 'admin')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Demo Admin</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin1@inr99.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>Error Loading Data</h2>
            <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={fetchDashboardData}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#dc2626',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{user?.name || 'Demo Admin 1'}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user?.email || 'admin1@inr99.com'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => handleTabClick(t.id, e)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    background: tab === t.id ? '#dc2626' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {tab === 'dashboard' && stats && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, Admin!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Monitor your platform performance and manage users</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>A</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{user?.name || 'Demo Admin 1'}</h3>
                <p style={{ color: '#6b7280' }}>{user?.email || 'admin1@inr99.com'}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Administrator</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: user?.name || 'Demo Admin 1', icon: '👤' },
                  { label: 'Email', value: user?.email || 'admin1@inr99.com', icon: '📧' },
                  { label: 'Role', value: user?.role || 'Administrator', icon: '🛡️' },
                  { label: 'Member Since', value: 'January 2024', icon: '📅' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</p>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'courses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>📚 All Courses</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Add New Course
              </button>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleCourseSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {/* Courses Table */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                <div>Course</div>
                <div>Instructor</div>
                <div>Difficulty</div>
                <div>Duration</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Loading State */}
              {coursesLoading && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading courses...
                </div>
              )}

              {/* Courses List */}
              {!coursesLoading && courses.map((course) => (
                <div key={course.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{course._count.lessons} lessons • {course._count.progress} students</p>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{course.instructor?.name || 'N/A'}</div>
                  <div>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      background: course.difficulty === 'BEGINNER' ? '#dcfce7' : course.difficulty === 'INTERMEDIATE' ? '#fef3c7' : '#fee2e2',
                      color: course.difficulty === 'BEGINNER' ? '#166534' : course.difficulty === 'INTERMEDIATE' ? '#854d0e' : '#991b1b'
                    }}>
                      {course.difficulty}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{formatDuration(course.duration)}</div>
                  <div>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      background: course.isActive ? '#dcfce7' : '#fef3c7',
                      color: course.isActive ? '#166534' : '#854d0e'
                    }}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditCourse(course)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: 'white'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: '#fef2f2',
                        color: '#991b1b'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!coursesLoading && courses.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No courses found
                </div>
              )}

              {/* Pagination */}
              {!coursesLoading && coursesPagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Showing {((coursesPagination.page - 1) * coursesPagination.limit) + 1} to {Math.min(coursesPagination.page * coursesPagination.limit, coursesPagination.total)} of {coursesPagination.total} courses
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handlePageChange(coursesPagination.page - 1, 'courses')}
                      disabled={coursesPagination.page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: coursesPagination.page === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        background: coursesPagination.page === 1 ? '#f3f4f6' : 'white',
                        color: coursesPagination.page === 1 ? '#9ca3af' : '#374151'
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(coursesPagination.page + 1, 'courses')}
                      disabled={coursesPagination.page === coursesPagination.totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: coursesPagination.page === coursesPagination.totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        background: coursesPagination.page === coursesPagination.totalPages ? '#f3f4f6' : 'white',
                        color: coursesPagination.page === coursesPagination.totalPages ? '#9ca3af' : '#374151'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>👥 All Users</h2>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search users by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {/* Users Table */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1.5fr', gap: '1rem', padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div>Joined</div>
                <div>Actions</div>
              </div>

              {/* Loading State */}
              {usersLoading && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading users...
                </div>
              )}

              {/* Users List */}
              {!usersLoading && users.map((userItem) => (
                <div key={userItem.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1.5fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>
                      {(userItem.name || userItem.email).charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{userItem.name || 'N/A'}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userItem.email}</div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: userItem.role === 'ADMIN' || userItem.role === 'SUPER_ADMIN' ? '#fee2e2' : '#dcfce7', color: userItem.role === 'ADMIN' || userItem.role === 'SUPER_ADMIN' ? '#991b1b' : '#166534' }}>
                      {userItem.role}
                    </span>
                  </div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: userItem.isActive ? '#dcfce7' : '#fef3c7', color: userItem.isActive ? '#166534' : '#854d0e' }}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{formatDate(userItem.createdAt)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditUser(userItem)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: 'white'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userItem.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: '#fef2f2',
                        color: '#991b1b'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!usersLoading && users.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No users found
                </div>
              )}

              {/* Pagination */}
              {!usersLoading && usersPagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Showing {((usersPagination.page - 1) * usersPagination.limit) + 1} to {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} of {usersPagination.total} users
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handlePageChange(usersPagination.page - 1, 'users')}
                      disabled={usersPagination.page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: usersPagination.page === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        background: usersPagination.page === 1 ? '#f3f4f6' : 'white',
                        color: usersPagination.page === 1 ? '#9ca3af' : '#374151'
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(usersPagination.page + 1, 'users')}
                      disabled={usersPagination.page === usersPagination.totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db',
                        cursor: usersPagination.page === usersPagination.totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        background: usersPagination.page === usersPagination.totalPages ? '#f3f4f6' : 'white',
                        color: usersPagination.page === usersPagination.totalPages ? '#9ca3af' : '#374151'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'admin' && stats && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>⚙️ Admin Dashboard</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Complete platform overview and management</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' },
                { label: 'Active Students', value: stats.activeSubscriptions.toLocaleString(), icon: '🎓' },
                { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), icon: '📈' },
                { label: 'Certificates', value: stats.totalCertificates.toLocaleString(), icon: '🏆' },
                { label: 'Discussions', value: stats.totalDiscussions.toLocaleString(), icon: '💬' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>👥 Manage Users</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📚 Course Management</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📊 Analytics & Reports</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>⚙️ System Settings</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>💰 Financial Reports</button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>System Health</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Database', value: 'Healthy', status: 'green' },
                  { label: 'API Status', value: 'Operational', status: 'green' },
                  { label: 'Storage', value: '45% Used', status: 'yellow' },
                  { label: 'Last Backup', value: '2 hours ago', status: 'green' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>{item.label}</span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      background: item.status === 'green' ? '#dcfce7' : item.status === 'yellow' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'green' ? '#166534' : item.status === 'yellow' ? '#854d0e' : '#991b1b'
                    }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit User</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name</label>
                <input
                  type="text"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    background: '#f3f4f6',
                    color: '#6b7280'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Status</label>
                <select
                  value={editingUser.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'white',
                  color: '#374151'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: '#dc2626',
                  color: 'white'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showCourseModal && editingCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '600px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit Course</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Difficulty</label>
                  <select
                    value={editingCourse.difficulty}
                    onChange={(e) => setEditingCourse({ ...editingCourse, difficulty: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Duration (minutes)</label>
                  <input
                    type="number"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Status</label>
                <select
                  value={editingCourse.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, isActive: e.target.value === 'active' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCourseModal(false)
                  setEditingCourse(null)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'white',
                  color: '#374151'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: '#dc2626',
                  color: 'white'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '600px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Create New Course</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Title *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Enter course title"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description *</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Difficulty</label>
                  <select
                    value={newCourse.difficulty}
                    onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Duration (min) *</label>
                  <input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Instructor *</label>
                  <select
                    value={newCourse.instructorId}
                    onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Select instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Thumbnail URL</label>
                <input
                  type="text"
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewCourse({
                    title: '',
                    description: '',
                    difficulty: 'BEGINNER',
                    duration: 60,
                    instructorId: '',
                    thumbnail: ''
                  })
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'white',
                  color: '#374151'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourse}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: '#dc2626',
                  color: 'white'
                }}
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
