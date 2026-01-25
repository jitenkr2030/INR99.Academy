import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';

// Schema for batch video generation
const BatchVideoRequestSchema = z.object({
	jobs: z.array(z.object({
		type: z.enum(['course-intro', 'lesson-preview', 'course-thumbnail']),
		data: z.any(), // Will be validated by individual job processors
		outputFilename: z.string().optional(),
	})).min(1, 'At least one job is required'),
});

// Job processors for different video types
const jobProcessors = {
	'course-intro': async (data: any, index: number) => {
		const { CourseIntroRequestSchema } = await import('../course-intro/route');
		const validatedData = CourseIntroRequestSchema.parse(data);
		
		const timestamp = Date.now();
		const filename = `batch-course-intro-${index}-${timestamp}.mp4`;
		const outputPath = path.join(process.cwd(), 'public', 'videos', filename);

		return {
			compositionId: 'CourseIntro',
			inputProps: {
				...validatedData,
				branding: {
					primaryColor: validatedData.branding?.primaryColor || '#4f46e5',
					secondaryColor: validatedData.branding?.secondaryColor || '#7c3aed',
					logoUrl: validatedData.branding?.logoUrl,
				},
			},
			outputPath,
			videoUrl: `/videos/${filename}`,
		};
	},

	'lesson-preview': async (data: any, index: number) => {
		const { LessonPreviewRequestSchema } = await import('../lesson-preview/route');
		const validatedData = LessonPreviewRequestSchema.parse(data);
		
		const timestamp = Date.now();
		const filename = `batch-lesson-preview-${index}-${timestamp}.mp4`;
		const outputPath = path.join(process.cwd(), 'public', 'videos', filename);

		return {
			compositionId: 'LessonPreview',
			inputProps: {
				...validatedData,
				branding: {
					primaryColor: validatedData.branding?.primaryColor || '#4f46e5',
					secondaryColor: validatedData.branding?.secondaryColor || '#7c3aed',
				},
			},
			outputPath,
			videoUrl: `/videos/${filename}`,
		};
	},

	'course-thumbnail': async (data: any, index: number) => {
		const { CourseThumbnailRequestSchema } = await import('../course-thumbnail/route');
		const validatedData = CourseThumbnailRequestSchema.parse(data);
		
		const timestamp = Date.now();
		const sanitizedTitle = validatedData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
		const filename = `batch-course-thumbnail-${sanitizedTitle}-${index}-${timestamp}.mp4`;
		const outputPath = path.join(process.cwd(), 'public', 'videos', filename);

		return {
			compositionId: 'CourseThumbnail',
			inputProps: {
				...validatedData,
				branding: {
					primaryColor: validatedData.branding?.primaryColor || '#4f46e5',
					secondaryColor: validatedData.branding?.secondaryColor || '#7c3aed',
					logoUrl: validatedData.branding?.logoUrl,
				},
			},
			outputPath,
			videoUrl: `/videos/${filename}`,
		};
	},
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = BatchVideoRequestSchema.parse(body);

		console.log(`Starting batch video generation for ${validatedData.jobs.length} jobs...`);

		// Process all jobs and prepare them for generation
		const processedJobs = [];
		for (let i = 0; i < validatedData.jobs.length; i++) {
			const job = validatedData.jobs[i];
			
			try {
				const processedJob = await jobProcessors[job.type](job.data, i);
				processedJobs.push({
					...processedJob,
					originalIndex: i,
					type: job.type,
				});
			} catch (error) {
				console.error(`Failed to process job ${i} (${job.type}):`, error);
				throw new Error(`Validation failed for job ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}

		// Dynamic import to avoid webpack bundling issues
		const { renderBatchVideos } = await import('@/lib/remotion-service');

		// Generate all videos
		const results = await renderBatchVideos(
			processedJobs.map(job => ({
				compositionId: job.compositionId,
				inputProps: job.inputProps,
				outputPath: job.outputPath,
			})),
			(jobIndex, progress) => {
				const originalJob = processedJobs[jobIndex];
				console.log(`Job ${originalJob.originalIndex + 1}/${validatedData.jobs.length} (${originalJob.type}): ${progress.progress.toFixed(1)}%`);
			}
		);

		// Prepare response with metadata
		const videoResults = results.map((result, index) => {
			const job = processedJobs[index];
			
			return {
				jobIndex: job.originalIndex,
				type: job.type,
				videoUrl: result.videoUrl,
				fileSize: result.fileSize,
				createdAt: new Date().toISOString(),
				compositionId: job.compositionId,
			};
		});

		return NextResponse.json({
			success: true,
			message: `Successfully generated ${videoResults.length} videos`,
			results: videoResults,
			summary: {
				totalJobs: validatedData.jobs.length,
				successfulJobs: videoResults.length,
				failedJobs: 0,
				totalFileSize: videoResults.reduce((sum, result) => sum + result.fileSize, 0),
			},
		});
	} catch (error) {
		console.error('Batch video generation failed:', error);
		
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
				error: 'Batch video generation failed',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: 'Batch video generation endpoint',
		usage: {
			method: 'POST',
			endpoint: '/api/video-generation/batch',
			body: {
				jobs: [
					{
						type: 'course-intro' | 'lesson-preview' | 'course-thumbnail',
						data: {
							// Data specific to the video type
						},
						outputFilename: 'string (optional)',
					}
				],
			},
			examples: {
				'mixed batch': {
					jobs: [
						{
							type: 'course-intro',
							data: {
								title: 'Complete Web Development',
								instructorName: 'John Doe',
								instructorTitle: 'Senior Developer',
								duration: '40 hours',
								level: 'Beginner',
								category: 'Programming',
							},
						},
						{
							type: 'lesson-preview',
							data: {
								lessonTitle: 'Introduction to HTML',
								lessonNumber: 1,
								duration: '45 minutes',
								keyTopics: ['HTML basics', 'Tags', 'Structure'],
								courseTitle: 'Complete Web Development',
								instructorName: 'John Doe',
							},
						},
					],
				},
			},
		},
	});
}