/**
 * WordPress Token Management API
 * Endpoint: /api/wordpress/auth/token
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken, refreshAccessToken, revokeAccessToken } from '@/lib/wordpress/auth';
import { checkAPILimit, recordAPICall } from '@/lib/wordpress/license-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, accessToken, refreshToken } = body;

    if (action === 'refresh' && refreshToken) {
      // Refresh access token
      const newToken = await refreshAccessToken(refreshToken);
      return NextResponse.json({
        success: true,
        data: newToken,
      });
    }

    if (action === 'revoke' && accessToken) {
      await revokeAccessToken(accessToken);
      return NextResponse.json({
        success: true,
        data: { message: 'Token revoked successfully' },
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'TOKEN_ERROR', message: String(error) } },
      { status: 401 }
    );
  }
}

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

  return NextResponse.json({
    success: true,
    data: {
      siteId: payload.siteId,
      type: payload.type,
      permissions: payload.permissions,
    },
  });
}
