"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'

interface Course {
  id: string
  title: string
  description: string
  isActive: boolean
  _count: {
    lessons: number
    progress: number
  }
  createdAt: string
}

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration: number
  order: number
  isActive: boolean
  _count?: {
    progress: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface LearningPath {
  id: string
  title: string
  description: string
  color: string
}

export default function InstructorCourses() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLessonsModal, setShowLessonsModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [lessonSubmitting, setLessonSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [lessonMessage, setLessonMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    categoryId: '',
    subCategoryId: '',
    learningPathId: ''
  })

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    audioUrl: '',
    pdfUrl: '',
    duration: 10,
    order: 0
  })

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    fetchCourses()
    fetchCategories()
    fetchLearningPaths()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/instructor/courses')
      const data = await res.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchLearningPaths = async () => {
    try {
      const res = await fetch('/api/learning-paths')
      const data = await res.json()
      if (data.success && Array.isArray(data.learningPaths)) {
        setLearningPaths(data.learningPaths)
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error)
    }
  }

  const fetchLessons = async (courseId: string) => {
    setLessonsLoading(true)
    try {
      const res = await fetch(`/api/instructor/lessons?courseId=${courseId}`)
      const data = await res.json()
      if (data.success) {
        setLessons(data.lessons)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLessonsLoading(false)
    }
  }

  const openLessonsModal = async (course: Course) => {
    setSelectedCourse(course)
    setShowLessonsModal(true)
    setLessonMessage(null)
    setEditingLesson(null)
    setLessonForm({
      title: '',
      content: '',
      videoUrl: '',
      audioUrl: '',
      pdfUrl: '',
      duration: 10,
      order: 0
    })
    await fetchLessons(course.id)
  }

  const userName = session?.user?.name || 'Instructor'
  const userEmail = session?.user?.email || ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLessonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLessonForm(prev => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'order' ? parseInt(value) || 0 : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Course created successfully!' })
        setFormData({
          title: '',
          description: '',
          difficulty: 'BEGINNER',
          categoryId: '',
          subCategoryId: '',
          learningPathId: ''
        })
        fetchCourses()
        setTimeout(() => {
          setShowCreateModal(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create course' })
      }
    } catch (error) {
      console.error('Create course error:', error)
      setMessage({ type: 'error', text: 'Failed to create course' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    setLessonSubmitting(true)
    setLessonMessage(null)

    try {
      const res = await fetch('/api/instructor/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonForm,
          courseId: selectedCourse.id
        })
      })

      const data = await res.json()

      if (data.success) {
        setLessonMessage({ type: 'success', text: 'Lesson created successfully!' })
        setLessonForm({
          title: '',
          content: '',
          videoUrl: '',
          audioUrl: '',
          pdfUrl: '',
          duration: 10,
          order: 0
        })
        fetchLessons(selectedCourse.id)
        fetchCourses()
      } else {
        setLessonMessage({ type: 'error', text: data.error || 'Failed to create lesson' })
      }
    } catch (error) {
      console.error('Create lesson error:', error)
      setLessonMessage({ type: 'error', text: 'Failed to create lesson' })
    } finally {
      setLessonSubmitting(false)
    }
  }

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLesson || !selectedCourse) return

    setLessonSubmitting(true)
    setLessonMessage(null)

    try {
      const res = await fetch(`/api/instructor/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm)
      })

      const data = await res.json()

      if (data.success) {
        setLessonMessage({ type: 'success', text: 'Lesson updated successfully!' })
        setEditingLesson(null)
        setLessonForm({
          title: '',
          content: '',
          videoUrl: '',
          audioUrl: '',
          pdfUrl: '',
          duration: 10,
          order: 0
        })
        fetchLessons(selectedCourse.id)
        fetchCourses()
      } else {
        setLessonMessage({ type: 'error', text: data.error || 'Failed to update lesson' })
      }
    } catch (error) {
      console.error('Update lesson error:', error)
      setLessonMessage({ type: 'error', text: 'Failed to update lesson' })
    } finally {
      setLessonSubmitting(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return
    }

    setLessonSubmitting(true)
    setLessonMessage(null)

    try {
      const res = await fetch(`/api/instructor/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        setLessonMessage({ type: 'success', text: 'Lesson deleted successfully!' })
        fetchLessons(selectedCourse!.id)
        fetchCourses()
      } else {
        setLessonMessage({ type: 'error', text: data.error || 'Failed to delete lesson' })
      }
    } catch (error) {
      console.error('Delete lesson error:', error)
      setLessonMessage({ type: 'error', text: 'Failed to delete lesson' })
    } finally {
      setLessonSubmitting(false)
    }
  }

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      audioUrl: lesson.audioUrl || '',
      pdfUrl: lesson.pdfUrl || '',
      duration: lesson.duration,
      order: lesson.order
    })
  }

  const cancelEditLesson = () => {
    setEditingLesson(null)
    setLessonForm({
      title: '',
      content: '',
      videoUrl: '',
      audioUrl: '',
      pdfUrl: '',
      duration: 10,
      order: 0
    })
  }

  const selectedCategory = categories.find(c => c.id === formData.categoryId)

  if (loading) {
    return (
      <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading courses...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="instructor" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              My Courses 👨‍🏫
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage and track your course progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#9333ea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>+</span> Create New Course
          </button>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '3rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No courses yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Create your first course to start teaching!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Create Course
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {courses.map(course => (
              <div 
                key={course.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {course.description}
                    </p>
                  </div>
                  <span style={{
                    background: course.isActive ? '#16a34a' : '#eab308',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {course.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <span>📚 {course._count.lessons} Lessons</span>
                  <span>👥 {course._count.progress} Students</span>
                  <span>📅 {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => openLessonsModal(course)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>📖</span> Manage Lessons
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Edit Course
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    View Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                Create New Course
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setMessage(null)
                  setFormData({
                    title: '',
                    description: '',
                    difficulty: 'BEGINNER',
                    categoryId: '',
                    subCategoryId: '',
                    learningPathId: ''
                  })
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {message && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: message.type === 'success' ? '#16a34a' : '#dc2626'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Complete Python Programming"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe what students will learn..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Subcategory
                  </label>
                  <select
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleInputChange}
                    disabled={!formData.categoryId}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box',
                      opacity: formData.categoryId ? 1 : 0.5
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories?.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Learning Path
                  </label>
                  <select
                    name="learningPathId"
                    value={formData.learningPathId}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Learning Path (Optional)</option>
                    {learningPaths.map(path => (
                      <option key={path.id} value={path.id}>{path.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setMessage(null)
                    setFormData({
                      title: '',
                      description: '',
                      difficulty: 'BEGINNER',
                      categoryId: '',
                      subCategoryId: '',
                      learningPathId: ''
                    })
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Lessons Modal */}
      {showLessonsModal && selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  Manage Lessons
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Course: {selectedCourse.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLessonsModal(false)
                  setSelectedCourse(null)
                  setLessons([])
                  setEditingLesson(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {lessonMessage && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                background: lessonMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: lessonMessage.type === 'success' ? '#16a34a' : '#dc2626'
              }}>
                {lessonMessage.text}
              </div>
            )}

            {/* Lesson Form */}
            <div style={{
              background: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={lessonForm.title}
                    onChange={handleLessonInputChange}
                    required
                    placeholder="e.g., Introduction to Variables"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Lesson Content *
                  </label>
                  <textarea
                    name="content"
                    value={lessonForm.content}
                    onChange={handleLessonInputChange}
                    required
                    placeholder="Write your lesson content here..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                      Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={lessonForm.videoUrl}
                      onChange={handleLessonInputChange}
                      placeholder="https://example.com/video.mp4"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                      Audio URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="audioUrl"
                      value={lessonForm.audioUrl}
                      onChange={handleLessonInputChange}
                      placeholder="https://example.com/audio.mp3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                      PDF URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="pdfUrl"
                      value={lessonForm.pdfUrl}
                      onChange={handleLessonInputChange}
                      placeholder="https://example.com/document.pdf"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={lessonForm.duration}
                      onChange={handleLessonInputChange}
                      min="1"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Order (Lesson Number)
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={lessonForm.order}
                    onChange={handleLessonInputChange}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={lessonSubmitting}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: lessonSubmitting ? 'not-allowed' : 'pointer',
                      opacity: lessonSubmitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {lessonSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      editingLesson ? 'Update Lesson' : 'Add Lesson'
                    )}
                  </button>
                  {editingLesson && (
                    <button
                      type="button"
                      onClick={cancelEditLesson}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lessons List */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Existing Lessons ({lessons.length})
              </h3>
              {lessonsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading lessons...</p>
                </div>
              ) : lessons.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  background: '#f9fafb', 
                  borderRadius: '0.5rem',
                  color: '#6b7280'
                }}>
                  <p>No lessons added yet. Add your first lesson above!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      style={{
                        background: '#f9fafb',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          background: '#7c3aed',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          {lesson.order || index + 1}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                            {lesson.title}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {lesson.duration} min
                            {lesson.videoUrl && ' • Video'}
                            {lesson.pdfUrl && ' • PDF'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditLesson(lesson)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
