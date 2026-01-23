import { NextRequest, NextResponse } from 'next/server';
import { videoGenerator } from '@/remotion/utils/videoGenerator';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Schema for lesson preview video generation
const LessonPreviewRequestSchema = z.object({
	lessonTitle: z.string().min(1, 'Lesson title is required'),
	lessonNumber: z.number().min(1, 'Lesson number is required'),
	duration: z.string().min(1, 'Duration is required'),
	keyTopics: z.array(z.string()).min(1, 'At least one key topic is required'),
	courseTitle: z.string().min(1, 'Course title is required'),
	instructorName: z.string().min(1, 'Instructor name is required'),
	thumbnailUrl: z.string().optional(),
	branding: z.object({
		primaryColor: z.string().optional(),
		secondaryColor: z.string().optional(),
	}).optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = LessonPreviewRequestSchema.parse(body);

		// Generate unique filename
		const timestamp = Date.now();
		const filename = `lesson-preview-${validatedData.lessonNumber}-${timestamp}.mp4`;
		const outputPath = path.join(process.cwd(), 'public', 'videos', filename);

		// Prepare input props for Remotion
		const inputProps = {
			...validatedData,
			branding: {
				primaryColor: validatedData.branding?.primaryColor || '#4f46e5',
				secondaryColor: validatedData.branding?.secondaryColor || '#7c3aed',
			},
		};

		console.log(`Starting lesson preview video generation for lesson ${validatedData.lessonNumber}...`);

		// Generate the video
		const resultPath = await videoGenerator.generateVideo(
			{
				compositionId: 'LessonPreview',
				inputProps,
				outputPath,
			},
			(progress) => {
				console.log(`Lesson preview progress: ${progress.progress.toFixed(1)}%`);
			}
		);

		// Return the video URL
		const videoUrl = `/videos/${filename}`;

		return NextResponse.json({
			success: true,
			videoUrl,
			message: 'Lesson preview video generated successfully',
			metadata: {
				compositionId: 'LessonPreview',
				lessonNumber: validatedData.lessonNumber,
				fileSize: fs.statSync(resultPath).size,
				createdAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('Lesson preview video generation failed:', error);
		
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: 'Validation error',
					details: error.errors,
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: 'Video generation failed',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: 'Lesson preview video generation endpoint',
		usage: {
			method: 'POST',
			endpoint: '/api/video-generation/lesson-preview',
			body: {
				lessonTitle: 'string (required)',
				lessonNumber: 'number (required)',
				duration: 'string (required)',
				keyTopics: 'array of strings (required)',
				courseTitle: 'string (required)',
				instructorName: 'string (required)',
				thumbnailUrl: 'string (optional)',
				branding: {
					primaryColor: 'string (optional)',
					secondaryColor: 'string (optional)',
				},
			},
		},
	});
}