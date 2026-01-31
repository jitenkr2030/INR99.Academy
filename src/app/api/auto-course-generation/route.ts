import { NextRequest, NextResponse } from 'next/server';
import { generateAudio, getVoices, getUsageStats } from '@/lib/elevenlabs';
import { videoGenerator } from '@/remotion/utils/videoGenerator';
import path from 'path';
import fs from 'fs';

// Types for the course generation pipeline
interface LessonInput {
  title: string;
  content: string;
  duration?: string;
}

interface ModuleInput {
  title: string;
  lessons: LessonInput[];
}

interface CourseInput {
  title: string;
  description: string;
  instructorName: string;
  instructorTitle?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  modules: ModuleInput[];
  branding?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  courseData: CourseInput;
  results: {
    courseIntro?: string;
    courseThumbnail?: string;
    lessons: {
      id: string;
      title: string;
      audioUrl?: string;
      videoUrl?: string;
      status: 'pending' | 'audio_generating' | 'audio_completed' | 'video_generating' | 'video_completed' | 'failed';
      error?: string;
    }[];
  };
  createdAt: Date;
  completedAt?: Date;
}

// In-memory job storage (use Redis/database for production)
const jobs = new Map<string, GenerationJob>();

// Generate unique job ID
function generateJobId(): string {
  return `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Ensure output directories exist
function ensureDirectories() {
  const baseDir = path.join(process.cwd(), 'public', 'auto-generated');
  const audioDir = path.join(baseDir, 'audio');
  const videoDir = path.join(baseDir, 'video');
  
  [baseDir, audioDir, videoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  return { baseDir, audioDir, videoDir };
}

// Process a single lesson: generate audio, then video
async function processLesson(
  lesson: LessonInput,
  courseData: CourseInput,
  index: number,
  audioDir: string,
  videoDir: string,
  updateCallback: (status: string) => void
): Promise<{ audioUrl: string; videoUrl: string } | null> {
  try {
    // Step 1: Generate Audio using ElevenLabs
    updateCallback(`Generating audio for "${lesson.title}"...`);
    
    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default English voice
    const audioResult = await generateAudio(lesson.content, voiceId);
    
    if (!audioResult.success || !audioResult.audioUrl) {
      throw new Error(`Audio generation failed: ${audioResult.error}`);
    }
    
    // Copy audio to our storage
    const audioFilename = `lesson-${Date.now()}-${index}.mp3`;
    const audioPath = path.join(audioDir, audioFilename);
    
    // For demo purposes, we'll use the returned URL directly
    // In production, you'd download and save the file
    const audioUrl = audioResult.audioUrl;
    
    // Step 2: Generate Video using Remotion
    updateCallback(`Rendering video for "${lesson.title}"...`);
    
    const videoResult = await videoGenerator.generateVideoAutoPath('LessonPreview', {
      lessonTitle: lesson.title,
      lessonNumber: index + 1,
      duration: lesson.duration || '10 minutes',
      keyTopics: lesson.content.substring(0, 100).split(' ').slice(0, 3),
      courseTitle: courseData.title,
      instructorName: courseData.instructorName,
      audioUrl: audioUrl, // Pass the audio to the video composition
      branding: courseData.branding || {
        primaryColor: '#4f46e5',
        secondaryColor: '#7c3aed'
      }
    });
    
    const videoUrl = videoResult.videoUrl;
    
    return { audioUrl, videoUrl };
  } catch (error) {
    console.error(`Failed to process lesson "${lesson.title}":`, error);
    return null;
  }
}

// Background job processor
async function processCourseJob(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) return;
  
  const { audioDir, videoDir } = ensureDirectories();
  
  try {
    job.status = 'processing';
    job.currentStep = 'Starting course generation...';
    
    const totalLessons = job.courseData.modules.reduce(
      (acc, mod) => acc + mod.lessons.length, 
      0
    );
    let completedLessons = 0;
    
    // Step 1: Generate Course Intro Video
    job.currentStep = 'Generating course introduction video...';
    job.progress = 5;
    
    const introResult = await videoGenerator.generateVideoAutoPath('CourseIntro', {
      title: job.courseData.title,
      instructorName: job.courseData.instructorName,
      instructorTitle: job.courseData.instructorTitle || 'Instructor',
      duration: job.courseData.duration,
      level: job.courseData.level,
      category: job.courseData.category,
      branding: job.courseData.branding || {
        primaryColor: '#4f46e5',
        secondaryColor: '#7c3aed'
      }
    });
    
    job.results.courseIntro = introResult.videoUrl;
    
    // Step 2: Generate Course Thumbnail
    job.currentStep = 'Generating course thumbnail...';
    job.progress = 10;
    
    const thumbnailResult = await videoGenerator.generateVideoAutoPath('CourseThumbnail', {
      title: job.courseData.title,
      instructorName: job.courseData.instructorName,
      level: job.courseData.level,
      duration: job.courseData.duration,
      studentCount: 0, // Start with 0 for new courses
      rating: 0,
      category: job.courseData.category,
      branding: job.courseData.branding || {
        primaryColor: '#4f46e5',
        secondaryColor: '#7c3aed'
      }
    });
    
    job.results.courseThumbnail = thumbnailResult.videoUrl;
    
    // Step 3: Process each lesson (audio + video)
    let lessonIndex = 0;
    for (const module of job.courseData.modules) {
      for (const lesson of module.lessons) {
        const jobLesson = job.results.lessons.find(l => l.title === lesson.title);
        if (jobLesson) {
          jobLesson.status = 'audio_generating';
        }
        
        const result = await processLesson(
          lesson,
          job.courseData,
          lessonIndex,
          audioDir,
          videoDir,
          (status) => {
            job.currentStep = status;
            job.progress = 10 + Math.floor((completedLessons / totalLessons) * 80);
          }
        );
        
        if (result && jobLesson) {
          jobLesson.audioUrl = result.audioUrl;
          jobLesson.videoUrl = result.videoUrl;
          jobLesson.status = 'video_completed';
        } else if (jobLesson) {
          jobLesson.status = 'failed';
          jobLesson.error = 'Generation failed';
        }
        
        completedLessons++;
      }
    }
    
    // Step 4: Complete
    job.status = 'completed';
    job.currentStep = 'Course generation completed!';
    job.progress = 100;
    job.completedAt = new Date();
    
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    job.status = 'failed';
    job.currentStep = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// POST: Start a new course generation job
export async function POST(request: NextRequest) {
  try {
    const body: CourseInput = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.instructorName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, instructorName' },
        { status: 400 }
      );
    }
    
    if (!body.modules || body.modules.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one module with lessons is required' },
        { status: 400 }
      );
    }
    
    // Create job
    const jobId = generateJobId();
    const job: GenerationJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      currentStep: 'Initializing...',
      courseData: body,
      results: {
        lessons: body.modules.flatMap(module =>
          module.lessons.map((lesson, idx) => ({
            id: `lesson-${Date.now()}-${idx}`,
            title: lesson.title,
            status: 'pending' as const
          }))
        )
      },
      createdAt: new Date()
    };
    
    jobs.set(jobId, job);
    
    // Start processing in background (fire and forget)
    // In production, use a proper job queue (Bull, Inngest, etc.)
    processCourseJob(jobId).catch(console.error);
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Course generation started. Use the job ID to track progress.'
    });
    
  } catch (error) {
    console.error('Failed to start course generation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start course generation' },
      { status: 500 }
    );
  }
}

// GET: Check job status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  
  if (!jobId) {
    // Return list of jobs
    const jobList = Array.from(jobs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10); // Last 10 jobs
    
    return NextResponse.json({
      success: true,
      jobs: jobList.map(j => ({
        id: j.id,
        title: j.courseData.title,
        status: j.status,
        progress: j.progress,
        currentStep: j.currentStep,
        createdAt: j.createdAt
      }))
    });
  }
  
  const job = jobs.get(jobId);
  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Job not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    job: {
      id: job.id,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      courseData: {
        title: job.courseData.title,
        description: job.courseData.description,
        moduleCount: job.courseData.modules.length,
        lessonCount: job.courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)
      },
      results: job.results,
      createdAt: job.createdAt,
      completedAt: job.completedAt
    }
  });
}
