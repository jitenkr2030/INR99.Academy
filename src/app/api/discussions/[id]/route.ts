import { NextRequest, NextResponse } from 'next/server'
import { getDiscussionById, getDiscussionReplies, getUserById } from '@/lib/simple-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussion = getDiscussionById(params.id)

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    const user = getUserById(discussion.userId)
    const replies = getDiscussionReplies(params.id)

    // Format replies with user data
    const repliesWithUserData = replies.map(reply => {
      const replyUser = getUserById(reply.userId)
      return {
        ...reply,
        user: replyUser ? {
          id: replyUser.id,
          name: replyUser.name || 'Anonymous',
          avatar: null
        } : {
          id: 'unknown',
          name: 'Unknown User',
          avatar: null
        }
      }
    })

    const formattedDiscussion = {
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
      course: {
        id: discussion.courseId,
        title: 'Course Title' // This would come from course service
      },
      replies: repliesWithUserData,
      _count: {
        replies: repliesWithUserData.length
      }
    }

    return NextResponse.json(formattedDiscussion)
  } catch (error) {
    console.error('Error fetching discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // In a real implementation, you'd validate the JWT token
    const userId = 'demo_user' // This would be extracted from the JWT

    const { title, content, isPinned } = await request.json()

    // Check if discussion exists
    const existingDiscussion = getDiscussionById(params.id)
    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // Only allow owner to edit, or admin to pin/unpin
    if (existingDiscussion.userId !== userId && !isPinned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // In a real implementation, you would update the database
    // For demo purposes, we'll return the existing discussion with updated data
    const updatedDiscussion = {
      ...existingDiscussion,
      title: title !== undefined ? title : existingDiscussion.title,
      content: content !== undefined ? content : existingDiscussion.content,
      isPinned: isPinned !== undefined ? isPinned : existingDiscussion.isPinned,
      updatedAt: new Date().toISOString()
    }

    const user = getUserById(updatedDiscussion.userId)
    const replies = getDiscussionReplies(params.id)

    // Format replies with user data
    const repliesWithUserData = replies.map(reply => {
      const replyUser = getUserById(reply.userId)
      return {
        ...reply,
        user: replyUser ? {
          id: replyUser.id,
          name: replyUser.name || 'Anonymous',
          avatar: null
        } : {
          id: 'unknown',
          name: 'Unknown User',
          avatar: null
        }
      }
    })

    return NextResponse.json({
      ...updatedDiscussion,
      user: user ? {
        id: user.id,
        name: user.name || 'Anonymous',
        avatar: null
      } : {
        id: 'unknown',
        name: 'Unknown User',
        avatar: null
      },
      course: {
        id: updatedDiscussion.courseId,
        title: 'Course Title'
      },
      replies: repliesWithUserData,
      _count: {
        replies: repliesWithUserData.length
      }
    })
  } catch (error) {
    console.error('Error updating discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    const existingDiscussion = getDiscussionById(params.id)
    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    if (existingDiscussion.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // In a real implementation, you would delete from database
    // For demo purposes, we'll just return success
    return NextResponse.json({ message: 'Discussion deleted successfully' })
  } catch (error) {
    console.error('Error deleting discussion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}