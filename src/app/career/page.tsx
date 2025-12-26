'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
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

interface LearningCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  learningPaths: LearningPath[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  courseCount: number
}

const getCategoryIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Brain': <Brain className="h-6 w-6" />,
    'TrendingUp': <TrendingUp className="h-6 w-6" />,
    'Building': <Building className="h-6 w-6" />,
    'Globe': <Globe className="h-6 w-6" />,
    'Palette': <Palette className="h-6 w-6" />,
    'Megaphone': <Megaphone className="h-6 w-6" />,
    'Briefcase': <Briefcase className="h-6 w-6" />,
    'Beaker': <Beaker className="h-6 w-6" />,
    'Heart': <Heart className="h-6 w-6" />,
    'MessageCircle': <MessageCircle className="h-6 w-6" />,
    'Shield': <Shield className="h-6 w-6" />,
    'ShoppingCart': <ShoppingCart className="h-6 w-6" />,
    'Gamepad2': <Gamepad2 className="h-6 w-6" />,
    'Home': <Home className="h-6 w-6" />,
    'Wrench': <Wrench className="h-6 w-6" />,
    'Compass': <Compass className="h-6 w-6" />,
    'Scale': <Scale className="h-6 w-6" />,
    'Users2': <Users2 className="h-6 w-6" />,
    'Rocket': <Rocket className="h-6 w-6" />
  }
  return iconMap[iconName] || <BookOpen className="h-6 w-6" />
}

const getCategoryColor = (color: string) => {
  const colorMap: Record<string, string> = {
    'bg-blue-100': 'border-blue-200 bg-blue-50',
    'bg-green-100': 'border-green-200 bg-green-50',
    'bg-orange-100': 'border-orange-200 bg-orange-50',
    'bg-purple-100': 'border-purple-200 bg-purple-50',
    'bg-red-100': 'border-red-200 bg-red-50',
    'bg-yellow-100': 'border-yellow-200 bg-yellow-50',
    'bg-pink-100': 'border-pink-200 bg-pink-50',
    'bg-indigo-100': 'border-indigo-200 bg-indigo-50',
    'bg-teal-100': 'border-teal-200 bg-teal-50'
  }
  return colorMap[color] || 'border-gray-200 bg-gray-50'
}

export default function CareerSkillsPage() {
  const [categories, setCategories] = useState<LearningCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLearningCategories()
  }, [])

  const fetchLearningCategories = async () => {
    try {
      const response = await fetch('/api/learning-categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching learning categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedCategories = () => {
    return categories.filter(cat => cat.slug === 'career-professional-development' || 
                              cat.slug === 'technology-computer-science' ||
                              cat.slug === 'business-commerce-entrepreneurship')
  }

  const getAllOtherCategories = () => {
    return categories.filter(cat => !['career-professional-development', 
                                    'technology-computer-science', 
                                    'business-commerce-entrepreneurship'].includes(cat.slug))
  }

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
          {loading ? (
            [...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            getFeaturedCategories().map((category) => (
              <Card key={category.id} className={`hover:shadow-lg transition-shadow ${getCategoryColor(category.color)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {getCategoryIcon(category.icon)}
                    </div>
                    <span className="text-xl">{category.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {category.learningPaths.slice(0, 3).map((path) => (
                      <div key={path.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-sm font-medium truncate">{path.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {path.courseCount} courses
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {category.learningPaths.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{category.learningPaths.length - 3} more learning paths
                    </p>
                  )}
                  <Link href={`/categories/${category.slug}`}>
                    <Button className="w-full mt-4">
                      Explore Category
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* All Learning Categories */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            All Learning Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of 18 learning categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(9)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            getAllOtherCategories().map((category) => (
              <Card key={category.id} className={`hover:shadow-lg transition-shadow ${getCategoryColor(category.color)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {getCategoryIcon(category.icon)}
                    </div>
                    <span className="text-lg">{category.name}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">
                      {category.learningPaths.length} paths
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {category.learningPaths.reduce((total, path) => total + path.courseCount, 0)} courses
                    </span>
                  </div>
                  <Link href={`/categories/${category.slug}`}>
                    <Button variant="outline" className="w-full">
                      Explore
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
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

      {/* Success Stories */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Success Stories
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4">
                Explore All Skills
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}