/**
 * WordPress SSO API
 * Endpoint: /api/wordpress/auth/sso
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSSOUrl, verifySSOSession } from '@/lib/wordpress/auth';
import { checkAPILimit, recordAPICall } from '@/lib/wordpress/license-manager';

// GET: Verify SSO session
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_TOKEN', message: 'SSO token required' } },
      { status: 400 }
    );
  }

  try {
    const session = await verifySSOSession(token);

    // Check API limit
    const limitCheck = await checkAPILimit(session.siteId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
        { status: 429 }
      );
    }

    recordAPICall(session.siteId, '/wordpress/auth/sso');

    // Return session data (frontend should redirect user)
    return NextResponse.json({
      success: true,
      data: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        redirectUrl: session.redirectUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: String(error) } },
      { status: 400 }
    );
  }
}

// POST: Generate SSO URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, userId, email, name, redirectUrl } = body;

    if (!siteId || !userId || !email || !name) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'siteId, userId, email, and name are required' } },
        { status: 400 }
      );
    }

    // Check API limit
    const limitCheck = await checkAPILimit(siteId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
        { status: 429 }
      );
    }

    recordAPICall(siteId, '/wordpress/auth/sso');

    const ssoUrl = await generateSSOUrl(siteId, { userId, email, name, redirectUrl });

    return NextResponse.json({
      success: true,
      data: { ssoUrl },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SSO_ERROR', message: String(error) } },
      { status: 400 }
    );
  }
}
