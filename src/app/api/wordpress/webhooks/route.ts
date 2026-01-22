/**
 * WordPress Webhooks API
 * Endpoint: /api/wordpress/webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/wordpress/auth';
import { checkAPILimit, recordAPICall } from '@/lib/wordpress/license-manager';
import { processWebhookEvent, verifyWebhookSignature, getWebhookLogs } from '@/lib/wordpress/webhook-handler';
import { db } from '@/lib/db';

// POST: Receive webhook from WordPress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-wp-signature');
    const siteId = body.siteId || request.headers.get('x-wp-site-id');

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_SITE_ID', message: 'Site ID required' } },
        { status: 400 }
      );
    }

    // Get site to verify webhook secret
    const site = await db.wpSites.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_SITE', message: 'Invalid site' } },
        { status: 400 }
      );
    }

    // Verify signature if provided
    if (signature) {
      // Get webhook config for this site
      const webhookConfig = await db.wpWebhookConfigs.findFirst({
        where: { siteId, isActive: true },
      });

      if (webhookConfig) {
        const payloadString = JSON.stringify(body);
        const isValid = verifyWebhookSignature(payloadString, signature, webhookConfig.secret);

        if (!isValid) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } },
            { status: 401 }
          );
        }
      }
    }

    // Process webhook
    const result = await processWebhookEvent(siteId, {
      eventType: body.eventType,
      data: body.data || {},
      timestamp: body.timestamp || new Date().toISOString(),
    });

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'WEBHOOK_ERROR', message: String(error) } },
      { status: 500 }
    );
  }
}

// GET: Get webhook configuration or logs
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

  recordAPICall(payload.siteId, '/wordpress/webhooks');

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'config';
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status');

    if (action === 'logs') {
      const logs = await getWebhookLogs(payload.siteId, {
        eventType: eventType || undefined,
        status: status || undefined,
        limit: 50,
      });

      return NextResponse.json({
        success: true,
        data: logs,
      });
    }

    // Get webhook configurations
    const webhooks = await db.wpWebhookConfigs.findMany({
      where: { siteId: payload.siteId },
    });

    return NextResponse.json({
      success: true,
      data: webhooks,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch webhooks' } },
      { status: 500 }
    );
  }
}

// PUT: Create or update webhook configuration
export async function PUT(request: NextRequest) {
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
    const { webhookId, webhookUrl, events, isActive } = body;

    if (webhookId) {
      // Update existing webhook
      const webhook = await db.wpWebhookConfigs.update({
        where: { id: webhookId, siteId: payload.siteId },
        data: {
          webhookUrl,
          events,
          isActive,
        },
      });

      return NextResponse.json({
        success: true,
        data: webhook,
      });
    }

    // Create new webhook
    const webhook = await db.wpWebhookConfigs.create({
      data: {
        siteId: payload.siteId,
        webhookUrl,
        events: events || [],
        secret: crypto.randomUUID(),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: webhook.id,
        webhookUrl: webhook.webhookUrl,
        secret: webhook.secret,
        events: webhook.events,
        isActive: webhook.isActive,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to manage webhooks' } },
      { status: 500 }
    );
  }
}

// DELETE: Remove webhook configuration
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
    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('id');

    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_ID', message: 'Webhook ID required' } },
        { status: 400 }
      );
    }

    await db.wpWebhookConfigs.delete({
      where: { id: webhookId, siteId: payload.siteId },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Webhook deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete webhook' } },
      { status: 500 }
    );
  }
}
