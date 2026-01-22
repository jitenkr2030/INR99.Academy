/**
 * WordPress White-Label API
 * Endpoint: /api/wordpress/white-label
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

  recordAPICall(payload.siteId, '/wordpress/white-label');

  try {
    const whiteLabelConfig = await db.wpWhiteLabelConfigs.findFirst({
      where: { siteId: payload.siteId },
    });

    return NextResponse.json({
      success: true,
      data: whiteLabelConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch white-label config' } },
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
  const featureAccess = await checkFeatureAccess(payload.siteId, 'white_label');
  if (!featureAccess.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'FEATURE_NOT_AVAILABLE', message: featureAccess.message } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { customDomain, branding } = body;

    const whiteLabelConfig = await db.wpWhiteLabelConfigs.upsert({
      where: { siteId: payload.siteId },
      create: {
        siteId: payload.siteId,
        customDomain,
        branding: branding as object,
        isActive: true,
      },
      update: {
        customDomain,
        branding: branding as object,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: whiteLabelConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update white-label config' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    await db.wpWhiteLabelConfigs.deleteMany({
      where: { siteId: payload.siteId },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'White-label configuration removed' },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to remove white-label config' } },
      { status: 500 }
    );
  }
}
