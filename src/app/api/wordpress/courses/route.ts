/**
 * WordPress Course Data API
 * Endpoint: /api/wordpress/courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/wordpress/auth';
import { checkAPILimit, checkCourseLimit, recordAPICall } from '@/lib/wordpress/license-manager';
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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const courseId = searchParams.get('id');

  // Check API limit
  const limitCheck = await checkAPILimit(payload.siteId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'API_LIMIT_EXCEEDED', message: 'Daily API limit exceeded' } },
      { status: 429 }
    );
  }

  recordAPICall(payload.siteId, '/wordpress/courses');

  try {
    if (courseId) {
      // Get single course
      const course = await db.wpCourses.findFirst({
        where: { siteId: payload.siteId, id: courseId },
      });

      if (!course) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: course,
      });
    }

    // Get all courses for site
    const courses = await db.wpCourses.findMany({
      where: { siteId: payload.siteId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.wpCourses.count({
      where: { siteId: payload.siteId },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: courses,
        total,
        page,
        pageSize: limit,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch courses' } },
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

  // Check course limit
  const courseLimit = await checkCourseLimit(payload.siteId);
  if (!courseLimit.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'COURSE_LIMIT_EXCEEDED', message: `Course limit reached (${courseLimit.currentCount}/${courseLimit.limit})` } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { courses } = body;

    if (Array.isArray(courses)) {
      // Bulk create courses
      const created = await Promise.all(
        courses.map((course) =>
          db.wpCourses.create({
            data: {
              siteId: payload.siteId,
              externalId: course.externalId,
              title: course.title,
              description: course.description,
              thumbnail: course.thumbnail,
              price: course.price,
              currency: course.currency || 'INR',
              category: course.category,
              isPublished: course.isPublished ?? true,
            },
          })
        )
      );

      return NextResponse.json({
        success: true,
        data: { created: created.length },
      });
    }

    // Single course create
    const course = await db.wpCourses.create({
      data: {
        siteId: payload.siteId,
        externalId: body.externalId,
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        price: body.price,
        currency: body.currency || 'INR',
        category: body.category,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create course' } },
      { status: 500 }
    );
  }
}
