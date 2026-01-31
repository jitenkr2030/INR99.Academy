# API Reference

This document provides comprehensive API documentation for the Automated Course Generation System. The API enables programmatic access to all generation capabilities, allowing integration with external systems, custom workflows, and automated pipelines.

## Base URL

All API endpoints are relative to the application root. In development environments, the base URL is `http://localhost:3000`. In production deployments, replace with your actual domain.

```http
https://your-domain.com
```

## Authentication

Currently, the API does not require authentication for development and testing purposes. For production deployments, implement appropriate authentication such as API keys, JWT tokens, or OAuth. Configure authentication middleware to protect endpoints that should not be publicly accessible.

## Content Type

All request bodies should use JSON formatting with the appropriate content type header:

```http
Content-Type: application/json
```

---

## Course Generation API

### Create Generation Job

Initiates a new course generation job. The endpoint accepts a complete course specification and returns immediately with a job ID. Actual generation occurs asynchronously.

**Endpoint**

```http
POST /api/auto-course-generation
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | The course title displayed in videos and materials |
| description | string | Yes | Course description for promotional content |
| instructorName | string | Yes | Name of the course instructor |
| instructorTitle | string | No | Professional title of the instructor |
| level | string | No | Course difficulty level: Beginner, Intermediate, or Advanced |
| duration | string | No | Total course duration, e.g., "10 hours" |
| category | string | No | Course category for organization |
| modules | array | Yes | Array of module objects containing lessons |
| branding | object | No | Custom color configuration for videos |

**Module Object**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Module title grouping related lessons |
| lessons | array | Yes | Array of lesson objects |

**Lesson Object**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Lesson title |
| content | string | Yes | Lesson content converted to audio |
| duration | string | No | Estimated lesson duration |

**Branding Object**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| primaryColor | string | No | Main brand color for video backgrounds |
| secondaryColor | string | No | Secondary color for accents and overlays |

**Example Request**

```json
{
  "title": "Complete Python Programming Bootcamp",
  "description": "Master Python programming from scratch with hands-on projects and real-world applications.",
  "instructorName": "Sarah Johnson",
  "instructorTitle": "Senior Software Engineer",
  "level": "Beginner",
  "duration": "25 hours",
  "category": "Programming",
  "branding": {
    "primaryColor": "#4f46e5",
    "secondaryColor": "#7c3aed"
  },
  "modules": [
    {
      "title": "Getting Started with Python",
      "lessons": [
        {
          "title": "Introduction to Python",
          "content": "Welcome to the Complete Python Programming Bootcamp. In this lesson, we will explore what Python is and why it has become one of the most popular programming languages in the world. Python is known for its simplicity, readability, and versatility.",
          "duration": "15 minutes"
        },
        {
          "title": "Setting Up Your Development Environment",
          "content": "Before we start coding, we need to set up our development environment. This involves installing Python on your computer, choosing a code editor or integrated development environment, and verifying that everything is working correctly.",
          "duration": "20 minutes"
        }
      ]
    },
    {
      "title": "Python Fundamentals",
      "lessons": [
        {
          "title": "Variables and Data Types",
          "content": "In this lesson, we will learn about variables and data types in Python. Variables are containers for storing data values, and Python has several built-in data types including strings, integers, floating-point numbers, and booleans.",
          "duration": "25 minutes"
        }
      ]
    }
  ]
}
```

**Success Response**

```json
{
  "success": true,
  "jobId": "course-1709312345123-abc123def",
  "message": "Course generation started. Use the job ID to track progress."
}
```

**Error Response**

```json
{
  "success": false,
  "error": "Missing required fields: title, description, instructorName"
}
```

**Status Codes**

| Code | Description |
|------|-------------|
| 200 | Job created successfully |
| 400 | Invalid request data |
| 500 | Server error |

---

### Get Job Status

Retrieves the current status of a generation job. This endpoint supports both single job queries and job listing operations.

**Endpoint**

```http
GET /api/auto-course-generation?jobId={jobId}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | No | Specific job ID to query. If omitted, returns job history. |

**Get Single Job Response**

```json
{
  "success": true,
  "job": {
    "id": "course-1709312345123-abc123def",
    "status": "processing",
    "progress": 45,
    "currentStep": "Generating audio for Variables and Data Types...",
    "courseData": {
      "title": "Complete Python Programming Bootcamp",
      "description": "Master Python programming from scratch...",
      "moduleCount": 2,
      "lessonCount": 3
    },
    "results": {
      "courseIntro": "/videos/course-intro-abc123.mp4",
      "courseThumbnail": "/videos/thumbnail-abc123.mp4",
      "lessons": [
        {
          "id": "lesson-1709312345123-0",
          "title": "Introduction to Python",
          "audioUrl": "/audio/lesson-0-abc123.mp3",
          "videoUrl": "/videos/lesson-preview-0-abc123.mp4",
          "status": "video_completed"
        },
        {
          "id": "lesson-1709312345123-1",
          "title": "Setting Up Your Development Environment",
          "audioUrl": "/audio/lesson-1-abc123.mp3",
          "videoUrl": "/videos/lesson-preview-1-abc123.mp4",
          "status": "video_completed"
        },
        {
          "id": "lesson-1709312345123-2",
          "title": "Variables and Data Types",
          "audioUrl": "/audio/lesson-2-abc123.mp3",
          "videoUrl": null,
          "status": "audio_completed"
        }
      ]
    },
    "createdAt": "2024-03-01T10:00:00.000Z",
    "completedAt": null
  }
}
```

