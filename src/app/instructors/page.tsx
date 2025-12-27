import { NewNavigation } from "@/components/new-navigation"
import { Footer } from "@/components/footer"

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Instructors</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Learn from industry experts and experienced educators who are passionate about sharing their knowledge.
          </p>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Computer Science",
              bio: "PhD from MIT with 15+ years of experience in software development and AI research.",
              image: "/instructors/sarah.jpg"
            },
            {
              name: "Prof. Michael Chen",
              role: "Data Science",
              bio: "Former Google data scientist with expertise in machine learning and big data analytics.",
              image: "/instructors/michael.jpg"
            },
            {
              name: "Emily Rodriguez",
              role: "Web Development",
              bio: "Senior frontend developer with 10+ years experience building scalable web applications.",
              image: "/instructors/emily.jpg"
            },
            {
              name: "James Wilson",
              role: "Cybersecurity",
              bio: "Certified ethical hacker and security consultant with experience at Fortune 500 companies.",
              image: "/instructors/james.jpg"
            },
            {
              name: "Dr. Lisa Park",
              role: "Cloud Computing",
              bio: "AWS certified solutions architect with extensive experience in cloud infrastructure.",
              image: "/instructors/lisa.jpg"
            },
            {
              name: "Robert Martinez",
              role: "Mobile Development",
              bio: "iOS and Android developer who has built apps with millions of downloads.",
              image: "/instructors/robert.jpg"
            }
          ].map((instructor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <span className="text-6xl">👨‍🏫</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                <p className="text-orange-500 font-medium mb-3">{instructor.role}</p>
                <p className="text-gray-600 text-sm">{instructor.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
