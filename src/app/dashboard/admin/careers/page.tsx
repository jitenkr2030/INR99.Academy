'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react'

interface JobApplication {
  id: string
  position: string
  department: string | null
  fullName: string
  email: string
  phone: string | null
  linkedin: string | null
  experience: string | null
  coverLetter: string | null
  resumeUrl: string | null
  portfolioUrl: string | null
  status: string
  notes: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface StatusCounts {
  [key: string]: number
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  REVIEWING: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  INTERVIEW: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  OFFER: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  REJECTED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
}

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updateLoading, setUpdateLoading] = useState(false)

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter)
      }

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/careers?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setApplications(data.applications)
        setPagination(data.pagination)
        setStatusCounts(data.statusCounts)
      } else {
        console.error('Failed to fetch applications:', data.error)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [pagination.page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchApplications()
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdateLoading(true)
    try {
      const response = await fetch('/api/careers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus })
      })

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus, reviewedAt: new Date().toISOString() }
              : app
          )
        )
        // Refresh to get updated counts
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const response = await fetch(`/api/careers?id=${applicationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== applicationId))
        fetchApplications()
      }
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const viewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setShowDetailModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalApplications = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review job applications from candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div 
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              statusFilter === 'ALL' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setStatusFilter('ALL')}
          >
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
          </div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div 
              key={status}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                statusFilter === status 
                  ? `${statusColors[status].bg} ${statusColors[status].border}` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setStatusFilter(statusFilter === status ? 'ALL' : status)}
            >
              <p className={`text-sm ${statusColors[status].text}`}>{statusLabels[status]}</p>
              <p className={`text-2xl font-bold ${statusColors[status].text}`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{app.fullName}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-gray-900">{app.position}</p>
                          <p className="text-sm text-gray-500">{app.department}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select 
                          value={app.status} 
                          onValueChange={(value) => handleStatusChange(app.id, value)}
                          disabled={updateLoading}
                        >
                          <SelectTrigger className={`w-[140px] ${statusColors[app.status]?.bg} ${statusColors[app.status]?.text} border-0`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="REVIEWING">Reviewing</SelectItem>
                            <SelectItem value="INTERVIEW">Interview</SelectItem>
                            <SelectItem value="OFFER">Offer</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(app.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => viewApplication(app)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {app.resumeUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                              title="View Resume"
                            >
                              <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(app.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} applications
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <p className="text-gray-500 text-sm">ID: {selectedApplication.id}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Select 
                    value={selectedApplication.status} 
                    onValueChange={(value) => {
                      handleStatusChange(selectedApplication.id, value)
                      setSelectedApplication(prev => prev ? { ...prev, status: value } : null)
                    }}
                  >
                    <SelectTrigger className={`w-[140px] ${statusColors[selectedApplication.status]?.bg} ${statusColors[selectedApplication.status]?.text}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWING">Reviewing</SelectItem>
                      <SelectItem value="INTERVIEW">Interview</SelectItem>
                      <SelectItem value="OFFER">Offer</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Applied</p>
                  <p className="text-gray-900">{formatDate(selectedApplication.createdAt)}</p>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Candidate Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{selectedApplication.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{selectedApplication.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{selectedApplication.experience || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:underline">
                      {selectedApplication.email}
                    </a>
                  </div>
                  {selectedApplication.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={`tel:${selectedApplication.phone}`} className="text-blue-600 hover:underline">
                        {selectedApplication.phone}
                      </a>
                    </div>
                  )}
                  {selectedApplication.linkedin && (
                    <div className="flex items-center">
                      <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                        LinkedIn Profile
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume */}
              {selectedApplication.resumeUrl && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Resume</h4>
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </a>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Review Info */}
              {selectedApplication.reviewedAt && (
                <div className="text-sm text-gray-500">
                  <p>Last reviewed: {formatDate(selectedApplication.reviewedAt)}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                {selectedApplication.resumeUrl && (
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                  </a>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedApplication.id)
                    setShowDetailModal(false)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
