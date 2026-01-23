import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {webpackOverride} from '@remotion/webpack-override';
import path from 'path';
import fs from 'fs';

export interface VideoGenerationOptions {
	compositionId: string;
	inputProps: any;
	outputPath: string;
	// Add other options as needed
}

export interface VideoRenderProgress {
	progress: number;
	framesRendered: number;
	totalFrames: number;
}

export class VideoGenerator {
	private static instance: VideoGenerator;
	private remotionBundle: string | null = null;

	private constructor() {}

	public static getInstance(): VideoGenerator {
		if (!VideoGenerator.instance) {
			VideoGenerator.instance = new VideoGenerator();
		}
		return VideoGenerator.instance;
	}

	/**
	 * Initialize the Remotion bundle
	 */
	public async initializeBundle(): Promise<void> {
		if (this.remotionBundle) {
			return; // Already bundled
		}

		try {
			const bundled = await bundle({
				entryPoint: path.resolve('./src/remotion/root.tsx'),
				webpackOverride: (config) => {
					return webpackOverride(config);
				},
				onProgress: (progress) => {
					console.log(`Bundling progress: ${progress}%`);
				},
			});

			this.remotionBundle = bundled;
			console.log('Remotion bundle created successfully');
		} catch (error) {
			console.error('Failed to create Remotion bundle:', error);
			throw error;
		}
	}

	/**
	 * Generate a video based on composition and input props
	 */
	public async generateVideo(
		options: VideoGenerationOptions,
		onProgress?: (progress: VideoRenderProgress) => void
	): Promise<string> {
		await this.initializeBundle();

		if (!this.remotionBundle) {
			throw new Error('Remotion bundle not initialized');
		}

		try {
			// Select composition to get metadata
			const composition = await selectComposition({
				bundle: this.remotionBundle,
				id: options.compositionId,
				inputProps: options.inputProps,
			});

			// Ensure output directory exists
			const outputDir = path.dirname(options.outputPath);
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			console.log(`Starting video render for ${options.compositionId}`);
			console.log(`Duration: ${composition.durationInFrames} frames`);
			console.log(`Output: ${options.outputPath}`);

			// Render the video
			await renderMedia({
				bundle: this.remotionBundle,
				composition: {
					id: options.compositionId,
					durationInFrames: composition.durationInFrames,
					fps: composition.fps,
					height: composition.height,
					width: composition.width,
				},
				inputProps: options.inputProps,
				outputLocation: options.outputPath,
				codec: 'h264',
				onProgress: ({progress}) => {
					const renderProgress: VideoRenderProgress = {
						progress: progress * 100,
						framesRendered: Math.floor(composition.durationInFrames * progress),
						totalFrames: composition.durationInFrames,
					};

					if (onProgress) {
						onProgress(renderProgress);
					}

					console.log(`Render progress: ${renderProgress.progress.toFixed(1)}%`);
				},
				parallelism: null, // Use default parallelism
			});

			console.log(`Video rendered successfully: ${options.outputPath}`);
			return options.outputPath;
		} catch (error) {
			console.error('Video generation failed:', error);
			throw error;
		}
	}

	/**
	 * Generate multiple videos in batch
	 */
	public async generateBatchVideos(
		jobs: VideoGenerationOptions[],
		onProgress?: (jobIndex: number, progress: VideoRenderProgress) => void
	): Promise<string[]> {
		const results: string[] = [];

		for (let i = 0; i < jobs.length; i++) {
			const job = jobs[i];
			console.log(`Processing job ${i + 1}/${jobs.length}: ${job.compositionId}`);

			try {
				const outputPath = await this.generateVideo(
					job,
					(progress) => {
						if (onProgress) {
							onProgress(i, progress);
						}
					}
				);
				results.push(outputPath);
			} catch (error) {
				console.error(`Failed to process job ${i + 1}:`, error);
				throw error;
			}
		}

		return results;
	}

	/**
	 * Get composition metadata without rendering
	 */
	public async getCompositionMetadata(compositionId: string, inputProps: any) {
		await this.initializeBundle();

		if (!this.remotionBundle) {
			throw new Error('Remotion bundle not initialized');
		}

		try {
			const composition = await selectComposition({
				bundle: this.remotionBundle,
				id: compositionId,
				inputProps,
			});

			return {
				id: composition.id,
				durationInFrames: composition.durationInFrames,
				fps: composition.fps,
				width: composition.width,
				height: composition.height,
				durationInSeconds: composition.durationInFrames / composition.fps,
			};
		} catch (error) {
			console.error('Failed to get composition metadata:', error);
			throw error;
		}
	}
}

// Export singleton instance
export const videoGenerator = VideoGenerator.getInstance();