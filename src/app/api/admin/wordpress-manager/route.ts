/**
 * WordPress Manager Admin API
 * Endpoint: /api/admin/wordpress-manager
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllWordPressSites, createWordPressSite, deactivateWordPressSite, revokeWordPressSiteCredentials } from '@/lib/wordpress/api-client';
import { validateLicense, updateLicenseTier, getAllLicenseTiers } from '@/lib/wordpress/license-manager';
import { db } from '@/lib/db';

// GET: List all WordPress sites or get specific site
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const action = searchParams.get('action');

    if (action === 'tiers') {
      const tiers = getAllLicenseTiers();
      return NextResponse.json({
        success: true,
        data: tiers,
      });
    }

    if (siteId) {
      const site = await db.wpSites.findUnique({
        where: { id: siteId },
        include: {
          _count: {
            select: {
              courses: true,
              liveSessions: true,
              pptxJobs: true,
              users: true,
            },
          },
        },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Site not found' } },
          { status: 404 }
        );
      }

      const license = await validateLicense(siteId);

      return NextResponse.json({
        success: true,
        data: {
          ...site,
          license,
        },
      });
    }

    const sites = await getAllWordPressSites();

    return NextResponse.json({
      success: true,
      data: sites,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch sites' } },
      { status: 500 }
    );
  }
}

// POST: Create new WordPress site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, siteUrl, licenseTier } = body;

    if (!siteName || !siteUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'siteName and siteUrl are required' } },
        { status: 400 }
      );
    }

    const site = await createWordPressSite({ siteName, siteUrl, licenseTier });

    return NextResponse.json({
      success: true,
      data: {
        id: site.id,
        siteName: site.siteName,
        siteUrl: site.siteUrl,
        apiKey: site.apiKey,
        apiSecret: site.apiSecret,
        licenseTier: site.licenseTier,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create site' } },
      { status: 500 }
    );
  }
}

// PATCH: Update site settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, action, licenseTier } = body;

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_SITE_ID', message: 'siteId is required' } },
        { status: 400 }
      );
    }

    if (action === 'revoke_credentials') {
      const site = await revokeWordPressSiteCredentials(siteId);
      return NextResponse.json({
        success: true,
        data: {
          apiKey: site.apiKey,
          apiSecret: site.apiSecret,
        },
      });
    }

    if (action === 'deactivate') {
      const site = await deactivateWordPressSite(siteId);
      return NextResponse.json({
        success: true,
        data: { isActive: site.isActive },
      });
    }

    if (action === 'update_tier' && licenseTier) {
      await updateLicenseTier(siteId, licenseTier);
      return NextResponse.json({
        success: true,
        data: { message: 'License tier updated' },
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update site' } },
      { status: 500 }
    );
  }
}

// DELETE: Remove WordPress site
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_SITE_ID', message: 'siteId is required' } },
        { status: 400 }
      );
    }

    // Deactivate instead of delete to preserve data
    await deactivateWordPressSite(siteId);

    return NextResponse.json({
      success: true,
      data: { message: 'WordPress site deactivated' },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to remove site' } },
      { status: 500 }
    );
  }
}
