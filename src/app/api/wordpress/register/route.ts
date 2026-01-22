/**
 * WordPress Site Registration API
 * Endpoint: /api/wordpress/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteUrl: z.string().url('Please enter a valid URL').or(z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/, 'Please enter a valid domain')),
  planId: z.enum(['free', 'basic', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please login to register a WordPress site' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: validation.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { siteName, siteUrl, planId, billingCycle } = validation.data;

    // Check if URL already registered
    const existingSite = await db.wpSites.findFirst({
      where: {
        siteUrl,
        isActive: true,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { success: false, error: { code: 'SITE_EXISTS', message: 'This site URL is already registered' } },
        { status: 409 }
      );
    }

    // Calculate price based on plan and billing cycle
    const prices: Record<string, { monthly: number; yearly: number }> = {
      free: { monthly: 0, yearly: 0 },
      basic: { monthly: 499, yearly: 4999 },
      pro: { monthly: 1499, yearly: 14999 },
      enterprise: { monthly: 4999, yearly: 49999 },
    };

    const price = prices[planId][billingCycle];

    // Create site record with pending payment status
    const site = await db.wpSites.create({
      data: {
        siteName,
        siteUrl,
        userId: session.user.id,
        apiKey: '', // Will be generated after payment
        apiSecret: '', // Will be generated after payment
        isActive: false,
        licenseTier: planId,
        licenseExpiry: null,
        status: price === 0 ? 'active' : 'pending_payment',
      },
    });

    // If free plan, generate credentials immediately
    if (planId === 'free') {
      const crypto = await import('crypto');
      const apiKey = crypto.randomBytes(32).toString('hex');
      const apiSecret = crypto.randomBytes(64).toString('hex');
      
      await db.wpSites.update({
        where: { id: site.id },
        data: {
          apiKey,
          apiSecret,
          isActive: true,
          status: 'active',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          siteId: site.id,
          siteName,
          siteUrl,
          planId,
          licenseTier: planId,
          status: 'active',
          requiresPayment: false,
          apiKey,
          apiSecret,
        },
      });
    }

    // For paid plans, return site info for checkout
    return NextResponse.json({
      success: true,
      data: {
        siteId: site.id,
        siteName,
        siteUrl,
        planId,
        licenseTier: planId,
        billingCycle,
        price,
        currency: 'INR',
        requiresPayment: true,
        status: 'pending_payment',
      },
    });
  } catch (error) {
    console.error('WordPress registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to register site' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
        { status: 401 }
      );
    }

    // Get all sites for this user
    const sites = await db.wpSites.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            courses: true,
            liveSessions: true,
            users: true,
          },
        },
      },
    });

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
