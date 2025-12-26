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
  TrendingUp,
  Building,
  Calculator,
  PiggyBank,
  DollarSign,
  BarChart3,
  Briefcase,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Shield,
  CreditCard,
  Banknote,
  PieChart,
  TrendingDown,
  ArrowUpRight,
  Percent,
  FileText,
  Scale
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
    'TrendingUp': <TrendingUp className="h-6 w-6" />,
    'Building': <Building className="h-6 w-6" />,
    'Calculator': <Calculator className="h-6 w-6" />,
    'PiggyBank': <PiggyBank className="h-6 w-6" />,
    'DollarSign': <DollarSign className="h-6 w-6" />,
    'BarChart3': <BarChart3 className="h-6 w-6" />,
    'Briefcase': <Briefcase className="h-6 w-6" />,
    'Target': <Target className="h-6 w-6" />,
    'Award': <Award className="h-6 w-6" />,
    'Lightbulb': <Lightbulb className="h-6 w-6" />,
    'Rocket': <Rocket className="h-6 w-6" />,
    'Shield': <Shield className="h-6 w-6" />,
    'CreditCard': <CreditCard className="h-6 w-6" />,
    'Banknote': <Banknote className="h-6 w-6" />,
    'PieChart': <PieChart className="h-6 w-6" />,
    'TrendingDown': <TrendingDown className="h-6 w-6" />,
    'ArrowUpRight': <ArrowUpRight className="h-6 w-6" />,
    'Percent': <Percent className="h-6 w-6" />,
    'FileText': <FileText className="h-6 w-6" />,
    'Scale': <Scale className="h-6 w-6" />
  }
  return iconMap[iconName] || <BookOpen className="h-6 w-6" />
}

const getCategoryColor = (color: string) => {
  const colorMap: Record<string, string> = {
    'bg-green-100': 'border-green-200 bg-green-50',
    'bg-blue-100': 'border-blue-200 bg-blue-50',
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

export default function MoneyBusinessPage() {
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

  const getMoneyBusinessCategories = () => {
    return categories.filter(cat => cat.slug === 'money-finance-economics' || 
                              cat.slug === 'business-commerce-entrepreneurship' ||
                              cat.slug === 'ecommerce-online-business')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              💰 Money & Business
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Master Your Financial Future
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Personal finance, investment strategies, business fundamentals, and entrepreneurial skills.
              Build wealth and create opportunities with practical, India-focused financial education.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <PiggyBank className="h-4 w-4" />
                <span>Financial literacy</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span>Investment basics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Building className="h-4 w-4" />
                <span>Business fundamentals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Money & Business Learning Paths
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive financial education and business skill development
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
            getMoneyBusinessCategories().map((category) => (
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

        {/* Key Learning Areas */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            What You'll Learn
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Essential skills for financial success and business growth
          </p>
        </div>

        <Tabs defaultValue="personal-finance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="personal-finance">Personal Finance</TabsTrigger>
            <TabsTrigger value="investing">Investing</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-finance" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <PiggyBank className="h-5 w-5" />, title: "Budgeting", desc: "Create and manage personal budgets" },
                { icon: <CreditCard className="h-5 w-5" />, title: "Debt Management", desc: "Understand and control debt" },
                { icon: <Shield className="h-5 w-5" />, title: "Insurance", desc: "Protect your financial future" },
                { icon: <Banknote className="h-5 w-5" />, title: "Savings", desc: "Build emergency funds" },
                { icon: <Percent className="h-5 w-5" />, title: "Tax Planning", desc: "Optimize your tax strategy" },
                { icon: <FileText className="h-5 w-5" />, title: "Financial Goals", desc: "Set and achieve goals" },
                { icon: <TrendingDown className="h-5 w-5" />, title: "Expense Tracking", desc: "Monitor spending habits" },
                { icon: <PieChart className="h-5 w-5" />, title: "Net Worth", desc: "Calculate and grow net worth" }
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="investing" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <BarChart3 className="h-5 w-5" />, title: "Stocks", desc: "Learn stock market basics" },
                { icon: <ArrowUpRight className="h-5 w-5" />, title: "Mutual Funds", desc: "Understand fund investments" },
                { icon: <Building className="h-5 w-5" />, title: "Real Estate", desc: "Property investment basics" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "SIPs", desc: "Systematic investment plans" },
                { icon: <DollarSign className="h-5 w-5" />, title: "Bonds", desc: "Fixed income securities" },
                { icon: <Calculator className="h-5 w-5" />, title: "Risk Management", desc: "Assess investment risks" },
                { icon: <Award className="h-5 w-5" />, title: "Portfolio", desc: "Build diverse portfolios" },
                { icon: <Target className="h-5 w-5" />, title: "Goals", desc: "Goal-based investing" }
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Briefcase className="h-5 w-5" />, title: "Business Planning", desc: "Create business plans" },
                { icon: <Scale className="h-5 w-5" />, title: "Legal Structure", desc: "Business entity types" },
                { icon: <FileText className="h-5 w-5" />, title: "Accounting", desc: "Financial statements" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Marketing", desc: "Business promotion" },
                { icon: <Users className="h-5 w-5" />, title: "Sales", desc: "Revenue generation" },
                { icon: <Lightbulb className="h-5 w-5" />, title: "Innovation", desc: "Business innovation" },
                { icon: <Rocket className="h-5 w-5" />, title: "Growth", desc: "Scale your business" },
                { icon: <Shield className="h-5 w-5" />, title: "Compliance", desc: "Legal requirements" }
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Success Metrics */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Financial Education Matters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real impact of financial literacy on your life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">73%</div>
                <h3 className="text-lg font-semibold mb-2">Better Financial Decisions</h3>
                <p className="text-gray-600 text-sm">
                  Financially literate individuals make better money decisions
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.5x</div>
                <h3 className="text-lg font-semibold mb-2">Higher Savings Rate</h3>
                <p className="text-gray-600 text-sm">
                  Financial education leads to significantly higher savings
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                <h3 className="text-lg font-semibold mb-2">Reduced Financial Stress</h3>
                <p className="text-gray-600 text-sm">
                  Less anxiety about money matters with proper knowledge
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
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Educational Purpose Only</h3>
              <p className="text-yellow-700">
                This platform provides financial education and business knowledge for learning purposes. 
                It is not financial advice, investment recommendation, or business consulting service. 
                Always consult with qualified professionals for personal financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Master Your Finances?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of Indians building wealth and business knowledge with INR99.Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4">
                Explore All Topics
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}