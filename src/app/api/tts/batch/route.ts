import { NextRequest, NextResponse } from 'next/server';
import { generateBatchAudio, estimateCost, getUsageStats } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { lessons } = await request.json();

    if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lessons array is required' },
        { status: 400 }
      );
    }

    // Validate each lesson
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      if (!lesson.id || !lesson.text || !lesson.voiceId) {
        return NextResponse.json(
          { success: false, error: `Lesson at index ${i} is missing required fields (id, text, voiceId)` },
          { status: 400 }
        );
      }

      if (lesson.text.length > 5000) {
        return NextResponse.json(
          { success: false, error: `Lesson "${lesson.id}" exceeds maximum length of 5000 characters` },
          { status: 400 }
        );
      }
    }

    // Generate batch audio
    const result = await generateBatchAudio(lessons);

    // Calculate total stats
    const totalCharacters = lessons.reduce((sum, l) => sum + l.text.length, 0);
    const successfulGenerations = result.results.filter(r => r.success).length;
    const failedGenerations = result.results.filter(r => !r.success).length;

    const totalDuration = result.results
      .filter(r => r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0);

    // Get cost estimate
    const costEstimate = estimateCost(lessons.map(l => l.text).join(' '));
    
    let usageStats = null;
    try {
      usageStats = await getUsageStats();
    } catch (e) {
      // Continue without usage stats
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalLessons: lessons.length,
        successful: successfulGenerations,
        failed: failedGenerations,
        totalCharacters,
        totalDuration: Math.round(totalDuration / 60), // in minutes
        costEstimate,
      },
      results: result.results,
      usageStats,
      message: `Generated audio for ${successfulGenerations} out of ${lessons.length} lessons`,
    });
  } catch (error) {
    console.error('Batch TTS Generation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate batch audio' },
      { status: 500 }
    );
  }
}
