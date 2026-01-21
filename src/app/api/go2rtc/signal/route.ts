import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

interface SignalRequest {
  sessionId: string;
  sdp: string;
  type: 'offer' | 'answer';
  protocol: 'whip' | 'whep';
  candidate?: RTCIceCandidateInit;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sdp, type, protocol, candidate } = body as SignalRequest;

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session information
    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify access for viewers (whep)
    if (protocol === 'whep') {
      const hasAccess = await verifySessionAccess(liveSession, session.user.id);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Verify host permissions for broadcasting (whip)
    if (protocol === 'whip' && liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Only host can broadcast' }, { status: 403 });
    }

    // Get stream name
    const streamName = liveSession.roomId || `session_${sessionId}`;

    // Handle ICE candidate addition
    if (candidate) {
      // For ICE candidates, we need to use the go2rtc WebRTC API
      // This is a simplified approach - in production, you may need
      // to maintain WebRTC connections on the server side
      return NextResponse.json({ success: true });
    }

    // Exchange SDP with go2rtc
    const streamUrl = protocol === 'whip' 
      ? go2rtc.getWHIPUrl(streamName)
      : go2rtc.getWHEPUrl(streamName);

    // Forward SDP to go2rtc and get response
    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sdp',
      },
      body: sdp,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SDP exchange failed: ${response.status} - ${errorText}`);
    }

    const responseSdp = await response.text();

    return NextResponse.json({
      sdp: responseSdp,
      type: 'answer',
    });
  } catch (error) {
    console.error('Signal exchange failed:', error);
    return NextResponse.json(
      { error: 'Signal exchange failed' },
      { status: 500 }
    );
  }
}

async function verifySessionAccess(
  liveSession: Awaited<ReturnType<typeof prisma.liveSession.findUnique>>,
  userId: string
): Promise<boolean> {
  // Check if user is enrolled in associated course
  if (liveSession.courseId && liveSession.course?.enrollments?.length > 0) {
    return true;
  }

  // Check if user has active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      endDate: { gte: new Date() },
    },
  });

  return !!subscription;
}