**Get Job History Response**

```json
{
  "success": true,
  "jobs": [
    {
      "id": "course-1709312345123-abc123def",
      "title": "Complete Python Programming Bootcamp",
      "status": "completed",
      "progress": 100,
      "currentStep": "Course generation completed!",
      "createdAt": "2024-03-01T10:00:00.000Z"
    },
    {
      "id": "course-1709315678901-xyz789ghi",
      "title": "Data Science Fundamentals",
      "status": "processing",
      "progress": 25,
      "currentStep": "Generating course introduction video...",
      "createdAt": "2024-03-02T14:30:00.000Z"
    }
  ]
}
```

**Job Status Values**

| Status | Description |
|--------|-------------|
| pending | Job created but not yet started |
| processing | Job currently executing |
| completed | Job finished successfully |
| failed | Job encountered an error |

**Lesson Status Values**

| Status | Description |
|--------|-------------|
| pending | Lesson not yet processed |
| audio_generating | Audio generation in progress |
| audio_completed | Audio generated successfully |
| video_generating | Video rendering in progress |
| video_completed | Video rendered successfully |
| failed | Processing failed |

**Status Codes**

| Code | Description |
|------|-------------|
| 200 | Status retrieved successfully |
| 404 | Job not found |
| 500 | Server error |

---

## Text-to-Speech API

### Preview Voice

Generates a short audio preview using specified text and voice settings. This endpoint is useful for testing voice selection before initiating full course generation.

**Endpoint**

```http
POST /api/tts/preview
GET /api/tts/preview
```

**POST Request Body (Generate Preview)**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to convert to speech |
| voiceId | string | Yes | ElevenLabs voice ID to use |

**GET Response (List Voices)**

```json
{
  "success": true,
  "voices": [
    {
      "voice_id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "category": "en",
      "description": "Clear, professional female voice",
      "labels": {
        "gender": "female",
        "accent": "american"
      }
    },
    {
      "voice_id": "AZnzlk1XvdvUeBnulIWH",
      "name": "Drew",
      "category": "en",
      "description": "Deep, authoritative male voice",
      "labels": {
        "gender": "male",
        "accent": "american"
      }
    }
  ]
}
```

**POST Success Response**

```json
{
  "success": true,
  "audioUrl": "https://api.elevenlabs.io/v1/audio/..."
}
```

---

### Generate Audio

Generates audio from text for a specific lesson. This endpoint is used internally by the course generation pipeline but can also be called directly for custom workflows.

**Endpoint**

```http
POST /api/tts/generate
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Lesson content to convert to audio |
| voiceId | string | Yes | ElevenLabs voice ID |
| lessonId | string | No | Optional lesson identifier for tracking |
| courseId | string | No | Optional course identifier for tracking |
| getStatsOnly | boolean | No | If true, returns usage statistics instead of generating |

**Example Request**

```json
{
  "text": "Welcome to the Complete Python Programming Bootcamp. In this lesson, we will explore what Python is and why it has become one of the most popular programming languages in the world.",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "lessonId": "lesson-001",
  "courseId": "course-001"
}
```

**Success Response**

```json
{
  "success": true,
  "audioUrl": "/audio/lesson-001-1709312345.mp3",
  "duration": 15,
  "characterCount": 120
}
```

**Response with Usage Stats**

```json
{
  "success": true,
  "usageStats": {
    "characterLimit": 10000,
    "characterCount": 3500,
    "characterRemaining": 6500,
    "includedCharacters": 10000
  }
}
```

---

### Batch Audio Generation

Generates audio for multiple text segments in a single request. This endpoint is optimized for processing multiple lessons efficiently.

**Endpoint**

```http
POST /api/tts/batch
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| items | array | Yes | Array of generation requests |

**Items Array Object**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to convert |
| voiceId | string | Yes | Voice to use |
| lessonId | string | Yes | Unique lesson identifier |

**Example Request**

```json
{
  "items": [
    {
      "text": "Lesson one content here...",
      "voiceId": "21m00Tcm4TlvDq8ikWAM",
      "lessonId": "lesson-1"
    },
    {
      "text": "Lesson two content here...",
      "voiceId": "21m00Tcm4TlvDq8ikWAM",
      "lessonId": "lesson-2"
    }
  ]
}
```

