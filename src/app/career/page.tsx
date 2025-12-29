'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight,
  Briefcase,
  Target,
  Award,
  TrendingUp,
  Building,
  Globe,
  Rocket,
  Lightbulb,
  Palette,
  Megaphone,
  Beaker,
  Heart,
  MessageCircle,
  Shield,
  Wrench,
  Brain,
  Scale,
  Users2,
  ShoppingCart,
  Gamepad2,
  Home,
  Zap,
  Compass
} from 'lucide-react'
import Link from 'next/link'
import { courses, type Course } from '@/lib/course-data'

// Get career-related courses from static data
const getCareerCourses = (): Course[] => {
  return courses.filter(course => 
    course.isActive && (
      course.category === 'career' || 
      course.category === 'technology' ||
      course.category === 'marketing' ||
      course.category === 'design'
    )
  )
}

export default function CareerSkillsPage() {
  const [loading] = useState(false)
  
  const careerCourses = useMemo(() => getCareerCourses(), [])

  // Calculate stats from courses
  const totalStudents = useMemo(() => 
    careerCourses.reduce((sum, c) => sum + c.enrollmentCount, 0),
    [careerCourses]
  )
  
  const totalLessons = useMemo(() =>
    careerCourses.reduce((sum, c) => sum + c.lessonCount, 0),
    [careerCourses]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              🧑‍💼 Career & Skills Development
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Build Skills for Your Future
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Professional development, career planning, and skill building for the modern workplace.
              From resume writing to remote work skills - everything you need to succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Target className="h-4 w-4" />
                <span>Career-focused</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span>Industry relevant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Rocket className="h-4 w-4" />
                <span>Future-ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Courses Section */}
      {careerCourses.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Career Courses
            </h2>
            <p className="text-gray-600">
              Start building your professional skills today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {course.category === 'career' ? 'Career' : 
                       course.category === 'technology' ? 'Technology' :
                       course.category === 'marketing' ? 'Marketing' : 'Design'}
                    </Badge>
                    <Badge className={
                      course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {course.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {course.title}
                  </CardTitle>
                  <CardDescription>
                    {course.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📚 {course.lessonCount} lessons</span>
                    <span>⏱️ {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">By {course.instructor.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {course.price === 0 ? 'FREE' : `₹${course.price}`}
                    </span>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm">
                        Start Learning
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Career Paths
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Most popular learning categories for career growth and skill development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Career Development */}
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xl">Career Development</span>
              </CardTitle>
              <CardDescription>
                Build essential professional skills for career growth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { title: "Resume Writing", courses: 2 },
                  { title: "Interview Skills", courses: 3 },
                  { title: "LinkedIn Optimization", courses: 2 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.courses} courses
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/courses?category=career">
                <Button className="w-full mt-4">
                  Explore Career
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Technology Skills */}
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xl">Technology Skills</span>
              </CardTitle>
              <CardDescription>
                Learn programming, data science, and tech skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { title: "Python Programming", courses: 3 },
                  { title: "Web Development", courses: 2 },
                  { title: "Data Science", courses: 2 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.courses} courses
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/courses?category=technology">
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Explore Technology
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Marketing & Sales */}
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-xl">Marketing & Sales</span>
              </CardTitle>
              <CardDescription>
                Master digital marketing and sales techniques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { title: "Digital Marketing", courses: 2 },
                  { title: "Social Media", courses: 2 },
                  { title: "SEO", courses: 1 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.courses} courses
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/courses?category=marketing">
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Explore Marketing
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* All Learning Categories */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            All Learning Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of learning categories for your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Briefcase className="h-5 w-5" />, title: "Resume Building", desc: "Create professional resumes", color: "bg-blue-100 text-blue-600" },
            { icon: <Users className="h-5 w-5" />, title: "Interview Skills", desc: "Master interviews", color: "bg-green-100 text-green-600" },
            { icon: <Home className="h-5 w-5" />, title: "Remote Work", desc: "Work from anywhere", color: "bg-purple-100 text-purple-600" },
            { icon: <TrendingUp className="h-5 w-5" />, title: "Leadership", desc: "Lead effectively", color: "bg-orange-100 text-orange-600" },
            { icon: <Globe className="h-5 w-5" />, title: "Communication", desc: "Better workplace communication", color: "bg-red-100 text-red-600" },
            { icon: <Wrench className="h-5 w-5" />, title: "Productivity", desc: "Get more done", color: "bg-yellow-100 text-yellow-600" },
            { icon: <Lightbulb className="h-5 w-5" />, title: "Entrepreneurship", desc: "Start your business", color: "bg-indigo-100 text-indigo-600" },
            { icon: <Target className="h-5 w-5" />, title: "Personal Branding", desc: "Build your brand", color: "bg-pink-100 text-pink-600" }
          ].map((item, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color.split(' ')[0]}`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Skills Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              In-Demand Skills You'll Learn
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Focus on skills that matter in today's job market
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Resume Building</h3>
                <p className="text-gray-600 text-sm">
                  Create professional resumes that get noticed
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interview Skills</h3>
                <p className="text-gray-600 text-sm">
                  Master the art of successful interviews
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Remote Work</h3>
                <p className="text-gray-600 text-sm">
                  Thrive in the remote work environment
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Leadership</h3>
                <p className="text-gray-600 text-sm">
                  Develop essential leadership qualities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real people achieving real career growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">R</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Rahul M.</h3>
                    <p className="text-sm text-gray-500">Software Developer</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "The interview skills course helped me land my dream job at a top tech company."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">P</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Priya S.</h3>
                    <p className="text-sm text-gray-500">Digital Marketer</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Remote work skills training helped me transition to a flexible career."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">A</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Amit K.</h3>
                    <p className="text-sm text-gray-500">Team Lead</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Leadership courses gave me the confidence to lead my team effectively."
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{careerCourses.length}+</div>
                <h3 className="text-lg font-semibold mb-2">Career Courses</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive courses for professional development
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalLessons}+</div>
                <h3 className="text-lg font-semibold mb-2">Video Lessons</h3>
                <p className="text-gray-600 text-sm">
                  Detailed lessons on career and skills topics
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{(totalStudents / 1000).toFixed(0)}K+</div>
                <h3 className="text-lg font-semibold mb-2">Students Enrolled</h3>
                <p className="text-gray-600 text-sm">
                  Join thousands advancing their careers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Advance Your Career?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals building their careers with INR99.Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4">
                  Explore All Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
