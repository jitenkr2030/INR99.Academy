// TypeScript types for WordPress Plugin Integration

// WordPress Site Connection
export interface WordPressSite {
  id: string;
  siteName: string;
  siteUrl: string;
  apiKey: string;
  apiSecret: string;
  isActive: boolean;
  licenseTier: string;
  licenseExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordPressSiteCreate {
  siteName: string;
  siteUrl: string;
  apiKey?: string;
  apiSecret?: string;
  licenseTier?: string;
}

// API Key Management
export interface APIKeyPair {
  key: string;
  secret: string;
  siteId: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Authentication Types
export interface WordPressAuthRequest {
  siteId: string;
  apiKey: string;
  apiSecret: string;
}

export interface WordPressToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface WordPressSSORequest {
  siteId: string;
  userId: string;
  email: string;
  name: string;
  redirectUrl?: string;
}

// Course Data Types
export interface WordPressCourse {
  siteId: string;
  courseId: string;
  externalId: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  currency: string;
  instructorId?: string;
  category?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordPressCourseSyncRequest {
  siteId: string;
  courses: WordPressCourse[];
}

// Live Class Types
export interface WordPressLiveSession {
  siteId: string;
  sessionId: string;
  title: string;
  description?: string;
  instructorId: string;
  scheduledAt: Date;
  duration: number;
  platform: 'zoom' | 'meet' | 'internal';
  meetingUrl?: string;
  meetingId?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface WordPressSessionSyncRequest {
  siteId: string;
  sessions: WordPressLiveSession[];
}

// PPTX Conversion Types
export interface WordPressPPTXJob {
  siteId: string;
  jobId: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputUrl?: string;
  progress: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordPressPPTXRequest {
  siteId: string;
  fileName: string;
  fileUrl: string;
  callbackUrl?: string;
}

// License Validation Types
export interface WordPressLicenseCheck {
  siteId: string;
  licenseKey: string;
  licenseTier: string;
  features: string[];
  isValid: boolean;
  message?: string;
}

export interface WordPressLicenseResponse {
  isValid: boolean;
  tier: string;
  features: string[];
  expiryDate: Date;
  message?: string;
}

// Webhook Types
export interface WordPressWebhookEvent {
  siteId: string;
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}

export interface WordPressWebhookConfig {
  siteId: string;
  webhookUrl: string;
  events: string[];
  secret: string;
  isActive: boolean;
}

// White-Label Types
export interface WordPressWhiteLabelConfig {
  siteId: string;
  tenantId: string;
  customDomain?: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
  };
  isActive: boolean;
}

export interface WordPressWhiteLabelRequest {
  siteId: string;
  siteName: string;
  customDomain?: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
  };
}

// Progress Tracking Types
export interface WordPressUserProgress {
  siteId: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  progress: number;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface WordPressProgressUpdateRequest {
  siteId: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  progress: number;
  completed?: boolean;
}

// API Response Types
export interface WordPressAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface WordPressPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
