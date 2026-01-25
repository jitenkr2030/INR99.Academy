/**
 * Video Generator - Production-grade video rendering using Remotion
 * This implementation uses actual @remotion/bundler and @remotion/renderer
 */

import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, Codec } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Type definitions matching the API requirements
export interface VideoGenerationOptions {
  compositionId: string;
  inputProps: Record<string, unknown>;
  outputPath: string;
}

export interface VideoRenderProgress {
  progress: number;
  framesRendered: number;
  totalFrames: number;
}

// Video quality presets
const VIDEO_QUALITY_PRESETS = {
  draft: { width: 640, height: 360, fps: 15 },
  standard: { width: 1280, height: 720, fps: 24 },
  hd: { width: 1920, height: 1080, fps: 30 },
  uhd: { width: 3840, height: 2160, fps: 30 },
};

// Default quality preset
const DEFAULT_QUALITY = 'hd';

// Cache for the bundled entry point
let cachedBundlePath: string | null = null;
let bundleCacheTime: number = 0;
const BUNDLE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

/**
 * Get the Remotion entry point path
 */
function getEntryPointPath(): string {
  return path.resolve(__dirname, '../index.ts');
}

/**
 * Get the output directory for videos
 */
function getOutputDir(): string {
  const outputDir = process.env.VIDEO_OUTPUT_DIR || path.join(process.cwd(), 'public', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

/**
 * Get or create the bundled Remotion entry point
 * Uses caching to avoid re-bundling on every render
 */
async function getOrCreateBundle(): Promise<string> {
  const now = Date.now();
  const entryPoint = getEntryPointPath();

  // Check if cache is valid
  if (cachedBundlePath && (now - bundleCacheTime) < BUNDLE_CACHE_DURATION) {
    console.log('[VideoGenerator] Using cached bundle');
    return cachedBundlePath;
  }

  console.log('[VideoGenerator] Creating new bundle...');

  try {
    // Create bundle using @remotion/bundler
    const bundlePath = await bundle({
      entryPoint,
      // Override webpack config to handle Next.js aliases
      webpackOverride: (config) => {
        // Ensure proper module resolution
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};
        
        // Add any necessary webpack overrides here
        return config;
      },
      // Don't inline the bundle - keep it as a file for better performance
      inline: false,
    });

    cachedBundlePath = bundlePath;
    bundleCacheTime = now;
    
    console.log('[VideoGenerator] Bundle created successfully:', bundlePath);
    return bundlePath;
  } catch (error) {
    console.error('[VideoGenerator] Failed to create bundle:', error);
    throw new Error(`Failed to bundle Remotion project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the list of available compositions from the bundle
 */
async function getAvailableCompositions(
  serveUrl: string,
  inputProps: Record<string, unknown>
): Promise<Array<{ id: string; durationInFrames: number; fps: number; width: number; height: number }>> {
  try {
    const compositions = await getCompositions({
      serveUrl,
      inputProps,
    });

    return compositions.map((comp) => ({
      id: comp.id,
      durationInFrames: comp.durationInFrames,
      fps: comp.fps,
      width: comp.width,
      height: comp.height,
    }));
  } catch (error) {
    console.error('[VideoGenerator] Failed to get compositions:', error);
    throw new Error(`Failed to get compositions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Find a composition by ID
 */
async function findComposition(
  serveUrl: string,
  compositionId: string,
  inputProps: Record<string, unknown>
) {
  const compositions = await getAvailableCompositions(serveUrl, inputProps);
  const composition = compositions.find((c) => c.id === compositionId);

  if (!composition) {
    const availableIds = compositions.map((c) => c.id).join(', ');
    throw new Error(
      `Composition '${compositionId}' not found. Available compositions: ${availableIds || 'none'}`
    );
  }

  return composition;
}

export class VideoGenerator {
  private static instance: VideoGenerator;
  private quality: string = DEFAULT_QUALITY;

  private constructor() {
    // Load quality setting from environment
    this.quality = process.env.VIDEO_QUALITY || DEFAULT_QUALITY;
  }

  public static getInstance(): VideoGenerator {
    if (!VideoGenerator.instance) {
      VideoGenerator.instance = new VideoGenerator();
    }
    return VideoGenerator.instance;
  }

  /**
   * Initialize the video generation system
   */
  public async initializeBundle(): Promise<void> {
    try {
      await getOrCreateBundle();
      console.log('[VideoGenerator] Bundle initialized successfully');
    } catch (error) {
      console.error('[VideoGenerator] Failed to initialize bundle:', error);
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
    const { compositionId, inputProps, outputPath } = options;

    console.log(`[VideoGenerator] Starting video generation for: ${compositionId}`);
    console.log(`[VideoGenerator] Input props:`, JSON.stringify(inputProps, null, 2));

    try {
      // Step 1: Get or create the bundle
      const bundlePath = await getOrCreateBundle();
      console.log('[VideoGenerator] Bundle ready');

      // Step 2: Find the composition
      const composition = await findComposition(bundlePath, compositionId, inputProps);
      console.log(`[VideoGenerator] Found composition: ${composition.id} (${composition.width}x${composition.height} @ ${composition.fps}fps)`);

      // Step 3: Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Step 4: Render the video
      console.log('[VideoGenerator] Starting video render...');
      
      await renderMedia({
        composition,
        serveUrl: bundlePath,
        codec: 'h264' as Codec,
        outputLocation: outputPath,
        inputProps,
        // Progress callback
        onProgress: ({ progress, framesRendered, totalFrames }) => {
          if (onProgress) {
            onProgress({
              progress: progress * 100,
              framesRendered,
              totalFrames,
            });
          }
          // Log progress at significant milestones
          const progressPercent = Math.round(progress * 100);
          if (progressPercent % 10 === 0) {
            console.log(`[VideoGenerator] Rendering: ${progressPercent}% (${framesRendered}/${totalFrames} frames)`);
          }
        },
      });

      // Step 5: Verify the output file
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`[VideoGenerator] Video generated successfully: ${outputPath}`);
        console.log(`[VideoGenerator] File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
      } else {
        throw new Error('Video file was not created');
      }

      return outputPath;
    } catch (error) {
      console.error(`[VideoGenerator] Error generating video for ${compositionId}:`, error);
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
      console.log(`[VideoGenerator] Processing job ${i + 1}/${jobs.length}: ${job.compositionId}`);

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
        console.error(`[VideoGenerator] Failed to process job ${i + 1}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Get composition metadata without rendering
   */
  public async getCompositionMetadata(compositionId: string, inputProps: Record<string, unknown>) {
    try {
      const bundlePath = await getOrCreateBundle();
      const composition = await findComposition(bundlePath, compositionId, inputProps);

      return {
        id: composition.id,
        durationInFrames: composition.durationInFrames,
        fps: composition.fps,
        width: composition.width,
        height: composition.height,
        durationInSeconds: composition.durationInFrames / composition.fps,
      };
    } catch (error) {
      console.error(`[VideoGenerator] Error getting metadata for ${compositionId}:`, error);
      throw error;
    }
  }

  /**
   * Get all available compositions
   */
  public async getAllCompositions(inputProps: Record<string, unknown> = {}) {
    try {
      const bundlePath = await getOrCreateBundle();
      return await getAvailableCompositions(bundlePath, inputProps);
    } catch (error) {
      console.error('[VideoGenerator] Error getting compositions:', error);
      throw error;
    }
  }

  /**
   * Generate a video with auto-generated output path
   */
  public async generateVideoAutoPath(
    compositionId: string,
    inputProps: Record<string, unknown>,
    onProgress?: (progress: VideoRenderProgress) => void
  ): Promise<{ outputPath: string; videoUrl: string }> {
    const outputDir = getOutputDir();
    const filename = `${compositionId.toLowerCase()}_${uuidv4().slice(0, 8)}.mp4`;
    const outputPath = path.join(outputDir, filename);
    const videoUrl = `/videos/${filename}`;

    await this.generateVideo(
      { compositionId, inputProps, outputPath },
      onProgress
    );

    return { outputPath, videoUrl };
  }

  /**
   * Clear the bundle cache (useful when compositions change)
   */
  public clearCache(): void {
    cachedBundlePath = null;
    bundleCacheTime = 0;
    console.log('[VideoGenerator] Bundle cache cleared');
  }
}

// Export singleton instance
export const videoGenerator = VideoGenerator.getInstance();

// Convenience function for API routes
export async function generateVideo(
  compositionId: string,
  inputProps: Record<string, unknown>,
  outputPath: string,
  onProgress?: (progress: VideoRenderProgress) => void
): Promise<string> {
  return videoGenerator.generateVideo(
    { compositionId, inputProps, outputPath },
    onProgress
  );
}

// Convenience function for generating video with auto path
export async function generateVideoAuto(
  compositionId: string,
  inputProps: Record<string, unknown>,
  onProgress?: (progress: VideoRenderProgress) => void
): Promise<{ outputPath: string; videoUrl: string }> {
  return videoGenerator.generateVideoAutoPath(compositionId, inputProps, onProgress);
}
