import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, hostId } = body;

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the requesting user is the host
    if (hostId && session.user.id !== hostId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Only host can create stream' }, { status: 403 });
    }

    // Create stream name from session identifier
    const streamName = `session_${sessionId}`;

    // Create stream in go2rtc
    await go2rtc.createStream({ name: streamName });

    // Update session with stream information
    await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        roomId: streamName,
        roomUrl: go2rtc.getWHEPUrl(streamName),
      },
    });

    return NextResponse.json({
      success: true,
      streamName,
      whipUrl: go2rtc.getWHIPUrl(streamName),
      whepUrl: go2rtc.getWHEPUrl(streamName),
    });
  } catch (error) {
    console.error('Failed to create stream:', error);
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const streamName = liveSession.roomId || `session_${sessionId}`;

    // Delete stream from go2rtc
    await go2rtc.deleteStream(streamName);

    // Update session to remove stream information
    await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        roomId: null,
        roomUrl: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete stream:', error);
    return NextResponse.json(
      { error: 'Failed to delete stream' },
      { status: 500 }
    );
  }
}
