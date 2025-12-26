"use client"

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Discussion {
  id: string
  title: string
  content: string
  isPinned: boolean
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  course: {
    id: string
    title: string
  }
  replies: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string
      avatar?: string
    }
  }>
}

function DiscussionContent() {
  const params = useParams()
  const router = useRouter()
  const discussionId = params.id as string
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const { data: session, status } = useSession()

  const user = session?.user
  const isAuthenticated = status === 'authenticated'

  useEffect(() => {
    fetchDiscussion()
  }, [discussionId])

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(`/api/discussions/${discussionId}`)
      if (response.ok) {
        const data = await response.json()
        setDiscussion(data)
      } else {
        router.push('/community')
      }
    } catch (error) {
      console.log('Failed to fetch discussion')
      router.push('/community')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async () => {
    if (!isAuthenticated) {
      alert('Please log in to reply')
      return
    }

    if (!replyContent.trim()) {
      alert('Please enter a reply')
      return
    }

    setSubmittingReply(true)
    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyContent.trim()
        })
      })

      if (response.ok) {
        setReplyContent('')
        fetchDiscussion()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to post reply')
      }
    } catch (error) {
      alert('Failed to post reply')
    } finally {
      setSubmittingReply(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const handleDeleteDiscussion = async () => {
    if (!isAuthenticated || !user) return

    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Discussion deleted successfully')
        router.push('/community')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete discussion')
      }
    } catch (error) {
      alert('Failed to delete discussion')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #f97316', 
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Discussion Not Found</h1>
          <Link href="/community" style={{
            display: 'inline-block',
            background: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Back to Community
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user && (user as any).id === discussion.user.id

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/community" style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <span style={{ marginRight: '0.25rem' }}>←</span>
            Back to Community
          </Link>
        </div>

        {/* Discussion Header */}
        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {discussion.isPinned && (
                  <span style={{ fontSize: '1rem' }}>📌</span>
                )}
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {discussion.title}
                </h1>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>👤</span>
                  <span>{discussion.user.name}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>📚</span>
                  <span>{discussion.course.title}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>🕐</span>
                  <span>{formatDate(discussion.createdAt)}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>💬</span>
                  <span>{discussion.replies.length} replies</span>
                </span>
              </div>
            </div>
            {isOwner && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    opacity: 0.6
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={handleDeleteDiscussion}
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#dc2626'
                  }}
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          <div style={{ color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {discussion.content}
          </div>
        </div>

        {/* Reply Section */}
        {isAuthenticated && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Post a Reply</h3>
            <textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={handleSubmitReply}
              disabled={submittingReply || !replyContent.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: submittingReply ? '#9ca3af' : '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: submittingReply ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              {submittingReply ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        )}

        {/* Replies */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Replies ({discussion.replies.length})
          </h2>
          
          {discussion.replies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {discussion.replies.map((reply) => (
                <div 
                  key={reply.id}
                  style={{ 
                    background: 'white', 
                    borderRadius: '0.75rem', 
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      flexShrink: 0
                    }}>
                      {reply.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>
                            {reply.user.name}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {reply.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '3rem 1.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No replies yet</h3>
              <p style={{ color: '#6b7280' }}>
                Be the first to share your thoughts on this discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        border: '4px solid #f97316', 
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function DiscussionDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DiscussionContent />
    </Suspense>
  )
}
