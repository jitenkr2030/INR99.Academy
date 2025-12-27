"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLearningProgress } from '@/contexts/learning-progress-context'
import { 
  Clock, 
  BookOpen, 
  Play, 
  FileText, 
  Headphones, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  User,
  Target,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  price?: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  instructor: {
    id: string
    name: string
    bio?: string
    avatar?: string
    expertise?: string
  }
  learningPath?: {
    id: string
    title: string
    color: string
    icon?: string
  }
  lessons: Array<{
    id: string
    title: string
    duration: number
    order: number
    videoUrl?: string
    audioUrl?: string
    pdfUrl?: string
  }>
  assessments: Array<{
    id: string
    title: string
    type: string
    lessonId?: string
  }>
  totalLessons: number
  totalAssessments: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { getCourseProgress, markLessonComplete } = useLearningProgress()
  
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      const data = await response.json()

      if (data.success) {
        setCourse(data.course)
      } else {
        router.push('/courses')
      }
    } catch (error) {
      console.error('Fetch course error:', error)
      router.push('/courses')
    } finally {
      setLoading(false)
    }
  }

  // Check enrollment status
  useEffect(() => {
    if (courseId && session?.user) {
      checkEnrollment()
    }
  }, [courseId, session])

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      const data = await response.json()

      if (data.success) {
        const enrolled = data.enrollments.find((e: any) => e.course.id === courseId)
        setIsEnrolled(!!enrolled)
      }
    } catch (error) {
      console.error('Check enrollment error:', error)
    }
  }

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    setEnrollmentLoading(true)
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          paymentMethod: 'CREDIT_CARD',
          paymentAmount: course?.price || 0
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsEnrolled(true)
        setShowEnrollmentModal(false)
      } else {
        alert(data.error || 'Failed to enroll')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Failed to enroll. Please try again.')
    } finally {
      setEnrollmentLoading(false)
    }
  }

  // Sync with progress context when course loads
  useEffect(() => {
    if (course && session?.user) {
      const progress = getCourseProgress(course.id)
      if (progress) {
        // In a real app, you'd track which specific lessons are completed
        // For now, we'll estimate based on progress percentage
        const completedCount = Math.floor((progress.progress / 100) * course.totalLessons)
        const completed = new Set<string>()
        for (let i = 0; i < completedCount && i < course.lessons.length; i++) {
          completed.add(course.lessons[i].id)
        }
        setCompletedLessons(completed)
      }
    }
  }, [course, session, getCourseProgress])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const markLessonCompleteHandler = async (lessonId: string) => {
    if (!session?.user || !course) return
    
    const newCompleted = new Set(completedLessons)
    newCompleted.add(lessonId)
    setCompletedLessons(newCompleted)
    
    await markLessonComplete(course.id, lessonId)
  }

  const handleStartLearning = () => {
    if (course && course.lessons && course.lessons.length > 0) {
      // Navigate to the first lesson
      router.push(`/lessons/${course.lessons[0].id}`)
    } else {
      console.error('No lessons available for this course')
      alert('No lessons available for this course yet. Please check back later.')
    }
  }

  const handleContinueLearning = () => {
    if (course && course.lessons && course.lessons.length > 0) {
      // Find the first incomplete lesson
      const nextLessonIndex = course.lessons.findIndex(lesson => !completedLessons.has(lesson.id))
      const lessonIndex = nextLessonIndex !== -1 ? nextLessonIndex : 0
      router.push(`/lessons/${course.lessons[lessonIndex].id}`)
    } else {
      console.error('No lessons available for this course')
      alert('No lessons available for this course yet. Please check back later.')
    }
  }

  const getProgressPercentage = () => {
    if (!course || course.totalLessons === 0) return completedLessons.size > 0 ? 100 : 0
    return (completedLessons.size / course.totalLessons) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Thumbnail */}
            <div className="lg:w-1/3">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                    <BookOpen className="h-16 w-16 text-orange-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3 space-y-4">
              <div className="flex items-center gap-2">
                {course.learningPath && (
                  <Badge className={`${course.learningPath.color} text-white`}>
                    {course.learningPath.title}
                  </Badge>
                )}
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600">
                {course.description}
              </p>

              {/* Instructor Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                  <AvatarFallback>
                    {course.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{course.totalAssessments} assessments</span>
                </div>
              </div>

              {/* Progress - Only show if logged in */}
              {session?.user && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedLessons.size} of {course.totalLessons} completed
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isEnrolled ? (
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={completedLessons.size > 0 ? handleContinueLearning : handleStartLearning}
                    disabled={!course.lessons || course.lessons.length === 0}
                  >
                    {completedLessons.size > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                ) : course && course.price === 0 ? (
                  <Button 
                    size="lg" 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleEnroll}
                    disabled={enrollmentLoading}
                  >
                    {enrollmentLoading ? 'Enrolling...' : 'Enroll for Free'}
                  </Button>
                ) : course && course.price ? (
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowEnrollmentModal(true)}
                  >
                    Enroll Now - ${course.price}
                  </Button>
                ) : null}
                <Button size="lg" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">What you'll learn</h3>
                      <p className="text-gray-600">
                        This comprehensive course covers essential topics with practical examples and hands-on exercises. 
                        You'll gain real-world skills that you can immediately apply in your professional life.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Course Structure</h3>
                      <p className="text-gray-600">
                        The course is structured into {course.totalLessons} bite-sized lessons, each designed to be 
                        completed in 5-12 minutes. This micro-learning approach ensures you can learn at your own pace, 
                        anytime and anywhere.
                      </p>
                    </div>
                    {course.instructor.bio && (
                      <div>
                        <h3 className="font-semibold mb-2">About the Instructor</h3>
                        <p className="text-gray-600">{course.instructor.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lessons" className="mt-6">
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                              completedLessons.has(lesson.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              {completedLessons.has(lesson.id) ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(lesson.duration)}
                                </span>
                                <div className="flex items-center gap-2">
                                  {lesson.videoUrl && <Play className="h-3 w-3" />}
                                  {lesson.audioUrl && <Headphones className="h-3 w-3" />}
                                  {lesson.pdfUrl && <FileText className="h-3 w-3" />}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {completedLessons.has(lesson.id) ? (
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/lessons/${lesson.id}`)}
                              >
                                Review
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600"
                                onClick={() => router.push(`/lessons/${lesson.id}`)}
                              >
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assessments" className="mt-6">
                <div className="space-y-4">
                  {course.assessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                            <Badge variant="secondary" className="mt-1">
                              {assessment.type}
                            </Badge>
                          </div>
                          <Button size="sm" onClick={() => router.push(`/assessments/${assessment.id}`)}>
                            Start Assessment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      completedLessons.has(lesson.id)
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => router.push(`/lessons/${lesson.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          completedLessons.has(lesson.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {completedLessons.has(lesson.id) ? '✓' : index + 1}
                        </div>
                        <span className="text-sm font-medium truncate">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Instructor
                </Button>
              </CardContent>
            </Card>

            {/* Login Prompt for Progress Tracking */}
            {!session?.user && (
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Track Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">
                    Sign in to save your progress, earn certificates, and track your learning journey!
                  </p>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => router.push('/auth/login')}
                  >
                    Sign In to Track Progress
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && course && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Enroll in {course.title}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Course Price</span>
                <span className="text-xl font-bold">${course.price}</span>
              </div>
              <div className="text-sm text-gray-500">
                This is a demo enrollment. In a real application, you would be redirected to a payment processor like Stripe.
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEnrollmentModal(false)}
                disabled={enrollmentLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handleEnroll}
                disabled={enrollmentLoading}
              >
                {enrollmentLoading ? 'Processing...' : 'Confirm Payment'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
