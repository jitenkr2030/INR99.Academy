import { NextRequest, NextResponse } from 'next/server';
import { videoGenerator } from '@/remotion/utils/videoGenerator';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Schema for course thumbnail video generation
const CourseThumbnailRequestSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	instructorName: z.string().min(1, 'Instructor name is required'),
	level: z.string().min(1, 'Level is required'),
	duration: z.string().min(1, 'Duration is required'),
	studentCount: z.number().optional(),
	rating: z.number().min(0).max(5).optional(),
	category: z.string().min(1, 'Category is required'),
	branding: z.object({
		primaryColor: z.string().optional(),
		secondaryColor: z.string().optional(),
		logoUrl: z.string().optional(),
	}).optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = CourseThumbnailRequestSchema.parse(body);

		// Generate unique filename
		const timestamp = Date.now();
		const sanitizedTitle = validatedData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
		const filename = `course-thumbnail-${sanitizedTitle}-${timestamp}.mp4`;
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

		console.log('Starting course thumbnail video generation...');

		// Generate the video
		const resultPath = await videoGenerator.generateVideo(
			{
				compositionId: 'CourseThumbnail',
				inputProps,
				outputPath,
			},
			(progress) => {
				console.log(`Course thumbnail progress: ${progress.progress.toFixed(1)}%`);
			}
		);

		// Return the video URL
		const videoUrl = `/videos/${filename}`;

		return NextResponse.json({
			success: true,
			videoUrl,
			message: 'Course thumbnail video generated successfully',
			metadata: {
				compositionId: 'CourseThumbnail',
				fileSize: fs.statSync(resultPath).size,
				createdAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('Course thumbnail video generation failed:', error);
		
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
		message: 'Course thumbnail video generation endpoint',
		usage: {
			method: 'POST',
			endpoint: '/api/video-generation/course-thumbnail',
			body: {
				title: 'string (required)',
				instructorName: 'string (required)',
				level: 'string (required)',
				duration: 'string (required)',
				studentCount: 'number (optional)',
				rating: 'number (0-5, optional)',
				category: 'string (required)',
				branding: {
					primaryColor: 'string (optional)',
					secondaryColor: 'string (optional)',
					logoUrl: 'string (optional)',
				},
			},
		},
	});
}