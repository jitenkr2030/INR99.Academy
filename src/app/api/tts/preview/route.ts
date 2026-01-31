import { NextRequest, NextResponse } from 'next/server';
import { generatePreview, getAvailableVoices } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      return NextResponse.json(
        { success: false, error: 'Text and voice ID are required' },
        { status: 400 }
      );
    }

    const result = await generatePreview(text, voiceId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        audioUrl: result.audioUrl,
        message: 'Preview generated successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('TTS Preview Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const voices = await getAvailableVoices();
    return NextResponse.json({
      success: true,
      voices,
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}
