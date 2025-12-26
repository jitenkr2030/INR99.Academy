import { NextRequest, NextResponse } from 'next/server'
import { getDiscussionById, getDiscussionReplies, getUserById } from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if discussion exists
    const discussion = getDiscussionById(params.id)
    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    const replies = getDiscussionReplies(params.id)

    // Format replies with user data
    const repliesWithUserData = replies.map(reply => {
      const user = getUserById(reply.userId)
      return {
        ...reply,
        user: user ? {
          id: user.id,
          name: user.name || 'Anonymous',
          avatar: null
        } : {
          id: 'unknown',
          name: 'Unknown User',
          avatar: null
        }
      }
    })

    return NextResponse.json(repliesWithUserData)
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userId = 'demo_user' // This would be extracted from the JWT

    const { content, parentReplyId } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Check if discussion exists
    const discussion = getDiscussionById(params.id)
    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // In a real implementation, you would save to database
    // For demo purposes, we'll return a mock response
    const newReply = {
      id: `reply_${Date.now()}`,
      content: content.trim(),
      discussionId: params.id,
      userId,
      parentReplyId: parentReplyId || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 0,
      isEdited: false
    }

    const user = getUserById(userId)

    return NextResponse.json({
      ...newReply,
      user: user ? {
        id: user.id,
        name: user.name || 'Anonymous',
        avatar: null
      } : {
        id: 'unknown',
        name: 'Unknown User',
        avatar: null
      }
    })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}