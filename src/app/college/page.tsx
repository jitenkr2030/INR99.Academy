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
  GraduationCap,
  Briefcase,
  Calculator,
  Globe,
  Palette,
  Database,
  Beaker,
  Building,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface CollegeDegree {
  id: string
  name: string
  shortCode: string
  level: string
  duration: number
  subjects: CollegeSubject[]
}

interface CollegeSubject {
  id: string
  name: string
  code?: string
  semester?: number
  courseCount: number
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'UNDERGRADUATE': return <GraduationCap className="h-5 w-5" />
    case 'POSTGRADUATE': return <BookOpen className="h-5 w-5" />
    case 'DIPLOMA': return <Briefcase className="h-5 w-5" />
    case 'CERTIFICATE': return <Star className="h-5 w-5" />
    default: return <BookOpen className="h-5 w-5" />
  }
}

const getSubjectIcon = (subjectName: string) => {
  const name = subjectName.toLowerCase()
  if (name.includes('account') || name.includes('finance') || name.includes('tax')) return <Calculator className="h-5 w-5" />
  if (name.includes('programming') || name.includes('computer') || name.includes('data')) return <Database className="h-5 w-5" />
  if (name.includes('physics') || name.includes('chemistry') || name.includes('biology')) return <Beaker className="h-5 w-5" />
  if (name.includes('business') || name.includes('management') || name.includes('marketing')) return <TrendingUp className="h-5 w-5" />
  if (name.includes('engineering') || name.includes('mechanical') || name.includes('electrical')) return <Building className="h-5 w-5" />
  if (name.includes('english') || name.includes('communication')) return <Globe className="h-5 w-5" />
  if (name.includes('math') || name.includes('statistics')) return <Calculator className="h-5 w-5" />
  if (name.includes('design') || name.includes('art')) return <Palette className="h-5 w-5" />
  return <BookOpen className="h-5 w-5" />
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'UNDERGRADUATE': return 'border-blue-200 bg-blue-50'
    case 'POSTGRADUATE': return 'border-green-200 bg-green-50'
    case 'DIPLOMA': return 'border-orange-200 bg-orange-50'
    case 'CERTIFICATE': return 'border-purple-200 bg-purple-50'
    default: return 'border-gray-200 bg-gray-50'
  }
}

const getLevelDescription = (level: string) => {
  switch (level) {
    case 'UNDERGRADUATE': return 'BA/BSc/BCom/BBA/BCA: Foundation courses for bachelor\'s degrees'
    case 'POSTGRADUATE': return 'MA/MSc/MCom/MBA: Advanced specialized learning'
    case 'DIPLOMA': return 'Practical skill development and certification programs'
    case 'CERTIFICATE': return 'Short-term courses for specific skills'
    default: return 'Comprehensive higher education experience'
  }
}

