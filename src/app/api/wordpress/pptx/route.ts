/**
 * WordPress PPTX Conversion API
 * Endpoint: /api/wordpress/pptx
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

  const limitCheck = await checkAPILimit(payload.siteId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
      { status: 429 }
    );
  }

  recordAPICall(payload.siteId, '/wordpress/pptx');

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (jobId) {
      const job = await db.wpPPTXJobs.findFirst({
        where: { siteId: payload.siteId, id: jobId },
      });

      return job
        ? NextResponse.json({ success: true, data: job })
        : NextResponse.json(
            { success: false, error: { code: 'NOT_FOUND', message: 'Job not found' } },
            { status: 404 }
          );
    }

    const jobs = await db.wpPPTXJobs.findMany({
      where: { siteId: payload.siteId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch jobs' } },
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

  // Check feature access
  const featureAccess = await checkFeatureAccess(payload.siteId, 'pptx_conversion');
  if (!featureAccess.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'FEATURE_NOT_AVAILABLE', message: featureAccess.message } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { fileName, fileUrl, callbackUrl } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'fileName and fileUrl are required' } },
        { status: 400 }
      );
    }

    const job = await db.wpPPTXJobs.create({
      data: {
        siteId: payload.siteId,
        fileName,
        fileUrl,
        callbackUrl,
        status: 'pending',
        progress: 0,
      },
    });

    // TODO: Trigger CloudConvert job here
    // const cloudConvertJob = await cloudConvert.createJob({...});

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'PPTX conversion job created successfully',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create job' } },
      { status: 500 }
    );
  }
}
