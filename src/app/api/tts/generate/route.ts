import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, estimateCost, getUsageStats } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, modelId, stability, similarityBoost } = await request.json();

    if (!text || !voiceId) {
      return NextResponse.json(
        { success: false, error: 'Text and voice ID are required' },
        { status: 400 }
      );
    }

    // Check if text is too long
    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Text exceeds maximum length of 5000 characters. Please split into smaller sections.' },
        { status: 400 }
      );
    }

    // Generate audio
    const result = await generateSpeech({
      text,
      voiceId,
      modelId: modelId || 'eleven_multilingual_v2',
      stability: stability || 0.5,
      similarityBoost: similarityBoost || 0.75,
    });

    if (result.success) {
      // Get cost estimate and usage stats
      const costEstimate = estimateCost(text, modelId || 'eleven_multilingual_v2');
      let usageStats = null;
      
      try {
        usageStats = await getUsageStats();
      } catch (e) {
        // Continue without usage stats if API call fails
      }

      return NextResponse.json({
        success: true,
        audioUrl: result.audioUrl,
        duration: result.duration,
        charactersUsed: result.charactersUsed,
        costEstimate,
        usageStats,
        message: 'Audio generated successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('TTS Generation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
