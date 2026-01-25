import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';

// Schema for course intro video generation
const CourseIntroRequestSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	instructorName: z.string().min(1, 'Instructor name is required'),
	instructorTitle: z.string().min(1, 'Instructor title is required'),
	duration: z.string().min(1, 'Duration is required'),
	level: z.string().min(1, 'Level is required'),
	category: z.string().min(1, 'Category is required'),
	thumbnailUrl: z.string().optional(),
	branding: z.object({
		primaryColor: z.string().optional(),
		secondaryColor: z.string().optional(),
		logoUrl: z.string().optional(),
	}).optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = CourseIntroRequestSchema.parse(body);

		// Generate unique filename
		const timestamp = Date.now();
		const filename = `course-intro-${timestamp}.mp4`;
		const outputPath = path.join(process.cwd(), 'public', 'videos', filename);

		// Prepare input props for Remotion
		const inputProps = {
			...validatedData,
			branding: {
				primaryColor: validatedData.branding?.primaryColor || '#4f46e5',
				secondaryColor: validatedData.branding?.secondaryColor || '#7c3aed',
				logoUrl: validatedData.branding?.logoUrl,
			},
		};

		console.log('Starting course intro video generation...');

		// Dynamic import to avoid webpack bundling issues
		const { renderVideo } = await import('@/lib/remotion-service');

		// Generate the video
		const result = await renderVideo(
			{
				compositionId: 'CourseIntro',
				inputProps,
				outputPath,
			},
			(progress) => {
				console.log(`Course intro progress: ${progress.progress.toFixed(1)}%`);
			}
		);

		// Return the video URL
		const videoUrl = result.videoUrl;

		return NextResponse.json({
			success: true,
			videoUrl,
			message: 'Course intro video generated successfully',
			metadata: {
				compositionId: 'CourseIntro',
				fileSize: result.fileSize,
				createdAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('Course intro video generation failed:', error);
		
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
		message: 'Course intro video generation endpoint',
		usage: {
			method: 'POST',
			endpoint: '/api/video-generation/course-intro',
			body: {
				title: 'string (required)',
				instructorName: 'string (required)',
				instructorTitle: 'string (required)',
				duration: 'string (required)',
				level: 'string (required)',
				category: 'string (required)',
				thumbnailUrl: 'string (optional)',
				branding: {
					primaryColor: 'string (optional)',
					secondaryColor: 'string (optional)',
					logoUrl: 'string (optional)',
				},
			},
		},
	});
}