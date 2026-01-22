/**
 * WordPress Site Connection API
 * Endpoint: /api/wordpress/auth/connect
 */

import { NextRequest, NextResponse } from 'next/server';
import { createWordPressSite, validateWordPressCredentials } from '@/lib/wordpress/api-client';
import { generateAccessToken } from '@/lib/wordpress/auth';
import { validateLicense, checkAPILimit, recordAPICall } from '@/lib/wordpress/license-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, siteUrl, apiKey, apiSecret } = body;

    // Validate required fields
    if (!siteName || !siteUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'siteName and siteUrl are required' } },
        { status: 400 }
      );
    }

    // If credentials provided, validate them
    if (apiKey && apiSecret) {
      const validation = await validateWordPressCredentials(apiKey, apiSecret);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid API credentials' } },
          { status: 401 }
        );
      }

      // Check API limit
      const limitCheck = await checkAPILimit(validation.siteId!);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
          { status: 429 }
        );
      }

      recordAPICall(validation.siteId!, '/wordpress/auth/connect');

      // Generate access token
      const token = await generateAccessToken(validation.siteId!);

      return NextResponse.json({
        success: true,
        data: {
          siteId: validation.siteId,
          ...token,
        },
      });
    }

    // Create new site connection
    const site = await createWordPressSite({ siteName, siteUrl });

    // Generate access token
    const token = await generateAccessToken(site.id, ['courses', 'live-class', 'pptx', 'license', 'webhooks', 'white-label', 'progress']);

    // Validate license
    const license = await validateLicense(site.id);

    return NextResponse.json({
      success: true,
      data: {
        siteId: site.id,
        apiKey: site.apiKey,
        apiSecret: site.apiSecret,
        license: {
          tier: license.tier,
          isValid: license.isValid,
          features: license.features,
        },
        ...token,
      },
    });
  } catch (error) {
    console.error('WordPress connect error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return connection status or info
  return NextResponse.json({
    success: true,
    data: {
      message: 'Use POST to connect a WordPress site',
      requiredFields: ['siteName', 'siteUrl'],
      optionalFields: ['apiKey', 'apiSecret'],
    },
  });
}
