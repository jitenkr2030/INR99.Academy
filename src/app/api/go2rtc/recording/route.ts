import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action } = body;

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session information
    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify host permissions
    if (liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const streamName = liveSession.roomId || `session_${sessionId}`;

    if (action === 'start') {
      // Start recording
      const recordingPath = await go2rtc.startRecording(streamName);
      
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: {
          isRecorded: true,
          recordingUrl: recordingPath,
        },
      });

      return NextResponse.json({ success: true, recordingPath });
    } 
    
    if (action === 'stop') {
      // Stop recording
      await go2rtc.stopRecording(streamName);
      
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: {
          isRecorded: false,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Recording operation failed:', error);
    return NextResponse.json(
      { error: 'Recording operation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const streamName = liveSession.roomId || `session_${sessionId}`;
    const status = await go2rtc.getStreamStatus(streamName);

    return NextResponse.json({
      sessionId,
      streamName,
      status: status.status,
      viewers: status.viewers,
      bitrate: status.bitrate,
      isRecorded: liveSession.isRecorded,
      recordingUrl: liveSession.recordingUrl,
    });
  } catch (error) {
    console.error('Failed to get recording status:', error);
    return NextResponse.json(
      { error: 'Failed to get recording status' },
      { status: 500 }
    );
  }
}