export default function CollegeLearningPage() {
  const [degrees, setDegrees] = useState<CollegeDegree[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollegeDegrees()
  }, [])

  const fetchCollegeDegrees = async () => {
    try {
      const response = await fetch('/api/college/degrees')
      const data = await response.json()

      if (data.success) {
        setDegrees(data.degrees)
      }
    } catch (error) {
      console.error('Error fetching college degrees:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupDegreesByLevel = () => {
    const grouped = {
      UNDERGRADUATE: [],
      POSTGRADUATE: [],
      DIPLOMA: [],
      CERTIFICATE: []
    }

    degrees.forEach(degree => {
      if (grouped[degree.level]) {
        grouped[degree.level].push(degree)
      }
    })

    return grouped
  }

  const groupedDegrees = groupDegreesByLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              🎓 College Learning (UG Foundation)
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Foundation Courses for Higher Education
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Building strong foundations for undergraduate degrees with concept-focused learning.
              Not affiliated with any university - pure academic support and foundation building.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <BookOpen className="h-4 w-4" />
                <span>Foundation focused</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span>Concept clarity</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Users className="h-4 w-4" />
                <span>All degrees covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="undergraduate" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Degree Level
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your degree level to explore foundation subjects and start building strong fundamentals
            </p>
          </div>

          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="undergraduate" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              UG
            </TabsTrigger>
            <TabsTrigger value="postgraduate" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              PG
            </TabsTrigger>
            <TabsTrigger value="diploma" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Diploma
            </TabsTrigger>
            <TabsTrigger value="certificate" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Certificate
            </TabsTrigger>
          </TabsList>

          {/* Undergraduate Level */}
          <TabsContent value="undergraduate" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('UNDERGRADUATE')}
                <h3 className="text-2xl font-bold text-gray-900">Undergraduate Foundation</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('UNDERGRADUATE')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(4)].map((_, index) => (
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
                groupedDegrees.UNDERGRADUATE.map((degree) => (
                  <Card key={degree.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('UNDERGRADUATE')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{degree.name}</span>
                          <Badge variant="outline" className="ml-2">{degree.shortCode}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{degree.duration} years</div>
                          <Badge variant="secondary">{degree.subjects.length} subjects</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Foundation courses for bachelor's degree programs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        {degree.subjects.slice(0, 4).map((subject) => (
                          <div key={subject.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject.name)}
                            <div className="flex-1">
                              <span className="text-sm font-medium">{subject.name}</span>
                              {subject.semester && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Sem {subject.semester}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {degree.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{degree.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/college/degree/${degree.id}`}>
                        <Button className="w-full mt-4">
                          Start Learning
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Postgraduate Level */}
          <TabsContent value="postgraduate" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('POSTGRADUATE')}
                <h3 className="text-2xl font-bold text-gray-900">Postgraduate Studies</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('POSTGRADUATE')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                groupedDegrees.POSTGRADUATE.map((degree) => (
                  <Card key={degree.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('POSTGRADUATE')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{degree.name}</span>
                          <Badge variant="outline" className="ml-2">{degree.shortCode}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{degree.duration} years</div>
                          <Badge variant="secondary">{degree.subjects.length} subjects</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Advanced specialized learning for master's programs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        {degree.subjects.slice(0, 4).map((subject) => (
                          <div key={subject.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject.name)}
                            <div className="flex-1">
                              <span className="text-sm font-medium">{subject.name}</span>
                              {subject.semester && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Sem {subject.semester}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {degree.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{degree.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/college/degree/${degree.id}`}>
                        <Button className="w-full mt-4">
                          Start Learning
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Diploma Level */}
          <TabsContent value="diploma" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('DIPLOMA')}
                <h3 className="text-2xl font-bold text-gray-900">Diploma Programs</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('DIPLOMA')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                groupedDegrees.DIPLOMA.map((degree) => (
                  <Card key={degree.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('DIPLOMA')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{degree.name}</span>
                          <Badge variant="outline" className="ml-2">{degree.shortCode}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{degree.duration} years</div>
                          <Badge variant="secondary">{degree.subjects.length} subjects</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Practical skill development and hands-on learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        {degree.subjects.slice(0, 4).map((subject) => (
                          <div key={subject.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject.name)}
                            <div className="flex-1">
                              <span className="text-sm font-medium">{subject.name}</span>
                              {subject.semester && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Sem {subject.semester}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {degree.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{degree.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/college/degree/${degree.id}`}>
                        <Button className="w-full mt-4">
                          Start Learning
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Certificate Level */}
          <TabsContent value="certificate" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('CERTIFICATE')}
                <h3 className="text-2xl font-bold text-gray-900">Certificate Courses</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('CERTIFICATE')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                groupedDegrees.CERTIFICATE.map((degree) => (
                  <Card key={degree.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('CERTIFICATE')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{degree.name}</span>
                          <Badge variant="outline" className="ml-2">{degree.shortCode}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{degree.duration} years</div>
                          <Badge variant="secondary">{degree.subjects.length} subjects</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Short-term focused skill development
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
                        {degree.subjects.slice(0, 4).map((subject) => (
                          <div key={subject.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject.name)}
                            <div className="flex-1">
                              <span className="text-sm font-medium">{subject.name}</span>
                              {subject.semester && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Sem {subject.semester}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {degree.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{degree.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/college/degree/${degree.id}`}>
                        <Button className="w-full mt-4">
                          Start Learning
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Our College Learning Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed for foundation building, not university-specific coaching
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Foundation First</h3>
                <p className="text-gray-600">
                  We build strong foundations that work across all universities and institutions
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Concept-Based</h3>
                <p className="text-gray-600">
                  Focus on understanding core concepts that remain valuable regardless of syllabus changes
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Broad Coverage</h3>
                <p className="text-gray-600">
                  All major degree programs covered with essential foundation subjects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="bg-yellow-50 border-l-4 border-yellow-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <div className="text-yellow-600 mt-1">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700">
                This platform provides conceptual learning and academic support for college education. 
                It is not affiliated with any university, college, or examination authority. 
                Our foundation courses are designed to supplement, not replace, formal university education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Build Strong College Foundations?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of college students building their future with strong conceptual foundations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4">
                Explore All Degrees
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}