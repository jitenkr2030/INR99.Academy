/**
 * ElevenLabs Text-to-Speech Integration
 * For INR99 Academy Automated Course Audio Generation
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client for storing generated audio
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const AUDIO_BUCKET = process.env.AWS_S3_BUCKET || 'inr99-audio';
const CDN_URL = process.env.CDN_URL || 'https://cdn.inr99.academy';

// ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Recommended voices for educational content
export const EDUCATIONAL_VOICES = {
  english_male: {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'Clear, professional female voice for English content',
  },
  english_female: {
    id: 'AZnzlk1XvdvUeBnulIWH',
    name: 'Drew',
    description: 'Deep, authoritative male voice for English content',
  },
  hindi_male: {
    id: 'gXW48mkK8tW9mD8q1x8K',
    name: 'Hindi Male',
    description: 'Natural Hindi voice for Indian audiences',
  },
  hindi_female: {
    id: 'wViXK0O7KCZ4xK3B9b7m',
    name: 'Hindi Female',
    description: 'Clear female voice for Hindi educational content',
  },
};

export interface TTSRequest {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  duration?: number;
  error?: string;
  charactersUsed?: number;
}

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  labels?: {
    accent?: string;
    age?: string;
    gender?: string;
    use_case?: string;
  };
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices from ElevenLabs');
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    // Return default voices as fallback
    return Object.entries(EDUCATIONAL_VOICES).map(([key, voice]) => ({
      voice_id: voice.id,
      name: voice.name,
      category: 'custom',
      description: voice.description,
    }));
  }
}

/**
 * Generate speech from text using ElevenLabs API
 */
export async function generateSpeech(request: TTSRequest): Promise<TTSResponse> {
  const {
    text,
    voiceId,
    modelId = 'eleven_multilingual_v2',
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0,
    useSpeakerBoost = true,
  } = request;

  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Text content is required' };
    }

    if (!voiceId) {
      return { success: false, error: 'Voice ID is required' };
    }

    // Check character limit (ElevenLabs limit is approximately 5000 characters per request)
    if (text.length > 5000) {
      return { success: false, error: 'Text exceeds maximum length of 5000 characters. Please split into smaller sections.' };
    }

    // Call ElevenLabs API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?optimize_streaming_latency=4`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: useSpeakerBoost,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || 'ElevenLabs API error');
    }

    // Get audio as buffer
    const audioBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    // Calculate approximate duration (rough estimate: 150 words per minute)
    const wordCount = text.split(/\s+/).length;
    const duration = (wordCount / 150) * 60;

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `audio_${voiceId}_${timestamp}.mp3`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: AUDIO_BUCKET,
      Key: `generated-audio/${filename}`,
      Body: Buffer.from(audioBuffer),
      ContentType: contentType,
      Metadata: {
        originalTextLength: text.length.toString(),
        voiceId,
        modelId,
        generatedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Return public URL
    const audioUrl = `${CDN_URL}/generated-audio/${filename}`;

    return {
      success: true,
      audioUrl,
      duration,
      charactersUsed: text.length,
    };
  } catch (error) {
    console.error('TTS Generation Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate preview audio (shorter, for testing voice settings)
 */
export async function generatePreview(
  text: string,
  voiceId: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  // Limit preview to 200 characters
  const previewText = text.substring(0, 200);
  
  const result = await generateSpeech({
    text: previewText,
    voiceId,
    stability: 0.5,
    similarityBoost: 0.75,
  });

  return {
    success: result.success,
    audioUrl: result.audioUrl,
    error: result.error,
  };
}

/**
 * Batch generate audio for multiple lessons
 */
export async function generateBatchAudio(
  lessons: Array<{
    id: string;
    text: string;
    voiceId: string;
  }>
): Promise<{
  results: Array<{
    lessonId: string;
    success: boolean;
    audioUrl?: string;
    duration?: number;
    error?: string;
  }>;
}> {
  const results = await Promise.all(
    lessons.map(async (lesson) => {
      const result = await generateSpeech({
        text: lesson.text,
        voiceId: lesson.voiceId,
      });

      return {
        lessonId: lesson.id,
        success: result.success,
        audioUrl: result.audioUrl,
        duration: result.duration,
        error: result.error,
      };
    })
  );

  return { results };
}

/**
 * Estimate cost for text-to-speech generation
 */
export function estimateCost(text: string, modelId: string = 'eleven_multilingual_v2'): {
  characters: number;
  estimatedCost: number;
  currency: string;
} {
  const characters = text.length;
  
  // ElevenLabs pricing (approximate, varies by plan)
  // Multilingual V2: $0.03 per 1,000 characters
  const costPer1KChars = modelId === 'eleven_multilingual_v2' ? 0.03 : 0.015;
  const estimatedCost = (characters / 1000) * costPer1KChars;

  return {
    characters,
    estimatedCost,
    currency: 'USD',
  };
}

/**
 * Get usage statistics from ElevenLabs
 */
export async function getUsageStats(): Promise<{
  characterLimit: number;
  characterCount: number;
  characterRemaining: number;
}> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch usage stats');
    }

    const data = await response.json();
    
    return {
      characterLimit: data.character_limit || 10000,
      characterCount: data.character_count || 0,
      characterRemaining: (data.character_limit || 10000) - (data.character_count || 0),
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return {
      characterLimit: 10000,
      characterCount: 0,
      characterRemaining: 10000,
    };
  }
}
