"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface LearningPath {
  id: string
  title: string
  description: string
  icon?: string
  color: string
  courseCount: number
  previewCourses: Array<{
    id: string
    title: string
    difficulty: string
    duration: number
    thumbnail?: string
  }>
}

interface LearningPathCardProps {
  path: LearningPath
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${path.color} flex items-center justify-center`}>
              {path.icon ? (
                <span className="text-xl">{path.icon}</span>
              ) : (
                <BookOpen className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">
                {path.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {path.description}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${path.color} text-white`}>
            {path.courseCount} courses
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preview Courses */}
        {path.previewCourses.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Featured Courses:</h4>
            <div className="space-y-2">
              {path.previewCourses.slice(0, 2).map((course) => (
                <div key={course.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="truncate">{course.title}</span>
                </div>
              ))}
              {path.courseCount > 2 && (
                <div className="text-xs text-gray-500 ml-4">
                  +{path.courseCount - 2} more courses
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Link href={`/learning-paths/${path.id}`}>
          <Button className="w-full group-hover:bg-orange-500 transition-colors">
            Explore Path
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

interface LearningPathGridProps {
  paths: LearningPath[]
  loading?: boolean
}

export function LearningPathGrid({ paths, loading = false }: LearningPathGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning paths found</h3>
        <p className="text-gray-600">Check back later for new learning paths.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {paths.map((path) => (
        <LearningPathCard key={path.id} path={path} />
      ))}
    </div>
  )
}