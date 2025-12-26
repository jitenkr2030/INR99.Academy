'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Video,
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  Play,
  AlertCircle
} from 'lucide-react'

interface LiveSession {
  id: string
  title: string
  description: string | null
  scheduledAt: string
  duration: number
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  roomId: string | null
  roomUrl: string | null
  maxParticipants: number | null
  currentAttendees: number
  host: {
    id: string
    name: string | null
    avatar: string | null
  }
  course: {
    id: string
    title: string
    thumbnail: string | null
  } | null
}

export default function LiveSessionsPage() {
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showUpcoming, setShowUpcoming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get session safely - store result first before destructuring
  const sessionResult = useSession()
  const session = mounted ? sessionResult.data : null

  useEffect(() => {
    setMounted(true)
    fetchSessions()
  }, [statusFilter, showUpcoming])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (showUpcoming) {
        params.append('upcoming', 'true')
      }

      const response = await fetch(`/api/live-sessions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSessions(data.sessions)
      } else {
        setError(data.message || 'Failed to fetch sessions')
      }
    } catch (err) {
      setError('Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      LIVE: 'bg-green-100 text-green-800 animate-pulse',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status === 'LIVE' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />}
        {status === 'SCHEDULED' ? 'UPCOMING' : status}
      </span>
    )
  }

  const isInstructor = mounted && (session?.user?.role === 'INSTRUCTOR' || session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Live Learning Sessions</h1>
              <p className="text-indigo-100 text-lg">
                Join interactive live classes with expert instructors
              </p>
            </div>
            {isInstructor && (
              <Link
                href="/live-sessions/create"
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Session
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Upcoming</option>
              <option value="LIVE">Live Now</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Upcoming Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700">Upcoming Only</span>
          </label>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500">
              {showUpcoming ? 'No upcoming sessions scheduled' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Link
                key={session.id}
                href={`/live-sessions/${session.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  {session.course?.thumbnail ? (
                    <img
                      src={session.course.thumbnail}
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(session.status)}
                  </div>
                  {session.status === 'LIVE' && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-sm">
                        <Play className="w-3 h-3 mr-1" />
                        Live Now
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {session.title}
                  </h3>

                  {session.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {session.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.scheduledAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(session.scheduledAt), 'h:mm a')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {session.host.avatar ? (
                        <img
                          src={session.host.avatar}
                          alt={session.host.name || ''}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-xs font-medium">
                            {session.host.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-600">{session.host.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {session.currentAttendees}
                        {session.maxParticipants && `/${session.maxParticipants}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
