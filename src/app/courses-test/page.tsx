"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  difficulty: string
  duration: number
  instructor: {
    id: string
    name: string
    title: string | null
    avatar: string | null
  }
  learningPath: {
    id: string
    title: string
    color: string
    icon: string
  } | null
  lessonCount: number
  pricing: {
    type: string
    price: number
    currency: string
    period: string
  }
}

export default function CoursesTestPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setDebugInfo('Fetching courses from API...')
        const response = await fetch('/api/courses?limit=100')

        setDebugInfo(`API Response Status: ${response.status}`)

        if (!response.ok) {
          setError(`API Error: ${response.status} ${response.statusText}`)
          setLoading(false)
          return
        }

        const data = await response.json()
        setDebugInfo(`API Success: ${data.success}, Total Courses: ${data.courses?.length || 0}`)

        if (data.success && data.courses) {
          setCourses(data.courses)
        } else {
          setError('API returned success: false or no courses')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Fetch Error: ${errorMessage}`)
        setDebugInfo(`Full Error: ${JSON.stringify(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold">
                INR99
              </div>
              <span className="font-bold text-xl text-gray-900">Academy</span>
            </Link>
            <Link
              href="/courses"
              className="text-orange-600 font-medium hover:text-orange-700"
            >
              Go to Original Courses Page
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Debug Info Banner */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm font-mono">{debugInfo}</p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-bold mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Courses (Test Page)
          </h1>
          <p className="text-gray-600">
            Simplified version to test if courses display correctly
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">Loading courses...</div>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-gray-600">
              Showing {courses.length} courses
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No courses found</p>
                <p className="text-gray-500 text-sm mt-2">Check the debug info above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-blue-100 flex items-center justify-center text-4xl">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>📚</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Badges */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {course.learningPath && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {course.learningPath.icon} {course.learningPath.title}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Instructor & Duration */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <span>By {course.instructor.name}</span>
                        <span>{formatDuration(course.duration)}</span>
                      </div>

                      {/* View Button */}
                      <Link
                        href={`/courses/${course.id}`}
                        className="mt-3 block w-full text-center bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
