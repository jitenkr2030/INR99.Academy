"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewNavigation } from '@/components/new-navigation';
import { 
  Mic, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Volume2,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Wand2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface Voice {
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

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration?: number;
  audioUrl?: string;
  audioStatus?: 'pending' | 'completed' | 'failed';
}

interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface UsageStats {
  characterLimit: number;
  characterCount: number;
  characterRemaining: number;
  includedCharacters: number;
}

interface GenerationProgress {
  completed: number;
  total: number;
  currentLesson?: string;
  status: 'idle' | 'preparing' | 'generating' | 'completed' | 'error';
}

const DEFAULT_VOICES: Voice[] = [
  { 
    voice_id: '21m00Tcm4TlvDq8ikWAM', 
    name: 'Rachel', 
    category: 'en',
    description: 'Clear, professional female voice',
    labels: { gender: 'female', accent: 'american' }
  },
  { 
    voice_id: 'AZnzlk1XvdvUeBnulIWH', 
    name: 'Drew', 
    category: 'en',
    description: 'Deep, authoritative male voice',
    labels: { gender: 'male', accent: 'american' }
  },
  { 
    voice_id: 'gXW48mkK8tW9mD8q1x8K', 
    name: 'Hindi Male', 
    category: 'hi',
    description: 'Natural Hindi male voice',
    labels: { gender: 'male', accent: 'indian' }
  },
  { 
    voice_id: 'wViXK0O7KCZ4xK3B9b7m', 
    name: 'Hindi Female', 
    category: 'hi',
    description: 'Clear Hindi female voice',
    labels: { gender: 'female', accent: 'indian' }
  },
];

export default function AudioGenerationPage() {
  // State management
  const [voices, setVoices] = useState<Voice[]>(DEFAULT_VOICES);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voicesError, setVoicesError] = useState<string | null>(null);
  
  const [selectedVoice, setSelectedVoice] = useState<string>('21m00Tcm4TlvDq8ikWAM');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    completed: 0,
    total: 0,
    status: 'idle'
  });
  
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewText, setPreviewText] = useState<string>('Welcome to this lesson. Today we will learn about the fundamentals of the topic.');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  
  // Audio ref for playback control
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previewAudioDuration, setPreviewAudioDuration] = useState<number>(0);
  const [previewAudioCurrentTime, setPreviewAudioCurrentTime] = useState(0);

  // Fetch voices from API on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setVoicesLoading(true);
        setVoicesError(null);
        const response = await fetch('/api/tts/preview');
        const data = await response.json();
        
        if (data.success && data.voices?.length > 0) {
          // Merge with default voices to ensure we have fallbacks
          const apiVoices = data.voices.map((v: Voice) => ({
            ...v,
            description: v.description || v.labels?.use_case || 'AI Generated Voice'
          }));
          setVoices(apiVoices);
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error);
        setVoicesError('Failed to load voices. Using default voices.');
      } finally {
        setVoicesLoading(false);
      }
    };

    fetchVoices();
    fetchUsageStats();
  }, []);

  // Fetch usage stats from API
  const fetchUsageStats = async () => {
    try {
      setUsageError(null);
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'stats', 
          voiceId: selectedVoice,
          getStatsOnly: true 
        }),
      });
      
      const data = await response.json();
      if (data.usageStats) {
        setUsageStats({
          characterLimit: data.usageStats.characterLimit,
          characterCount: data.usageStats.characterCount,
          characterRemaining: data.usageStats.characterRemaining,
          includedCharacters: data.usageStats.includedCharacters || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      setUsageError('Unable to load usage statistics');
    }
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success && data.courses?.length > 0) {
        setCourses(data.courses.map((c: Course) => ({
          ...c,
          lessons: c.lessons?.map((l: Lesson) => ({
            ...l,
            audioStatus: l.audioUrl ? 'completed' : 'pending'
          })) || []
        })));
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Fallback to sample courses for demo
      setCourses(getSampleCourses());
    } finally {
      setCoursesLoading(false);
    }
  };

  // Sample courses for demo
  const getSampleCourses = (): Course[] => [
    {
      id: 'course-1',
      title: 'Complete Web Development Bootcamp',
      lessons: [
        { id: 'l1', title: 'Introduction to HTML', content: 'Welcome to the Complete Web Development Bootcamp. In this lesson, we will learn the fundamentals of HTML, which is the backbone of every website. HTML stands for HyperText Markup Language and is the standard markup language for creating web pages.' },
        { id: 'l2', title: 'HTML Basics & Structure', content: 'Every HTML document follows a basic structure. The DOCTYPE declaration defines the document type. The html element is the root element. The head section contains meta information, and the body section contains the visible content.' },
        { id: 'l3', title: 'CSS Fundamentals', content: 'CSS, or Cascading Style Sheets, is used to style and layout web pages. In this lesson, we will learn how to add colors, fonts, and spacing to our HTML elements. CSS allows us to control the visual presentation of HTML elements.' },
        { id: 'l4', title: 'JavaScript Basics', content: 'JavaScript is a programming language that allows you to implement complex features on web pages. Let us start with variables, data types, and basic operations. JavaScript can make your websites interactive and dynamic.' },
        { id: 'l5', title: 'DOM Manipulation', content: 'The Document Object Model (DOM) is a programming interface for web documents. In this lesson, we will learn how to dynamically update the content and structure of web pages using JavaScript. DOM manipulation is essential for creating interactive web applications.' },
      ],
    },
    {
      id: 'course-2',
      title: 'Data Science with Python',
      lessons: [
        { id: 'l6', title: 'Introduction to Data Science', content: 'Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract insights from structured and unstructured data. It combines statistics, programming, and domain expertise.' },
        { id: 'l7', title: 'Python for Data Science', content: 'Python has become the most popular programming language for data science due to its simplicity and powerful libraries like NumPy, Pandas, and Matplotlib. These libraries provide efficient data manipulation and analysis capabilities.' },
        { id: 'l8', title: 'Data Visualization', content: 'Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data.' },
      ],
    },
    {
      id: 'course-3',
      title: 'Digital Marketing Mastery',
      lessons: [
        { id: 'l9', title: 'SEO Fundamentals', content: 'Search Engine Optimization (SEO) is the practice of optimizing websites to rank higher in search engine results. This lesson covers keyword research, on-page optimization, and link building strategies that drive organic traffic.' },
        { id: 'l10', title: 'Social Media Marketing', content: 'Social media marketing involves creating and sharing content on social media platforms to achieve marketing and branding goals. This includes organic social media management and paid advertising campaigns across various platforms.' },
      ],
    },
  ];

  // Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle course selection
  const handleCourseSelect = useCallback((courseId: string) => {
    setSelectedCourse(courseId);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setLessons(course.lessons.map(l => ({
        ...l,
        audioStatus: l.audioUrl ? 'completed' : 'pending' as const
      })));
      setSelectedLessons(new Set());
    }
  }, [courses]);

  // Toggle individual lesson selection
  const toggleLessonSelection = useCallback((lessonId: string) => {
    setSelectedLessons(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(lessonId)) {
        newSelected.delete(lessonId);
      } else {
        newSelected.add(lessonId);
      }
      return newSelected;
    });
  }, []);

  // Select or deselect all lessons
  const selectAllLessons = useCallback(() => {
    if (selectedLessons.size === lessons.length) {
      setSelectedLessons(new Set());
    } else {
      setSelectedLessons(new Set(lessons.map(l => l.id)));
    }
  }, [lessons, selectedLessons.size]);

  // Generate preview audio
  const generatePreview = async () => {
    if (!previewText.trim()) return;

    setIsGeneratingPreview(true);
    try {
      const response = await fetch('/api/tts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: previewText, voiceId: selectedVoice }),
      });

      const data = await response.json();
      if (data.success) {
        // Stop any playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setPreviewAudio(data.audioUrl);
        setIsPlaying(true);
      } else {
        alert(`Failed to generate preview: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Preview generation failed:', error);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Generate audio for selected lessons
  const generateAudio = async () => {
    if (selectedLessons.size === 0) {
      alert('Please select at least one lesson to generate audio for.');
      return;
    }

    // Check usage limits
    const estimatedChars = getSelectedLessonsContent().length;
    if (usageStats && estimatedChars > usageStats.characterRemaining) {
      const confirm = window.confirm(
        `Warning: Estimated character count (${estimatedChars.toLocaleString()}) exceeds your remaining characters (${usageStats.characterRemaining.toLocaleString()}). Continue anyway?`
      );
      if (!confirm) return;
    }

    setIsGenerating(true);
    setGenerationProgress({
      completed: 0,
      total: selectedLessons.size,
      status: 'preparing'
    });

    const lessonsToGenerate = lessons.filter(l => selectedLessons.has(l.id));
    const results: Record<string, { audioUrl: string }> = {};

    for (let i = 0; i < lessonsToGenerate.length; i++) {
      const lesson = lessonsToGenerate[i];
      
      setGenerationProgress(prev => ({
        ...prev,
        currentLesson: lesson.title,
        status: 'generating'
      }));

      try {
        const response = await fetch('/api/tts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: lesson.content,
            voiceId: selectedVoice,
            lessonId: lesson.id,
            courseId: selectedCourse
          }),
        });

        const data = await response.json();
        if (data.success) {
          results[lesson.id] = { audioUrl: data.audioUrl };
          setLessons(prev => prev.map(l => 
            l.id === lesson.id 
              ? { ...l, audioUrl: data.audioUrl, audioStatus: 'completed' as const }
              : l
          ));
        } else {
          setLessons(prev => prev.map(l => 
            l.id === lesson.id 
              ? { ...l, audioStatus: 'failed' as const }
              : l
          ));
        }
      } catch (error) {
        console.error(`Failed to generate audio for ${lesson.title}:`, error);
        setLessons(prev => prev.map(l => 
          l.id === lesson.id 
            ? { ...l, audioStatus: 'failed' as const }
            : l
        ));
      }

      setGenerationProgress(prev => ({
        ...prev,
        completed: prev.completed + 1,
      }));
    }

    setIsGenerating(false);
    setGenerationProgress({
      completed: 0,
      total: 0,
      status: 'completed'
    });
    setSelectedLessons(new Set());

    // Refresh usage stats
    fetchUsageStats();

    const successCount = Object.keys(results).length;
    alert(`Audio generation complete! ${successCount} of ${lessonsToGenerate.length} lessons processed successfully.`);
  };

  // Toggle audio playback
  const togglePlayback = useCallback(() => {
    if (!previewAudio) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [previewAudio, isPlaying]);

  // Handle audio time updates
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setPreviewAudioCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  // Handle audio ended
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setPreviewAudioCurrentTime(0);
  }, []);

  // Handle audio loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setPreviewAudioDuration(audioRef.current.duration);
    }
  }, []);

  // Format time in mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get combined content of selected lessons
  const getSelectedLessonsContent = useCallback(() => {
    return lessons
      .filter(l => selectedLessons.has(l.id))
      .map(l => l.content)
      .join(' ');
  }, [lessons, selectedLessons]);

  // Estimate generation cost
  const estimateCost = useCallback(() => {
    const text = getSelectedLessonsContent();
    const characters = text.length;
    const cost = (characters / 1000) * 0.03; // ~$0.03 per 1000 characters with ElevenLabs
    return { characters, cost };
  }, [getSelectedLessonsContent]);

  // Get selected course data
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  // Get selected voice data
  const selectedVoiceData = voices.find(v => v.voice_id === selectedVoice);

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />
      
      {/* Hidden audio element */}
      {previewAudio && (
        <audio
          ref={audioRef}
          src={previewAudio}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          onLoadedMetadata={handleLoadedMetadata}
          preload="auto"
        />
      )}

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '3rem 1rem',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Mic size={32} />
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                AI Audio Generator
              </h1>
            </div>
            <p style={{ opacity: 0.9, maxWidth: '600px', lineHeight: 1.6 }}>
              Transform your written course content into professional audio using ElevenLabs AI. 
              Select a voice, choose your course lessons, and generate high-quality audio automatically for your courses.
            </p>

            {/* Usage Stats */}
            {usageStats && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.15)', 
                borderRadius: '0.5rem',
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Characters Used</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {usageStats.characterCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Remaining</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {usageStats.characterRemaining.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Limit</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {usageStats.characterLimit.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {usageError && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.2)', 
                borderRadius: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={16} />
                {usageError}
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Left Panel - Configuration */}
            <div>
              {/* Voice Selection */}
              <div style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Volume2 size={20} />
                  Select Voice
                  {voicesLoading && <Loader2 size={16} className="animate-spin" style={{ marginLeft: 'auto' }} />}
                </h2>

                {voicesError && (
                  <div style={{ 
                    padding: '0.75rem', 
                    background: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '0.5rem',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={16} />
                    {voicesError}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {voices.map((voice) => (
                    <button
                      key={voice.voice_id}
                      onClick={() => setSelectedVoice(voice.voice_id)}
                      disabled={voicesLoading}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        border: `2px solid ${selectedVoice === voice.voice_id ? '#667eea' : '#e5e7eb'}`,
                        borderRadius: '0.5rem',
                        background: selectedVoice === voice.voice_id ? '#f0f4ff' : 'white',
                        cursor: voicesLoading ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        opacity: voicesLoading ? 0.6 : 1
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {voice.name}
                          {voice.labels?.gender && (
                            <span style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.125rem 0.5rem', 
                              background: '#f3f4f6', 
                              borderRadius: '9999px',
                              fontWeight: 'normal',
                              color: '#6b7280'
                            }}>
                              {voice.labels.gender}
                            </span>
                          )}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                          {voice.description}
                        </p>
                      </div>
                      {selectedVoice === voice.voice_id && (
                        <CheckCircle size={20} color="#667eea" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={fetchVoices}
                  disabled={voicesLoading}
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem',
                    cursor: voicesLoading ? 'not-allowed' : 'pointer',
                    opacity: voicesLoading ? 0.6 : 1
                  }}
                >
                  <RefreshCw size={16} className={voicesLoading ? 'animate-spin' : ''} />
                  Refresh Voices
                </button>
              </div>

              {/* Course Selection */}
              <div style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} />
                  Select Course
                </h2>

                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedCourse}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    disabled={coursesLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer',
                      appearance: 'none',
                    }}
                  >
                    <option value="">
                      {coursesLoading ? 'Loading courses...' : 'Choose a course...'}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.lessons.length} lessons)
                      </option>
                    ))}
                  </select>
                  <ChevronRight 
                    size={20} 
                    style={{ 
                      position: 'absolute', 
                      right: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%) rotate(90deg)',
                      color: '#9ca3af',
                      pointerEvents: 'none'
                    }} 
                  />
                </div>
              </div>

              {/* Preview */}
              {selectedCourse && (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Play size={20} />
                    Preview Voice
                  </h2>

                  {selectedVoiceData && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      Previewing: <strong>{selectedVoiceData.name}</strong>
                    </p>
                  )}

                  <textarea
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Enter text to preview voice..."
                    style={{
                      width: '100%',
                      height: '120px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      marginBottom: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={generatePreview}
                      disabled={!previewText.trim() || isGeneratingPreview}
                      style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '0.75rem 1rem',
                        background: previewText.trim() && !isGeneratingPreview ? '#667eea' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: previewText.trim() && !isGeneratingPreview ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {isGeneratingPreview ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} />
                          Generate Preview
                        </>
                      )}
                    </button>

                    {previewAudio && (
                      <button
                        onClick={togglePlayback}
                        style={{
                          padding: '0.75rem 1rem',
                          background: isPlaying ? '#f59e0b' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                    )}
                  </div>

                  {/* Audio Progress Bar */}
                  {previewAudio && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '0.75rem', 
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        <span>{formatTime(previewAudioCurrentTime)}</span>
                        <span>{formatTime(previewAudioDuration)}</span>
                      </div>
                      <div style={{ 
                        height: '6px', 
                        background: '#e5e7eb', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: previewAudioDuration > 0 ? `${(previewAudioCurrentTime / previewAudioDuration) * 100}%` : '0%',
                          background: '#667eea',
                          transition: 'width 0.1s'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel - Lessons */}
            <div>
              {selectedCourseData ? (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={20} />
                      Lessons
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 'normal', 
                        color: '#6b7280',
                        marginLeft: '0.5rem'
                      }}>
                        ({lessons.length} total)
                      </span>
                    </h2>
                    <button
                      onClick={selectAllLessons}
                      disabled={isGenerating}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.6 : 1
                      }}
                    >
                      {selectedLessons.size === lessons.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {/* Cost Estimate */}
                  {selectedLessons.size > 0 && (
                    <div style={{ 
                      marginBottom: '1rem', 
                      padding: '1rem', 
                      background: '#f0f4ff', 
                      borderRadius: '0.5rem',
                      border: '1px solid #667eea'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        Estimated cost for {selectedLessons.size} {selectedLessons.size === 1 ? 'lesson' : 'lessons'}
                      </p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea', margin: '0.25rem 0 0' }}>
                        ${estimateCost().cost.toFixed(2)}
                        <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280', marginLeft: '0.5rem' }}>
                          ({estimateCost().characters.toLocaleString()} chars)
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Progress */}
                  {isGenerating && (
                    <div style={{ 
                      marginBottom: '1rem', 
                      padding: '1rem', 
                      background: '#fef3c7', 
                      borderRadius: '0.5rem',
                      border: '1px solid #fcd34d'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e' }}>
                          {generationProgress.status === 'preparing' ? 'Preparing...' : 'Generating Audio...'}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                          {generationProgress.completed}/{generationProgress.total}
                        </span>
                      </div>
                      <div style={{ 
                        height: '8px', 
                        background: '#fde68a', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${(generationProgress.completed / generationProgress.total) * 100}%`,
                          background: '#f59e0b',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      {generationProgress.currentLesson && (
                        <p style={{ fontSize: '0.75rem', color: '#92400e', margin: '0.5rem 0 0' }}>
                          Processing: {generationProgress.currentLesson}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Error Summary */}
                  {lessons.some(l => l.audioStatus === 'failed') && (
                    <div style={{ 
                      marginBottom: '1rem', 
                      padding: '1rem', 
                      background: '#fef2f2', 
                      borderRadius: '0.5rem',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <AlertCircle size={20} color="#dc2626" />
                      <div>
                        <p style={{ fontWeight: '600', color: '#dc2626', margin: 0, fontSize: '0.875rem' }}>
                          Some lessons failed to generate
                        </p>
                        <p style={{ color: '#991b1b', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                          Please try generating audio for failed lessons again.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lessons List */}
                  <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {lessons.map((lesson) => (
                      <label
                        key={lesson.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: lesson.audioStatus === 'completed' ? 'default' : 'pointer',
                          background: selectedLessons.has(lesson.id) ? '#f0f4ff' : 'white',
                          opacity: lesson.audioStatus === 'completed' ? 0.7 : 1,
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLessons.has(lesson.id)}
                          onChange={() => toggleLessonSelection(lesson.id)}
                          disabled={lesson.audioStatus === 'completed' || isGenerating}
                          style={{ marginTop: '0.25rem', cursor: lesson.audioStatus === 'completed' || isGenerating ? 'not-allowed' : 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                            {lesson.title}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                            {lesson.content.length.toLocaleString()} characters
                          </p>
                          {lesson.audioStatus === 'completed' && (
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: '0.75rem', 
                              color: '#10b981',
                              marginTop: '0.5rem',
                              fontWeight: '500'
                            }}>
                              <CheckCircle size={12} />
                              Audio Generated
                            </span>
                          )}
                          {lesson.audioStatus === 'failed' && (
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: '0.75rem', 
                              color: '#ef4444',
                              marginTop: '0.5rem',
                              fontWeight: '500'
                            }}>
                              <XCircle size={12} />
                              Failed - Click to retry
                            </span>
                          )}
                        </div>
                        {lesson.audioUrl && (
                          <a
                            href={lesson.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '0.5rem',
                              background: '#f3f4f6',
                              borderRadius: '0.375rem',
                              color: '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                            title="Download audio"
                          >
                            <Download size={16} />
                          </a>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateAudio}
                    disabled={isGenerating || selectedLessons.size === 0}
                    style={{
                      width: '100%',
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: isGenerating || selectedLessons.size === 0 ? '#d1d5db' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: isGenerating || selectedLessons.size === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Generate Audio for {selectedLessons.size} {selectedLessons.size === 1 ? 'Lesson' : 'Lessons'}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Empty State */
                <div style={{ 
                  background: 'white', 
                  borderRadius: '0.75rem', 
                  padding: '3rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <Mic size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', margin: '0 0 0.5rem' }}>
                    Select a Course
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                    Choose a course from the dropdown above to view its lessons and generate audio content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          background: '#111827',
          color: 'white',
          padding: '2rem 1rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
            © 2026 INR99.Academy - AI-Powered Course Audio Generation with ElevenLabs
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}
