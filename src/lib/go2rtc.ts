/**
 * go2RTC Service
 * 
 * This module provides integration with go2rtc for real-time video streaming.
 * go2rtc is a lightweight, zero-dependency streaming server that supports
 * WebRTC, RTSP, RTMP, and other protocols.
 * 
 * @see https://github.com/AlexxIT/go2rtc
 */

// Type definitions for stream configuration
interface StreamConfig {
  name: string;
  url?: string;
}

// Type definitions for stream status
interface StreamStatus {
  name: string;
  status: 'idle' | 'broadcasting' | 'recording';
  viewers: number;
  bitrate: number;
}

/**
 * Go2RTCService handles communication with the go2rtc server
 */
class Go2RTCService {
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = process.env.GO2RTC_API_URL || 'http://localhost:1984';
    this.apiToken = process.env.GO2RTC_API_TOKEN || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`go2rtc API error: ${response.status} - ${error}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text as unknown as T;
    }
  }

  async createStream(config: StreamConfig): Promise<void> {
    await this.request('/api/streams', {
      method: 'POST',
      body: JSON.stringify({
        name: config.name,
        ...(config.url && { url: config.url }),
      }),
    });
  }

  async deleteStream(streamName: string): Promise<void> {
    await this.request(`/api/streams/${streamName}`, {
      method: 'DELETE',
    });
  }

  async getStreamStatus(streamName: string): Promise<StreamStatus> {
    try {
      const streams = await this.request<Record<string, unknown>>('/api/streams');
      const stream = streams[streamName] as Record<string, unknown> | undefined;
      
      if (!stream) {
        return {
          name: streamName,
          status: 'idle',
          viewers: 0,
          bitrate: 0,
        };
      }

      return {
        name: streamName,
        status: (stream.status as StreamStatus['status']) || 'idle',
        viewers: (stream.viewers as number) || 0,
        bitrate: (stream.bitrate as number) || 0,
      };
    } catch {
      return {
        name: streamName,
        status: 'idle',
        viewers: 0,
        bitrate: 0,
      };
    }
  }

  async startRecording(streamName: string): Promise<string> {
    const response = await this.request<{ path: string }>(
      `/api/recordings/start?src=${streamName}`
    );
    return response.path;
  }

  async stopRecording(streamName: string): Promise<void> {
    await this.request(`/api/recordings/stop?src=${streamName}`, {
      method: 'POST',
    });
  }

  getWHIPUrl(streamName: string): string {
    return `${this.baseUrl}/api/whip?src=${streamName}`;
  }

  getWHEPUrl(streamName: string): string {
    return `${this.baseUrl}/api/whep?src=${streamName}`;
  }
}

export const go2rtc = new Go2RTCService();
export type { StreamConfig, StreamStatus };
