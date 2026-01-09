/**
 * CloudConvert Integration Service
 * 
 * Handles PPTX to Video and Audio conversion using CloudConvert API
 * 
 * Author: INR99 Academy
 * Version: 1.0.0
 */

interface CloudConvertConfig {
  apiKey: string
  webhookUrl: string
}

interface CreateJobParams {
  lessonId: string
  sourceFileUrl: string
  sourceFileName: string
  targetFormat: 'VIDEO' | 'AUDIO' | 'BOTH'
  webhookUrl?: string
}

interface TaskResponse {
  id: string
  name: string
  status: string
  result?: any
}

interface JobResponse {
  id: string
  status: string
  tasks: TaskResponse[]
}

export class CloudConvertService {
  private config: CloudConvertConfig
  private baseUrl = 'https://api.cloudconvert.com/v1'

  constructor() {
    this.config = {
      apiKey: process.env.CLOUDCONVERT_API_KEY || '',
      webhookUrl: process.env.CLOUDCONVERT_WEBHOOK_URL || ''
    }
  }

  /**
   * Create a conversion job for PPTX to Video/Audio
   */
  async createConversionJob(params: CreateJobParams): Promise<JobResponse> {
    const { sourceFileUrl, sourceFileName, targetFormat, webhookUrl } = params

    // Build tasks array based on target format
    const tasks: any[] = []

    // Task 1: Import file from URL
    const importTaskId = `import-${Date.now()}`
    tasks.push({
      id: importTaskId,
      name: 'import',
      operation: 'import/url',
      url: sourceFileUrl
    })

    // Task 2: Convert to PDF first (PPTX -> PDF)
    const convertToPdfTaskId = `convert-pdf-${Date.now()}`
    tasks.push({
      id: convertToPdfTaskId,
      name: 'convertpdf',
      operation: 'convert',
      input: importTaskId,
      output_format: 'pdf'
    })

    // Task 3: Convert to images (for video)
    if (targetFormat === 'VIDEO' || targetFormat === 'BOTH') {
      const imagesTaskId = `images-${Date.now()}`
      tasks.push({
        id: imagesTaskId,
        name: 'images',
        operation: 'convert',
        input: convertToPdfTaskId,
        output_format: 'jpg',
        fit_to: 'contain',
        width: 1920,
        height: 1080,
        background: '#ffffff'
      })

      // Task 4: Create video from images
      const videoTaskId = `video-${Date.now()}`
      tasks.push({
        id: videoTaskId,
        name: 'video',
        operation: 'concat',
        input: imagesTaskId,
        output_format: 'mp4',
        fps: 1, // 1 frame per second (adjust for speed)
        video_bitrate: 2000,
        filename: sourceFileName.replace('.pptx', '.mp4')
      })

      // Task 5: Upload video to storage
      const uploadVideoTaskId = `upload-video-${Date.now()}`
      tasks.push({
        id: uploadVideoTaskId,
        name: 'uploadvideo',
        operation: 'export/url',
        input: videoTaskId,
        inline: false,
        filename: sourceFileName.replace('.pptx', '.mp4')
      })
    }

    // Task for Audio (if needed)
    if (targetFormat === 'AUDIO' || targetFormat === 'BOTH') {
      // For audio, we'll create a simple silent audio or use text-to-speech
      // Note: PPTX to audio extraction is complex; for now, create placeholder
      const audioTaskId = `audio-${Date.now()}`
      tasks.push({
        id: audioTaskId,
        name: 'audio',
        operation: 'convert',
        input: convertToPdfTaskId,
        output_format: 'mp3'
      })

      // Upload audio
      const uploadAudioTaskId = `upload-audio-${Date.now()}`
      tasks.push({
        id: uploadAudioTaskId,
        name: 'uploadaudio',
        operation: 'export/url',
        input: audioTaskId,
        inline: false,
        filename: sourceFileName.replace('.pptx', '.mp3')
      })
    }

    // Build the job payload
    const jobPayload = {
      tasks,
      webhook: webhookUrl || this.config.webhookUrl
    }

    console.log('CloudConvert job payload:', JSON.stringify(jobPayload, null, 2))

    try {
      const response = await fetch(`${this.baseUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobPayload)
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('CloudConvert API error:', error)
        throw new Error(error.message || 'Failed to create CloudConvert job')
      }

      const data = await response.json()
      console.log('CloudConvert job created:', data)

      return {
        id: data.id,
        status: data.status,
        tasks: data.tasks
      }
    } catch (error: any) {
      console.error('CloudConvert createJob error:', error)
      throw error
    }
  }

  /**
   * Get job status from CloudConvert
   */
  async getJobStatus(jobId: string): Promise<JobResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get job status')
      }

      const data = await response.json()
      return {
        id: data.id,
        status: data.status,
        tasks: data.tasks
      }
    } catch (error: any) {
      console.error('CloudConvert getJobStatus error:', error)
      throw error
    }
  }

  /**
   * Get task result from CloudConvert
   */
  async getTaskResult(taskId: string): Promise<TaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get task result')
      }

      return await response.json()
    } catch (error: any) {
      console.error('CloudConvert getTaskResult error:', error)
      throw error
    }
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
    } catch (error: any) {
      console.error('CloudConvert cancelJob error:', error)
      throw error
    }
  }

  /**
   * Process webhook payload from CloudConvert
   */
  processWebhookPayload(payload: any): {
    jobId: string
    taskId: string
    status: string
    outputFiles?: Array<{ url: string; filename: string }>
    error?: string
  } {
    const { event, job, task } = payload

    const result = {
      jobId: job?.id || task?.job_id,
      taskId: task?.id,
      status: task?.status || job?.status,
      outputFiles: task?.result?.files || [],
      error: task?.message
    }

    return result
  }

  /**
   * Generate thumbnail from video
   */
  async generateThumbnail(videoUrl: string): Promise<string> {
    // This would typically use a video processing service
    // For now, return a placeholder
    return videoUrl.replace('.mp4', '-thumbnail.jpg')
  }

  /**
   * Estimate conversion cost
   */
  estimateCost(targetFormat: 'VIDEO' | 'AUDIO' | 'BOTH', pageCount: number): number {
    // CloudConvert pricing: approximately $0.01 per minute
    // For PPTX, we estimate 1 minute per 10 slides
    const estimatedMinutes = pageCount / 10
    const costPerMinute = 0.01

    let totalCost = estimatedMinutes * costPerMinute

    if (targetFormat === 'BOTH') {
      totalCost *= 1.5 // 50% extra for both formats
    }

    return Math.round(totalCost * 100) / 100 // Round to 2 decimal places
  }
}

// Export single instance
export const cloudConvertService = new CloudConvertService()
