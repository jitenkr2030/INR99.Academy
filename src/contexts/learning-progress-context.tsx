"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressData {
  id: string
  userId: string
  courseId: string
  lessonId?: string
  progress: number
  timeSpent: number
  completed: boolean
  lastAccess: string
}

interface LearningProgressContextType {
  progressData: ProgressData[]
  updateProgress: (data: {
    courseId: string
    lessonId?: string
    progress: number
    timeSpent?: number
    completed?: boolean
  }) => Promise<void>
  getCourseProgress: (courseId: string) => ProgressData | null
  isLoading: boolean
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined)

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchProgressData = async () => {
    try {
      const response = await fetch('/api/progress')
      const data = await response.json()
      
      if (data.success) {
        setProgressData(data.progress)
      }
    } catch (error) {
      console.error('Fetch progress error:', error)
    }
  }

  const updateProgress = async (data: {
    courseId: string
    lessonId?: string
    progress: number
    timeSpent?: number
    completed?: boolean
  }) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // In real app, get from auth context
          ...data
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setProgressData(prev => {
          const existingIndex = prev.findIndex(p => p.courseId === data.courseId)
          
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              progress: Math.max(updated[existingIndex].progress, data.progress),
              timeSpent: (updated[existingIndex].timeSpent || 0) + (data.timeSpent || 0),
              completed: data.completed || updated[existingIndex].completed,
              lessonId: data.lessonId || updated[existingIndex].lessonId,
              lastAccess: new Date().toISOString()
            }
            return updated
          } else {
            return [
              ...prev,
              {
                id: result.progress.id,
                userId: 'current-user-id',
                courseId: data.courseId,
                lessonId: data.lessonId,
                progress: data.progress,
                timeSpent: data.timeSpent || 0,
                completed: data.completed || false,
                lastAccess: new Date().toISOString()
              }
            ]
          }
        })
      }
    } catch (error) {
      console.error('Update progress error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCourseProgress = (courseId: string) => {
    return progressData.find(p => p.courseId === courseId) || null
  }

  useEffect(() => {
    fetchProgressData()
  }, [])

  const value: LearningProgressContextType = {
    progressData,
    updateProgress,
    getCourseProgress,
    isLoading
  }

  return (
    <LearningProgressContext.Provider value={value}>
      {children}
    </LearningProgressContext.Provider>
  )
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext)
  if (context === undefined) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider')
  }
  return context
}