---

## Video Generation API

### Course Introduction Video

Generates an engaging course introduction video with animated titles and branding.

**Endpoint**

```http
POST /api/video-generation/course-intro
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Course title displayed in video |
| instructorName | string | Yes | Instructor's name |
| instructorTitle | string | Yes | Instructor's professional title |
| duration | string | Yes | Course duration |
| level | string | Yes | Difficulty level |
| category | string | Yes | Course category |
| branding | object | No | Color configuration |

**Example Request**

```json
{
  "title": "Complete Python Programming Bootcamp",
  "instructorName": "Sarah Johnson",
  "instructorTitle": "Senior Software Engineer",
  "duration": "25 hours",
  "level": "Beginner",
  "category": "Programming",
  "branding": {
    "primaryColor": "#4f46e5",
    "secondaryColor": "#7c3aed"
  }
}
```

**Success Response**

```json
{
  "success": true,
  "videoUrl": "/videos/course-intro-1709312345.mp4",
  "duration": 10
}
```

---

### Lesson Preview Video

Generates a preview video for an individual lesson with synchronized audio.

**Endpoint**

```http
POST /api/video-generation/lesson-preview
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lessonTitle | string | Yes | Lesson title |
| lessonNumber | number | Yes | Lesson number in sequence |
| duration | string | Yes | Lesson duration |
| keyTopics | array | Yes | Array of key topics (max 5) |
| courseTitle | string | Yes | Parent course title |
| instructorName | string | Yes | Instructor's name |
| audioUrl | string | Yes | URL of generated audio file |
| branding | object | No | Color configuration |

**Example Request**

```json
{
  "lessonTitle": "Introduction to Python",
  "lessonNumber": 1,
  "duration": "15 minutes",
  "keyTopics": ["Python Basics", "History", "Applications"],
  "courseTitle": "Complete Python Programming Bootcamp",
  "instructorName": "Sarah Johnson",
  "audioUrl": "https://your-domain.com/audio/lesson-1.mp3",
  "branding": {
    "primaryColor": "#4f46e5",
    "secondaryColor": "#7c3aed"
  }
}
```

---

### Course Thumbnail Video

Generates an animated thumbnail video for course promotion.

**Endpoint**

```http
POST /api/video-generation/course-thumbnail
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Course title |
| instructorName | string | Yes | Instructor's name |
| level | string | Yes | Difficulty level |
| duration | string | Yes | Course duration |
| studentCount | number | Yes | Number of enrolled students |
| rating | number | Yes | Course rating (0-5) |
| category | string | Yes | Course category |
| branding | object | No | Color configuration |

**Example Request**

```json
{
  "title": "Complete Python Programming Bootcamp",
  "instructorName": "Sarah Johnson",
  "level": "Beginner",
  "duration": "25 hours",
  "studentCount": 15000,
  "rating": 4.8,
  "category": "Programming",
  "branding": {
    "primaryColor": "#4f46e5",
    "secondaryColor": "#7c3aed"
  }
}
```

---

### Batch Video Generation

Generates multiple videos in a single request for efficient processing.

**Endpoint**

```http
POST /api/video-generation/batch
```

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobs | array | Yes | Array of video generation requests |

**Job Object**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Video type: course-intro, lesson-preview, or course-thumbnail |
| data | object | Yes | Video-specific data matching individual endpoint schemas |

**Example Request**

```json
{
  "jobs": [
    {
      "type": "course-intro",
      "data": {
        "title": "Complete Python Bootcamp",
        "instructorName": "Sarah Johnson",
        "instructorTitle": "Senior Engineer",
        "duration": "25 hours",
        "level": "Beginner",
        "category": "Programming"
      }
    },
    {
      "type": "course-thumbnail",
      "data": {
        "title": "Complete Python Bootcamp",
        "instructorName": "Sarah Johnson",
        "level": "Beginner",
        "duration": "25 hours",
        "studentCount": 15000,
        "rating": 4.8,
        "category": "Programming"
      }
    }
  ]
}
```

---

## Error Handling

### Error Response Format

All API errors return responses in the following format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common Error Codes

| HTTP Code | Error Type | Description |
|-----------|------------|-------------|
| 400 | Validation Error | Request data missing or invalid |
| 401 | Unauthorized | Authentication required or invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal error occurred |

### Rate Limiting

API requests may be rate limited based on your service tier. When rate limited, responses include a `Retry-After` header indicating when requests can resume. Implement exponential backoff for retry logic to avoid triggering rate limit extensions.

### Webhook Notifications

For production integrations, consider implementing webhook notifications to receive alerts when jobs complete or fail. This approach eliminates the need for polling and enables real-time workflow automation.
