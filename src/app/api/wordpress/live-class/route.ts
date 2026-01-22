/**
 * WordPress Live Class API
 * Endpoint: /api/wordpress/live-class
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/wordpress/auth';
import { checkAPILimit, checkFeatureAccess, recordAPICall } from '@/lib/wordpress/license-manager';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_TOKEN', message: 'Access token required' } },
      { status: 401 }
    );
  }

  const payload = await validateAccessToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }

  // Check feature access
  const featureAccess = await checkFeatureAccess(payload.siteId, 'live_classes');
  if (!featureAccess.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'FEATURE_NOT_AVAILABLE', message: featureAccess.message } },
      { status: 403 }
    );
  }

  // Check API limit
  const limitCheck = await checkAPILimit(payload.siteId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
      { status: 429 }
    );
  }

  recordAPICall(payload.siteId, '/wordpress/live-class');

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const status = searchParams.get('status');

    if (sessionId) {
      const session = await db.wpLiveSessions.findFirst({
        where: { siteId: payload.siteId, id: sessionId },
      });

      return session
        ? NextResponse.json({ success: true, data: session })
        : NextResponse.json(
            { success: false, error: { code: 'NOT_FOUND', message: 'Session not found' } },
            { status: 404 }
          );
    }

    const sessions = await db.wpLiveSessions.findMany({
      where: {
        siteId: payload.siteId,
        ...(status && { status }),
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch sessions' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_TOKEN', message: 'Access token required' } },
      { status: 401 }
    );
  }

  const payload = await validateAccessToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const session = await db.wpLiveSessions.create({
      data: {
        siteId: payload.siteId,
        title: body.title,
        description: body.description,
        instructorId: body.instructorId,
        scheduledAt: new Date(body.scheduledAt),
        duration: body.duration || 60,
        platform: body.platform || 'internal',
        meetingUrl: body.meetingUrl,
        meetingId: body.meetingId,
        status: 'scheduled',
      },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create session' } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_TOKEN', message: 'Access token required' } },
      { status: 401 }
    );
  }

  const payload = await validateAccessToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { sessionId, status } = body;

    const session = await db.wpLiveSessions.update({
      where: { siteId: payload.siteId, id: sessionId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update session' } },
      { status: 500 }
    );
  }
}
