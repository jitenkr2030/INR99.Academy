/**
 * WordPress User Progress API
 * Endpoint: /api/wordpress/progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/wordpress/auth';
import { checkAPILimit, recordAPICall } from '@/lib/wordpress/license-manager';
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

  const limitCheck = await checkAPILimit(payload.siteId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
      { status: 429 }
    );
  }

  recordAPICall(payload.siteId, '/wordpress/progress');

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (userId) {
      const progressRecords = await db.wpUserProgress.findMany({
        where: {
          siteId: payload.siteId,
          userId,
          ...(courseId && { courseId }),
        },
        orderBy: { lastAccessedAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: progressRecords,
      });
    }

    // Get all progress for site
    const progress = await db.wpUserProgress.findMany({
      where: { siteId: payload.siteId },
      orderBy: { lastAccessedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch progress' } },
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
    const { userId, courseId, lessonId, progress, completed } = body;

    if (!userId || !courseId || progress === undefined) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'userId, courseId, and progress are required' } },
        { status: 400 }
      );
    }

    const progressRecord = await db.wpUserProgress.upsert({
      where: {
        id: `${payload.siteId}-${userId}-${courseId}`,
      },
      create: {
        id: `${payload.siteId}-${userId}-${courseId}`,
        siteId: payload.siteId,
        userId,
        courseId,
        lessonId,
        progress,
        completedAt: completed ? new Date() : null,
        lastAccessedAt: new Date(),
      },
      update: {
        lessonId,
        progress,
        completedAt: completed ? new Date() : undefined,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: progressRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update progress' } },
      { status: 500 }
    );
  }
}
