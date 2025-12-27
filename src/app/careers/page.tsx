import { NewNavigation } from "@/components/new-navigation"
import { Footer } from "@/components/footer"

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      description: "We're looking for an experienced frontend developer to help build the next generation of our learning platform."
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote / Bangalore",
      type: "Full-time",
      description: "Join our backend team to build scalable APIs and microservices that power millions of learners."
    },
    {
      title: "Data Scientist",
      department: "Data",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Help us build intelligent learning recommendations and analytics systems."
    },
    {
      title: "Content Creator (Web Development)",
      department: "Content",
      location: "Remote",
      type: "Contract",
      description: "Create engaging web development courses for our global audience."
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Help our enterprise customers get the most out of their learning programs."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Drive growth and brand awareness for INR99 Academy."
    }
  ]

  const benefits = [
    { icon: "💰", title: "Competitive Salary", description: "Industry-leading compensation packages" },
    { icon: "🏥", title: "Health Insurance", description: "Comprehensive health coverage for you and family" },
    { icon: "🏖️", title: "Flexible Time Off", description: "Unlimited paid time off policy" },
    { icon: "🏠", title: "Remote Work", description: "Work from anywhere option available" },
    { icon: "📚", title: "Learning Budget", description: "Annual budget for courses and conferences" },
    { icon: "🎉", title: "Team Events", description: "Regular team building and social events" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Help us transform education and empower millions of learners worldwide.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Join INR99 Academy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <span className="text-4xl mb-4 block">{benefit.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Open Positions</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {positions.map((position, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                  <p className="text-orange-500 font-medium">{position.department}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{position.location}</span>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">{position.type}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{position.description}</p>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-lg p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't see the right role?</h3>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a 
            href="mailto:careers@inr99.com" 
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
