"use client";

import { useState, useEffect, useCallback } from 'react';
import { NewNavigation } from '@/components/new-navigation';
import { 
  Mic, 
  Video, 
  Play, 
  Pause, 
  Download, 
  Plus, 
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Wand2,
  BookOpen,
  Layers,
  FileText,
  Clock,
  Users,
  BarChart,
  Sparkles
} from 'lucide-react';

// Types for the course generation form
interface LessonInput {
  id: string;
  title: string;
  content: string;
  duration: string;
}

interface ModuleInput {
  id: string;
  title: string;
  lessons: LessonInput[];
}

interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
}

interface CourseFormData {
  title: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  modules: ModuleInput[];
  branding: BrandingConfig;
}

interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  courseData: {
    title: string;
    description: string;
    moduleCount: number;
    lessonCount: number;
  };
  results: {
    courseIntro?: string;
    courseThumbnail?: string;
    lessons: {
      id: string;
      title: string;
      audioUrl?: string;
      videoUrl?: string;
      status: string;
    }[];
  };
  createdAt: Date;
  completedAt?: Date;
}

// Initial empty lesson
const createEmptyLesson = (): LessonInput => ({
  id: `lesson-${Date.now()}`,
  title: '',
  content: '',
  duration: '10 minutes'
});

// Initial empty module
const createEmptyModule = (): ModuleInput => ({
  id: `module-${Date.now()}`,
  title: '',
  lessons: [createEmptyLesson()]
});

// Default branding
const defaultBranding: BrandingConfig = {
  primaryColor: '#4f46e5',
  secondaryColor: '#7c3aed'
};

