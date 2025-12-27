"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LowBandwidthMediaPlayer } from "@/components/low-bandwidth-media-player"
import { useLearningProgress } from '@/contexts/learning-progress-context'
import { useSession } from 'next-auth/react'
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle,
  Play,
  Headphones,
  FileText
} from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  audioUrl?: string
  pdfUrl?: string
  duration: number
  order: number
  course: {
    id: string
    title: string
    instructor: {
      id: string
      name: string
      avatar?: string
    }
  }
  assessments: Array<{
    id: string
    title: string
    type: string
  }>
  navigation: {
    previous?: {
      id: string
      title: string
      order: number
    }
    next?: {
      id: string
      title: string
      order: number
    }
    currentIndex: number
    totalLessons: number
  }
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { markLessonComplete, getCourseProgress, updateProgress } = useLearningProgress()
  
  const lessonId = params.id as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mediaProgress, setMediaProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  
  const startTimeRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchLesson()
    
    // Start tracking time spent
    intervalRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 60000) // Track every minute
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [lessonId])

  const fetchLesson = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      const data = await response.json()

      if (data.success) {
        setLesson(data.lesson)
        
        // Check if this lesson was already completed
        const progress = getCourseProgress(data.lesson.course.id)
        if (progress?.completed) {
          setIsCompleted(true)
        }
      } else {
        router.push('/courses')
      }
    } catch (error) {
      console.error('Fetch lesson error:', error)
      router.push('/courses')
    } finally {
      setLoading(false)
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

  const navigateToLesson = (id: string) => {
    router.push(`/lessons/${id}`)
  }

  const handleMediaProgress = (progress: number) => {
    setMediaProgress(progress)
  }

  const handleComplete = async () => {
    if (!lesson || !session?.user) {
      // If not logged in, just show completion locally
      setIsCompleted(true)
      setShowCompletionToast(true)
      setTimeout(() => setShowCompletionToast(false), 3000)
      return
    }

    try {
      await markLessonComplete(lesson.course.id, lesson.id)
      setIsCompleted(true)
      setShowCompletionToast(true)
      setTimeout(() => setShowCompletionToast(false), 3000)
      
      // Update time spent when completing
      await updateProgress({
        courseId: lesson.course.id,
        lessonId: lesson.id,
        progress: 100, // Will be incremented by markLessonComplete
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 60000), // Convert to minutes
        completed: true
      })
    } catch (error) {
      console.error('Complete lesson error:', error)
    }
  }

  // Calculate overall course progress for the progress bar
  const getCourseProgressValue = () => {
    if (!lesson) return 0
    const progress = getCourseProgress(lesson.course.id)
    return progress?.progress || ((lesson.navigation.currentIndex / lesson.navigation.totalLessons) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Completion Toast */}
      {showCompletionToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5" />
          <span>Lesson completed! Great job! 🎉</span>
        </div>
      )}

      {/* Lesson Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/${lesson.course.id}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">
                  {lesson.course.title} • Lesson {lesson.navigation.currentIndex} of {lesson.navigation.totalLessons}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Course Progress</span>
            <span>{Math.round(getCourseProgressValue())}%</span>
          </div>
          <Progress 
            value={getCourseProgressValue()} 
            className="h-2"
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Low Bandwidth Media Player */}
            <LowBandwidthMediaPlayer
              title={lesson.title}
              videoUrl={lesson.videoUrl}
              audioUrl={lesson.audioUrl}
              textContent={lesson.content}
              pdfUrl={lesson.pdfUrl}
              duration={lesson.duration}
              onProgress={handleMediaProgress}
              onComplete={handleComplete}
            />

            {/* Lesson Content Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {lesson.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{paragraph.replace('### ', '')}</h3>
                    } else if (paragraph.startsWith('- ')) {
                      return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>
                    } else if (paragraph.trim() === '') {
                      return <br key={index} />
                    } else {
                      return <p key={index} className="text-gray-700 leading-relaxed my-2">{paragraph}</p>
                    }
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Assessments */}
            {lesson.assessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lesson.assessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {assessment.type}
                          </Badge>
                        </div>
                        <Button size="sm" onClick={() => router.push(`/assessments/${assessment.id}`)}>
                          Start Assessment
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.navigation.previous && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigateToLesson(lesson.navigation.previous.id)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous: {lesson.navigation.previous.title}
                  </Button>
                )}
                
                {lesson.navigation.next && (
                  <Button 
                    className="w-full justify-start bg-orange-500 hover:bg-orange-600"
                    onClick={() => navigateToLesson(lesson.navigation.next.id)}
                  >
                    Next: {lesson.navigation.next.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                
                {!isCompleted ? (
                  <Button 
                    variant="default"
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsCompleted(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed (Click to undo)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{formatDuration(lesson.duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Format</span>
                  <div className="flex gap-1">
                    {lesson.videoUrl && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Play className="h-3 w-3" /> Video
                      </Badge>
                    )}
                    {lesson.audioUrl && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Headphones className="h-3 w-3" /> Audio
                      </Badge>
                    )}
                    {lesson.pdfUrl && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <FileText className="h-3 w-3" /> PDF
                      </Badge>
                    )}
                    {!lesson.videoUrl && !lesson.audioUrl && !lesson.pdfUrl && (
                      <Badge variant="outline" className="text-xs">Text Only</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assessments</span>
                  <span className="text-sm font-medium">{lesson.assessments.length}</span>
                </div>
                {session?.user && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Spent</span>
                    <span className="text-sm font-medium">{Math.floor(timeSpent)} min</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lesson.course.instructor.avatar} alt={lesson.course.instructor.name} />
                    <AvatarFallback>
                      {lesson.course.instructor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{lesson.course.instructor.name}</p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Prompt for Progress Tracking */}
            {!session?.user && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-3">
                      Sign in to save your progress and track your learning journey!
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => router.push('/auth/login')}
                    >
                      Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
