"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LowBandwidthMediaPlayer } from "@/components/low-bandwidth-media-player"
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle
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
  const lessonId = params.id as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      const data = await response.json()

      if (data.success) {
        setLesson(data.lesson)
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

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`)
  }

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress)
  }

  const handleComplete = () => {
    // In a real app, this would update the user's progress
    console.log('Lesson completed')
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
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>Lesson {lesson.navigation.currentIndex} of {lesson.navigation.totalLessons}</span>
          </div>
          <Progress 
            value={(lesson.navigation.currentIndex / lesson.navigation.totalLessons) * 100} 
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
              onProgress={handleProgress}
              onComplete={handleComplete}
            />

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
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleComplete}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
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
                    {lesson.videoUrl && <Badge variant="outline" className="text-xs">Video</Badge>}
                    {lesson.audioUrl && <Badge variant="outline" className="text-xs">Audio</Badge>}
                    {lesson.pdfUrl && <Badge variant="outline" className="text-xs">PDF</Badge>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assessments</span>
                  <span className="text-sm font-medium">{lesson.assessments.length}</span>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}