export default function AutoCourseGenerationPage() {
  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructorName: '',
    instructorTitle: 'Course Instructor',
    level: 'Beginner',
    duration: '10 hours',
    category: 'General',
    modules: [createEmptyModule()],
    branding: defaultBranding
  });

  // UI state
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [jobHistory, setJobHistory] = useState<GenerationJob[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // Poll job status when we have an active job
  useEffect(() => {
    if (!jobId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/auto-course-generation?jobId=${jobId}`);
        const data = await response.json();
        
        if (data.success && data.job) {
          setJob(data.job);
          
          if (data.job.status === 'completed' || data.job.status === 'failed') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            
            // Refresh history
            fetchJobHistory();
          }
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [jobId]);

  // Fetch job history on mount
  useEffect(() => {
    fetchJobHistory();
  }, []);

  const fetchJobHistory = async () => {
    try {
      const response = await fetch('/api/auto-course-generation');
      const data = await response.json();
      
      if (data.success && data.jobs) {
        setJobHistory(data.jobs.map((j: GenerationJob) => ({
          ...j,
          createdAt: new Date(j.createdAt)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch job history:', error);
    }
  };

  // Module management
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, createEmptyModule()]
    }));
    setExpandedModules(prev => new Set(prev).add(formData.modules.length));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const toggleModule = (index: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const updateModule = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) => 
        i === index ? { ...mod, [field]: value } : mod
      )
    }));
  };

  // Lesson management
  const addLesson = (moduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) =>
        i === moduleIndex
          ? { ...mod, lessons: [...mod.lessons, createEmptyLesson()] }
          : mod
      )
    }));
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) =>
        i === moduleIndex
          ? { ...mod, lessons: mod.lessons.filter((_, j) => j !== lessonIndex) }
          : mod
      )
    }));
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              lessons: mod.lessons.map((lesson, j) =>
                j === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : mod
      )
    }));
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  // Validation
  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Course title is required');
    if (!formData.description.trim()) errors.push('Course description is required');
    if (!formData.instructorName.trim()) errors.push('Instructor name is required');
    
    const totalLessons = formData.modules.reduce((acc, mod, i) => {
      if (mod.title.trim()) {
        return acc + mod.lessons.length;
      }
      return acc;
    }, 0);
    
    if (totalLessons === 0) errors.push('At least one lesson with a module title is required');
    
    formData.modules.forEach((mod, i) => {
      if (mod.title.trim()) {
        mod.lessons.forEach((lesson, j) => {
          if (!lesson.title.trim()) {
            errors.push(`Lesson ${j + 1} in Module ${i + 1} needs a title`);
          }
          if (!lesson.content.trim()) {
            errors.push(`Lesson "${lesson.title || `Lesson ${j + 1}`}" needs content for audio generation`);
          }
        });
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [formData]);

  // Start course generation
  const generateCourse = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setValidationErrors([]);
    
    try {
      const response = await fetch('/api/auto-course-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobId(data.jobId);
        setActiveTab('history');
      } else {
        alert(`Failed to start generation: ${data.error}`);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Failed to start course generation:', error);
      alert('Failed to start course generation');
      setIsGenerating(false);
    }
  };

  // Calculate total content stats
  const totalStats = {
    modules: formData.modules.filter(m => m.title.trim()).length,
    lessons: formData.modules.reduce((acc, mod) => 
      acc + mod.lessons.filter(l => l.title.trim()).length, 0
    ),
    content: formData.modules.reduce((acc, mod) => 
      acc + mod.lessons.reduce((a, l) => a + l.content.length, 0), 0
    )
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />
      
      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', 
          padding: '3rem 1rem',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Sparkles size={32} />
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                Automated Course Generator
              </h1>
            </div>
            <p style={{ opacity: 0.9, maxWidth: '700px', lineHeight: 1.6 }}>
              Transform your course content into professional audio and video automatically. 
              Enter your course details below and let AI generate engaging course materials for you.
            </p>

            {/* Stats */}
            <div style={{ 
              marginTop: '1.5rem', 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ 
                padding: '0.75rem 1.25rem', 
                background: 'rgba(255,255,255,0.15)', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Layers size={18} />
                <span>{totalStats.modules} Modules</span>
              </div>
              <div style={{ 
                padding: '0.75rem 1.25rem', 
                background: 'rgba(255,255,255,0.15)', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BookOpen size={18} />
                <span>{totalStats.lessons} Lessons</span>
              </div>
              <div style={{ 
                padding: '0.75rem 1.25rem', 
                background: 'rgba(255,255,255,0.15)', 
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileText size={18} />
                <span>{(totalStats.content / 1000).toFixed(1)}K characters</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem'
          }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'create' ? '#059669' : '#f3f4f6',
                color: activeTab === 'create' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Wand2 size={18} />
              Create Course
            </button>
            <button
              onClick={() => { setActiveTab('history'); fetchJobHistory(); }}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'history' ? '#059669' : '#f3f4f6',
                color: activeTab === 'history' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Clock size={18} />
              Generation History
            </button>
          </div>

          {activeTab === 'create' ? (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '0.5rem'
                }}>
                  <h3 style={{ color: '#dc2626', margin: '0 0 0.5rem', fontSize: '1rem' }}>
                    Please fix the following errors:
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991b1b' }}>
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Details */}
              <div style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} />
                  Course Details
                </h2>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Complete Web Development Bootcamp"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Course Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students will learn..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Instructor Name *
                      </label>
                      <input
                        type="text"
                        value={formData.instructorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                        placeholder="e.g., John Doe"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Instructor Title
                      </label>
                      <input
                        type="text"
                        value={formData.instructorTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorTitle: e.target.value }))}
                        placeholder="e.g., Senior Developer"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 10 hours"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Programming"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules & Lessons */}
              <div style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={20} />
                    Course Content
                  </h2>
                  <button
                    onClick={addModule}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Plus size={16} />
                    Add Module
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {formData.modules.map((module, moduleIndex) => (
                    <div 
                      key={module.id}
                      style={{ 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Module Header */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: '#f9fafb',
                        borderBottom: expandedModules.has(moduleIndex) ? '1px solid #e5e7eb' : 'none'
                      }}>
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          style={{
                            padding: '0.25rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex'
                          }}
                        >
                          {expandedModules.has(moduleIndex) ? (
                            <ChevronUp size={20} color="#6b7280" />
                          ) : (
                            <ChevronDown size={20} color="#6b7280" />
                          )}
                        </button>
                        
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          placeholder="Module Title"
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.9375rem',
                            fontWeight: '500'
                          }}
                        />
                        
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </span>
                        
                        {formData.modules.length > 1 && (
                          <button
                            onClick={() => removeModule(moduleIndex)}
                            style={{
                              padding: '0.5rem',
                              background: '#fef2f2',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Trash2 size={16} color="#dc2626" />
                          </button>
                        )}
                      </div>

                      {/* Module Content */}
                      {expandedModules.has(moduleIndex) && (
                        <div style={{ padding: '1rem' }}>
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lesson.id}
                              style={{ 
                                marginBottom: lessonIndex < module.lessons.length - 1 ? '1rem' : 0,
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.5rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                  placeholder="Lesson Title"
                                  style={{
                                    flex: 1,
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    marginRight: '0.5rem'
                                  }}
                                />
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                  placeholder="Duration"
                                  style={{
                                    width: '100px',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    marginRight: '0.5rem'
                                  }}
                                />
                                {module.lessons.length > 1 && (
                                  <button
                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                    style={{
                                      padding: '0.5rem',
                                      background: '#fef2f2',
                                      border: 'none',
                                      borderRadius: '0.375rem',
                                      cursor: 'pointer',
                                      display: 'flex'
                                    }}
                                  >
                                    <Trash2 size={16} color="#dc2626" />
                                  </button>
                                )}
                              </div>
                              
                              <textarea
                                value={lesson.content}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                                placeholder="Enter the lesson content here. This will be converted to audio using AI text-to-speech technology."
                                rows={4}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  resize: 'vertical'
                                }}
                              />
                              
                              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mic size={14} color="#6b7280" />
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                  {lesson.content.length} characters → Will be converted to audio
                                </span>
                              </div>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => addLesson(moduleIndex)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              background: '#f3f4f6',
                              border: '1px dashed #d1d5db',
                              borderRadius: '0.5rem',
                              color: '#6b7280',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <Plus size={16} />
                            Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCourse}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  background: isGenerating ? '#d1d5db' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: isGenerating ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Generating Course Content...
                  </>
                ) : (
                  <>
                    <Wand2 size={24} />
                    Generate Audio & Video for Course
                  </>
                )}
              </button>
            </div>
          ) : (
            /* History Tab */
            <div style={{ 
              background: 'white', 
              borderRadius: '0.75rem', 
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} />
                Generation History
              </h2>

              {jobHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  <BarChart size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                  <p style={{ margin: 0 }}>No course generations yet. Create your first course!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {jobHistory.map((j) => (
                    <div 
                      key={j.id}
                      style={{ 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        padding: '1.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                            {j.courseData.title}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                            {j.courseData.moduleCount} modules • {j.courseData.lessonCount} lessons • Created {formatTime(j.createdAt)}
                          </p>
                        </div>
                        <div style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: j.status === 'completed' ? '#dcfce7' : j.status === 'failed' ? '#fef2f2' : '#fef3c7',
                          color: j.status === 'completed' ? '#16a34a' : j.status === 'failed' ? '#dc2626' : '#d97706'
                        }}>
                          {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                        </div>
                      </div>

                      {/* Progress */}
                      {j.status === 'processing' && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                              {j.currentStep}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {j.progress}%
                            </span>
                          </div>
                          <div style={{ 
                            height: '8px', 
                            background: '#e5e7eb', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${j.progress}%`,
                              background: '#059669',
                              transition: 'width 0.3s'
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      {j.results && (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          {j.results.courseIntro && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                              <Video size={18} color="#059669" />
                              <span style={{ flex: 1, fontSize: '0.875rem' }}>Course Introduction Video</span>
                              <a
                                href={j.results.courseIntro}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: '#059669',
                                  color: 'white',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  textDecoration: 'none'
                                }}
                              >
                                Download
                              </a>
                            </div>
                          )}
                          
                          {j.results.courseThumbnail && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                              <Video size={18} color="#059669" />
                              <span style={{ flex: 1, fontSize: '0.875rem' }}>Course Thumbnail</span>
                              <a
                                href={j.results.courseThumbnail}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: '#059669',
                                  color: 'white',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  textDecoration: 'none'
                                }}
                              >
                                Download
                              </a>
                            </div>
                          )}

                          {j.results.lessons.filter(l => l.audioUrl || l.videoUrl).length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Generated Lessons ({j.results.lessons.filter(l => l.status === 'video_completed').length}/{j.results.lessons.length})
                              </p>
                              <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {j.results.lessons.map((lesson) => (
                                  <div 
                                    key={lesson.id}
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '0.75rem',
                                      padding: '0.75rem',
                                      background: '#f9fafb',
                                      borderRadius: '0.5rem',
                                      opacity: lesson.status === 'video_completed' ? 1 : 0.6
                                    }}
                                  >
                                    {lesson.status === 'video_completed' ? (
                                      <CheckCircle size={16} color="#059669" />
                                    ) : lesson.status === 'failed' ? (
                                      <XCircle size={16} color="#dc2626" />
                                    ) : (
                                      <Loader2 size={16} className="animate-spin" color="#6b7280" />
                                    )}
                                    <span style={{ flex: 1, fontSize: '0.875rem' }}>{lesson.title}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      {lesson.audioUrl && (
                                        <a
                                          href={lesson.audioUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            padding: '0.375rem 0.75rem',
                                            background: '#dbeafe',
                                            color: '#2563eb',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            textDecoration: 'none'
                                          }}
                                        >
                                          Audio
                                        </a>
                                      )}
                                      {lesson.videoUrl && (
                                        <a
                                          href={lesson.videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            padding: '0.375rem 0.75rem',
                                            background: '#dcfce7',
                                            color: '#16a34a',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            textDecoration: 'none'
                                          }}
                                        >
                                          Video
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            © 2026 INR99.Academy - Automated Course Content Generation
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
      `}</style>
    </div>
  );
}
