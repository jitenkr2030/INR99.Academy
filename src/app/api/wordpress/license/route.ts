/**
 * WordPress License Validation API
 * Endpoint: /api/wordpress/license
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/wordpress/auth';
import {
  validateLicense,
  checkFeatureAccess,
  checkAPILimit,
  checkCourseLimit,
  checkUserLimit,
  recordAPICall,
  updateLicenseTier,
} from '@/lib/wordpress/license-manager';

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

  recordAPICall(payload.siteId, '/wordpress/license');

  // Validate license
  const license = await validateLicense(payload.siteId);

  // Get usage stats
  const courseLimit = await checkCourseLimit(payload.siteId);
  const userLimit = await checkUserLimit(payload.siteId);

  return NextResponse.json({
    success: true,
    data: {
      isValid: license.isValid,
      tier: license.tier,
      features: license.features,
      expiryDate: license.expiryDate,
      message: license.message,
      usage: {
        courses: courseLimit,
        users: userLimit,
        api: limitCheck,
      },
    },
  });
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
    const { action, feature, tier } = body;

    if (action === 'check_feature' && feature) {
      const featureAccess = await checkFeatureAccess(payload.siteId, feature);

      return NextResponse.json({
        success: true,
        data: featureAccess,
      });
    }

    if (action === 'check_limits') {
      const [courseLimit, userLimit, apiLimit] = await Promise.all([
        checkCourseLimit(payload.siteId),
        checkUserLimit(payload.siteId),
        checkAPILimit(payload.siteId),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          courses: courseLimit,
          users: userLimit,
          api: apiLimit,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to check license' } },
      { status: 500 }
    );
  }
}

// Admin endpoint to update license tier
export async function PATCH(request: NextRequest) {
  // This should be protected by admin authentication
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

  // Check if admin (should be checked properly in production)
  // For now, just proceed

  try {
    const body = await request.json();
    const { siteId, tier, expiryDate } = body;

    if (!siteId || !tier) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'siteId and tier are required' } },
        { status: 400 }
      );
    }

    await updateLicenseTier(siteId, tier, expiryDate ? new Date(expiryDate) : undefined);

    return NextResponse.json({
      success: true,
      data: { message: 'License tier updated successfully' },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update license' } },
      { status: 500 }
    );
  }
}
