"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'

// Demo discussions data
const demoDiscussions = [
  {
    id: '1',
    title: 'Best resources to learn React in 2024?',
    content: 'I want to start learning React but there are so many resources available. What would you recommend for a complete beginner?',
    user: { name: 'Amit Kumar', avatar: '👤' },
    course: { title: 'Complete React Development' },
    tags: ['react', 'javascript', 'beginner'],
    replies: 12,
    views: 234,
    createdAt: '2024-01-15',
    isPinned: false
  },
  {
    id: '2',
    title: 'How to structure a Node.js backend project?',
    content: 'I am building a backend API and I am confused about the folder structure. What are the best practices?',
    user: { name: 'Priya Sharma', avatar: '👩' },
    course: { title: 'Node.js Backend Development' },
    tags: ['nodejs', 'backend', 'architecture'],
    replies: 8,
    views: 156,
    createdAt: '2024-01-14',
    isPinned: true
  },
  {
    id: '3',
    title: 'Python vs JavaScript for data science',
    content: 'I want to switch to data science career. Should I learn Python first or JavaScript has good data science libraries too?',
    user: { name: 'Rahul Singh', avatar: '👨' },
    course: { title: 'Python for Data Science' },
    tags: ['python', 'javascript', 'data-science'],
    replies: 15,
    views: 312,
    createdAt: '2024-01-13',
    isPinned: false
  }
]

const trendingDiscussions = [
  { id: '2', title: 'How to structure a Node.js backend project?', replies: 8 },
  { id: '3', title: 'Python vs JavaScript for data science', replies: 15 },
  { id: '1', title: 'Best resources to learn React in 2024?', replies: 12 }
]

const popularTags = ['react', 'javascript', 'python', 'nodejs', 'frontend', 'backend', 'data-science', 'beginner']

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'white' }}>
        <div style={{ paddingTop: '64px' }}></div>
      </div>
    )
  }

  const filteredDiscussions = demoDiscussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>💬</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                Community Discussions
              </h1>
            </div>
            <p style={{ fontSize: '1rem', color: '#6b7280' }}>
              Connect with fellow learners, ask questions, and share knowledge
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Main Content */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Action Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#ea580c',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  <span>+</span> New Discussion
                </button>
                
                <div style={{
                  background: '#f3f4f6',
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                  display: 'inline-flex'
                }}>
                  <button
                    onClick={() => setActiveTab('all')}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: 'none',
                      background: activeTab === 'all' ? 'white' : 'transparent',
                      color: activeTab === 'all' ? '#111827' : '#6b7280',
                      boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    All Discussions
                  </button>
                  <button
                    onClick={() => setActiveTab('trending')}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: 'none',
                      background: activeTab === 'trending' ? 'white' : 'transparent',
                      color: activeTab === 'trending' ? '#111827' : '#6b7280',
                      boxShadow: activeTab === 'trending' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Trending
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}>
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem 0.625rem 2.5rem',
                      fontSize: '0.875rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {popularTags.slice(0, 4).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        border: '1px solid',
                        cursor: 'pointer',
                        background: selectedTag === tag ? '#111827' : 'white',
                        color: selectedTag === tag ? 'white' : '#6b7280',
                        borderColor: selectedTag === tag ? '#111827' : '#d1d5db'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.boxShadow = 'none'
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
                          fontSize: '1.25rem',
                          flexShrink: 0
                        }}>
                          {discussion.user.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {discussion.isPinned && (
                              <span style={{
                                background: '#fef3c7',
                                color: '#d97706',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.625rem',
                                fontWeight: '600'
                              }}>
                                📌 PINNED
                              </span>
                            )}
                            <h3 style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#111827',
                              margin: 0
                            }}>
                              {discussion.title}
                            </h3>
                          </div>
                          <p style={{
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                            lineHeight: '1.5'
                          }}>
                            {discussion.content.length > 150 
                              ? discussion.content.substring(0, 150) + '...' 
                              : discussion.content}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              By {discussion.user.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              📚 {discussion.course.title}
                            </span>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                              {discussion.tags.map((tag) => (
                                <span key={tag} style={{
                                  background: '#f3f4f6',
                                  color: '#6b7280',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.625rem'
                                }}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            marginTop: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid #f3f4f6'
                          }}>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              💬 {discussion.replies} replies
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              👁️ {discussion.views} views
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              🕐 {discussion.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      No discussions found
                    </h3>
                    <p style={{ fontSize: '0.875rem' }}>
                      {searchTerm ? 'Try adjusting your search or filters' : 'Be the first to start a discussion!'}
                    </p>
                    {!searchTerm && (
                      <button style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: '#ea580c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        + Start Discussion
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Community Stats */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👥</span> Community Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Total Discussions', value: demoDiscussions.length },
                    { label: 'Active Topics', value: popularTags.length },
                    { label: 'Expert Contributors', value: 12 }
                  ].map((stat, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</span>
                      <span style={{
                        background: '#f3f4f6',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Discussions */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📈</span> Trending Discussions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {trendingDiscussions.map((discussion, index) => (
                    <div
                      key={discussion.id}
                      style={{
                        padding: '0.75rem',
                        background: '#f9fafb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{
                          background: index === 0 ? '#fef3c7' : '#f3f4f6',
                          color: index === 0 ? '#d97706' : '#6b7280',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                          {discussion.title.length > 40 
                            ? discussion.title.substring(0, 40) + '...' 
                            : discussion.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', paddingLeft: '1.75rem' }}>
                        💬 {discussion.replies} replies
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🏷️</span> Popular Tags
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {popularTags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        border: '1px solid',
                        cursor: 'pointer',
                        background: selectedTag === tag ? '#111827' : 'white',
                        color: selectedTag === tag ? 'white' : '#6b7280',
                        borderColor: selectedTag === tag ? '#111827' : '#d1d5db'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2024 INR99.Academy - India's Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
