import { NextRequest, NextResponse } from 'next/server'
import { 
  getDiscussions, 
  getDiscussionsByCourseId, 
  searchDiscussions,
  filterDiscussionsByDifficulty,
  filterDiscussionsByTag,
  getDiscussionTags,
  getTrendingDiscussions
} from '@/lib/simple-db'
import { getSampleUsers, getUserById } from '@/lib/simple-db'
import { createAuthToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty') as 'Beginner' | 'Intermediate' | 'Advanced' | null
    const tag = searchParams.get('tag')
    const trending = searchParams.get('trending')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let discussions = []

    // Get discussions based on filters
    if (trending === 'true') {
      discussions = getTrendingDiscussions()
    } else if (search) {
      discussions = searchDiscussions(search)
    } else if (difficulty) {
      discussions = filterDiscussionsByDifficulty(difficulty)
    } else if (tag) {
      discussions = filterDiscussionsByTag(tag)
    } else if (courseId) {
      discussions = getDiscussionsByCourseId(courseId)
    } else {
      discussions = getDiscussions()
    }

    // Get user data for each discussion
    const discussionsWithUserData = discussions
      .slice(offset, offset + limit)
      .map(discussion => {
        const user = getUserById(discussion.userId)
        const course = { id: discussion.courseId, title: 'Course Title' } // Course data would come from course service
        
        return {
          ...discussion,
          user: user ? {
            id: user.id,
            name: user.name || 'Anonymous',
            avatar: null
          } : {
            id: 'unknown',
            name: 'Unknown User',
            avatar: null
          },
          course,
          _count: {
            replies: 0 // This would come from replies service
          }
        }
      })

    const total = discussions.length

    return NextResponse.json({
      discussions: discussionsWithUserData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      tags: getDiscussionTags()
    })
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // In a real implementation, you'd validate the JWT token
    // For demo purposes, we'll extract user ID from token
    const userId = 'demo_user' // This would be extracted from the JWT

    const { title, content, courseId, tags, difficultyLevel, subjectCategory } = await request.json()

    if (!title || !content || !courseId) {
      return NextResponse.json({ error: 'Title, content, and course ID are required' }, { status: 400 })
    }

    // Verify user exists
    const user = getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // In a real implementation, you would save to database
    // For demo purposes, we'll return a mock response
    const newDiscussion = {
      id: `disc_${Date.now()}`,
      title,
      content,
      isPinned: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      courseId,
      tags: tags || [],
      difficultyLevel: difficultyLevel || 'Beginner',
      subjectCategory: subjectCategory || 'General',
      viewCount: 0,
      likeCount: 0
    }

    return NextResponse.json({
      ...newDiscussion,
      user: {
        id: user.id,
        name: user.name || 'Anonymous',
        avatar: null
      },
      course: {
        id: courseId,
        title: 'Course Title'
      },
      _count: {
        replies: 0
      }
    })
  } catch (error) {
    console.error('Error creating discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}