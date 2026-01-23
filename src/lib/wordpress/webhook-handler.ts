/**
 * WordPress Webhook Handler
 * Handles incoming webhooks from WordPress sites
 */

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifySignature } from './auth';

export interface WordPressWebhook {
  event: string;
  siteId: string;
  data: any;
  timestamp: number;
  signature: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Verify webhook signature
 */
export async function verifyWebhookSignature(webhook: WordPressWebhook): Promise<boolean> {
  try {
    const site = await db.wpSites.findUnique({
      where: { id: webhook.siteId },
    });

    if (!site) {
      return false;
    }

    const dataToVerify = {
      event: webhook.event,
      siteId: webhook.siteId,
      data: webhook.data,
      timestamp: webhook.timestamp,
    };

    return verifySignature(dataToVerify, webhook.signature, site.apiSecret);
  } catch (error) {
    console.error('Failed to verify webhook signature:', error);
    return false;
  }
}

/**
 * Handle course creation webhook
 */
export async function handleCourseCreated(webhook: WordPressWebhook): Promise<WebhookResponse> {
  try {
    const { courseData } = webhook.data;

    const course = await db.course.create({
      data: {
        title: courseData.title,
        description: courseData.description || '',
        price: courseData.price || 0,
        instructorId: courseData.instructorId,
        wpSiteId: webhook.siteId,
        wpCourseId: courseData.id,
        status: 'DRAFT',
      },
    });

    return {
      success: true,
      message: 'Course created successfully',
      data: { courseId: course.id },
    };
  } catch (error) {
    console.error('Failed to handle course creation:', error);
    return {
      success: false,
      message: 'Failed to create course',
    };
  }
}

/**
 * Handle course update webhook
 */
export async function handleCourseUpdated(webhook: WordPressWebhook): Promise<WebhookResponse> {
  try {
    const { courseId, courseData } = webhook.data;

    const course = await db.course.update({
      where: {
        wpCourseId_wpSiteId: {
          wpCourseId: courseId,
          wpSiteId: webhook.siteId,
        },
      },
      data: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        status: courseData.status,
      },
    });

    return {
      success: true,
      message: 'Course updated successfully',
      data: { courseId: course.id },
    };
  } catch (error) {
    console.error('Failed to handle course update:', error);
    return {
      success: false,
      message: 'Failed to update course',
    };
  }
}

/**
 * Handle user enrollment webhook
 */
export async function handleUserEnrolled(webhook: WordPressWebhook): Promise<WebhookResponse> {
  try {
    const { userId, courseId } = webhook.data;

    // Find or create the user
    let user = await db.user.findFirst({
      where: {
        wpUserId: userId,
        wpSites: {
          some: {
            id: webhook.siteId,
          },
        },
      },
    });

    if (!user) {
      // Create a basic user record
      user = await db.user.create({
        data: {
          email: `user-${userId}@wordpress-${webhook.siteId}.local`,
          name: `WordPress User ${userId}`,
          wpUserId: userId,
          wpSites: {
            connect: {
              id: webhook.siteId,
            },
          },
        },
      });
    }

    // Find the course
    const course = await db.course.findFirst({
      where: {
        wpCourseId: courseId,
        wpSiteId: webhook.siteId,
      },
    });

    if (!course) {
      return {
        success: false,
        message: 'Course not found',
      };
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: 'ACTIVE',
        enrolledAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'User enrolled successfully',
      data: { enrollmentId: enrollment.id },
    };
  } catch (error) {
    console.error('Failed to handle user enrollment:', error);
    return {
      success: false,
      message: 'Failed to enroll user',
    };
  }
}

/**
 * Handle live class creation webhook
 */
export async function handleLiveClassCreated(webhook: WordPressWebhook): Promise<WebhookResponse> {
  try {
    const { classData } = webhook.data;

    const liveClass = await db.liveSession.create({
      data: {
        title: classData.title,
        description: classData.description || '',
        instructorId: classData.instructorId,
        wpSiteId: webhook.siteId,
        wpSessionId: classData.id,
        scheduledAt: new Date(classData.scheduledAt),
        duration: classData.duration || 60,
        status: 'SCHEDULED',
      },
    });

    return {
      success: true,
      message: 'Live class created successfully',
      data: { sessionId: liveClass.id },
    };
  } catch (error) {
    console.error('Failed to handle live class creation:', error);
    return {
      success: false,
      message: 'Failed to create live class',
    };
  }
}

/**
 * Main webhook handler
 */
export async function handleWebhook(request: NextRequest): Promise<WebhookResponse> {
  try {
    const body = await request.json();
    const webhook: WordPressWebhook = body;

    // Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(webhook);
    if (!isValidSignature) {
      return {
        success: false,
        message: 'Invalid webhook signature',
      };
    }

    // Check timestamp (should be within 5 minutes)
    const now = Date.now();
    const timestampMs = webhook.timestamp * 1000;
    if (now - timestampMs > 5 * 60 * 1000) {
      return {
        success: false,
        message: 'Webhook timestamp too old',
      };
    }

    // Route to appropriate handler based on event type
    switch (webhook.event) {
      case 'course.created':
        return await handleCourseCreated(webhook);
      
      case 'course.updated':
        return await handleCourseUpdated(webhook);
      
      case 'user.enrolled':
        return await handleUserEnrolled(webhook);
      
      case 'live_class.created':
        return await handleLiveClassCreated(webhook);
      
      default:
        return {
          success: false,
          message: `Unknown webhook event: ${webhook.event}`,
        };
    }
  } catch (error) {
    console.error('Webhook handling failed:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}

/**
 * Get webhook logs for a site
 */
export async function getWebhookLogs(siteId: string, limit: number = 50) {
  try {
    // This would typically query a webhook logs table
    // For now, return empty array as placeholder
    return [];
  } catch (error) {
    console.error('Failed to get webhook logs:', error);
    return [];
  }
}

/**
 * Retry failed webhook
 */
export async function retryWebhook(webhookId: string): Promise<WebhookResponse> {
  try {
    // This would typically find the failed webhook and retry it
    // For now, return success as placeholder
    return {
      success: true,
      message: 'Webhook retry initiated',
    };
  } catch (error) {
    console.error('Failed to retry webhook:', error);
    return {
      success: false,
      message: 'Failed to retry webhook',
    };
  }
}