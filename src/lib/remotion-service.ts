/**
 * Remotion Video Rendering Service
 * 
 * This file contains all Remotion-specific imports and logic.
 * It's designed to be dynamically imported at runtime to avoid
 * Next.js webpack bundling issues with TypeScript declaration files.
 * 
 * IMPORTANT: This module should only be imported using dynamic imports:
 * const { renderVideo } = await import('@/lib/remotion-service');
 */

import type { VideoRenderProgress } from '@/remotion/utils/videoGenerator';

// Type definitions for the rendering service
export interface RenderOptions {
  compositionId: string;
  inputProps: Record<string, unknown>;
  outputPath: string;
}

export interface RenderResult {
  outputPath: string;
  videoUrl: string;
  fileSize: number;
}

// Video quality presets
const VIDEO_QUALITY_PRESETS = {
  draft: { width: 640, height: 360, fps: 15 },
  standard: { width: 1280, height: 720, fps: 24 },
  hd: { width: 1920, height: 1080, fps: 30 },
  uhd: { width: 3840, height: 2160, fps: 30 },
};

const DEFAULT_QUALITY = 'hd';

// Cache for bundled Remotion entry point
let cachedBundlePath: string | null = null;
let bundleCacheTime: number = 0;
const BUNDLE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

/**
 * Get the Remotion entry point path
 */
function getEntryPointPath(): string {
  // Use absolute path from the project root
  return require('path').resolve(process.cwd(), 'src', 'remotion', 'index.ts');
}

/**
 * Get the output directory for videos
 */
function getOutputDir(): string {
  const outputDir = process.env.VIDEO_OUTPUT_DIR || require('path').join(process.cwd(), 'public', 'videos');
  const fs = require('fs');
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
  const { bundle } = await import('@remotion/bundler');
  const entryPoint = getEntryPointPath();

  // Check if cache is valid
  if (cachedBundlePath && (now - bundleCacheTime) < BUNDLE_CACHE_DURATION) {
    console.log('[RemotionService] Using cached bundle');
    return cachedBundlePath;
  }

  console.log('[RemotionService] Creating new bundle...');

  try {
    // Create bundle using @remotion/bundler
    const bundlePath = await bundle({
      entryPoint,
      webpackOverride: (config: any) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};
        return config;
      },
      inline: false,
    });

    cachedBundlePath = bundlePath;
    bundleCacheTime = now;

    console.log('[RemotionService] Bundle created successfully:', bundlePath);
    return bundlePath;
  } catch (error) {
    console.error('[RemotionService] Failed to create bundle:', error);
    throw new Error(`Failed to bundle Remotion project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get available compositions from the bundle
 */
async function getAvailableCompositions(
  serveUrl: string,
  inputProps: Record<string, unknown>
): Promise<Array<{ id: string; durationInFrames: number; fps: number; width: number; height: number }>> {
  const { getCompositions } = await import('@remotion/renderer');

  try {
    const compositions = await getCompositions({
      serveUrl,
      inputProps,
    });

    return compositions.map((comp: any) => ({
      id: comp.id,
      durationInFrames: comp.durationInFrames,
      fps: comp.fps,
      width: comp.width,
      height: comp.height,
    }));
  } catch (error) {
    console.error('[RemotionService] Failed to get compositions:', error);
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

/**
 * Render a video using Remotion
 * This is the main rendering function that gets called at runtime
 */
export async function renderVideo(
  options: RenderOptions,
  onProgress?: (progress: VideoRenderProgress) => void
): Promise<RenderResult> {
  const { compositionId, inputProps, outputPath } = options;
  const { renderMedia } = await import('@remotion/renderer');
  const path = require('path');
  const fs = require('fs');

  console.log(`[RemotionService] Starting video generation for: ${compositionId}`);
  console.log(`[RemotionService] Input props:`, JSON.stringify(inputProps, null, 2));

  try {
    // Step 1: Get or create the bundle
    const bundlePath = await getOrCreateBundle();
    console.log('[RemotionService] Bundle ready');

    // Step 2: Find the composition
    const composition = await findComposition(bundlePath, compositionId, inputProps);
    console.log(`[RemotionService] Found composition: ${composition.id} (${composition.width}x${composition.height} @ ${composition.fps}fps)`);

    // Step 3: Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Step 4: Render the video
    console.log('[RemotionService] Starting video render...');

    await renderMedia({
      composition,
      serveUrl: bundlePath,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      onProgress: ({ progress, framesRendered, totalFrames }: { progress: number; framesRendered: number; totalFrames: number }) => {
        if (onProgress) {
          onProgress({
            progress: progress * 100,
            framesRendered,
            totalFrames,
          });
        }
        const progressPercent = Math.round(progress * 100);
        if (progressPercent % 10 === 0) {
          console.log(`[RemotionService] Rendering: ${progressPercent}% (${framesRendered}/${totalFrames} frames)`);
        }
      },
    });

    // Step 5: Verify the output file
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`[RemotionService] Video generated successfully: ${outputPath}`);
      console.log(`[RemotionService] File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

      // Generate the video URL
      const filename = path.basename(outputPath);
      const videoUrl = `/videos/${filename}`;

      return {
        outputPath,
        videoUrl,
        fileSize: stats.size,
      };
    } else {
      throw new Error('Video file was not created');
    }
  } catch (error) {
    console.error(`[RemotionService] Error generating video for ${compositionId}:`, error);
    throw error;
  }
}

/**
 * Render multiple videos in batch
 */
export async function renderBatchVideos(
  jobs: RenderOptions[],
  onProgress?: (jobIndex: number, progress: VideoRenderProgress) => void
): Promise<RenderResult[]> {
  const results: RenderResult[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    console.log(`[RemotionService] Processing job ${i + 1}/${jobs.length}: ${job.compositionId}`);

    try {
      const result = await renderVideo(
        job,
        (progress) => {
          if (onProgress) {
            onProgress(i, progress);
          }
        }
      );
      results.push(result);
    } catch (error) {
      console.error(`[RemotionService] Failed to process job ${i + 1}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Get composition metadata without rendering
 */
export async function getCompositionMetadata(compositionId: string, inputProps: Record<string, unknown>) {
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
}

/**
 * Get all available compositions
 */
export async function getAllCompositions(inputProps: Record<string, unknown> = {}) {
  const bundlePath = await getOrCreateBundle();
  return await getAvailableCompositions(bundlePath, inputProps);
}

/**
 * Generate a video with auto-generated output path
 */
export async function renderVideoAutoPath(
  compositionId: string,
  inputProps: Record<string, unknown>,
  onProgress?: (progress: VideoRenderProgress) => void
): Promise<RenderResult> {
  const outputDir = getOutputDir();
  const { v4: uuidv4 } = require('uuid');
  const path = require('path');
  const filename = `${compositionId.toLowerCase()}_${uuidv4().slice(0, 8)}.mp4`;
  const outputPath = path.join(outputDir, filename);

  return await renderVideo(
    { compositionId, inputProps, outputPath },
    onProgress
  );
}

/**
 * Clear the bundle cache
 */
export function clearCache(): void {
  cachedBundlePath = null;
  bundleCacheTime = 0;
  console.log('[RemotionService] Bundle cache cleared');
}
