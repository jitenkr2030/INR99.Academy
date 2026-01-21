# go2rtc Integration Technical Guide

## INR99 Academy Live Learning Feature

**Document Version:** 1.0  
**Date:** January 21, 2026  
**Status:** Implementation Guide

---

## 1. Introduction

This document provides comprehensive technical guidance for integrating go2rtc into the INR99 Academy live learning feature. The integration transforms the current video placeholder implementation into fully functional real-time video streaming, enabling instructors to broadcast live sessions and students to view content with minimal latency. The guide covers architecture, implementation details, API specifications, and deployment procedures for the development and operations teams.

The go2rtc project serves as the media server handling all video and audio transmission, while the existing INR99 Academy platform handles session management, authentication, attendance tracking, and business logic. This separation of concerns maintains clean architectural boundaries while leveraging each system's strengths. The existing database schema already includes fields for room identification and recording configuration that align naturally with go2rtc's capabilities, minimizing the changes required to the data layer.

The integration implements the WHIP (WebRTC-HTTP Ingestion Protocol) for instructor broadcasting and WHEP (WebRTC-HTTP Egress Protocol) for student viewing, both of which are supported natively by go2rtc. This approach uses standard HTTP APIs for signaling rather than WebSocket connections, simplifying the implementation and improving compatibility with existing infrastructure including reverse proxies and load balancers.

## 2. Architecture Overview

### 2.1 System Architecture

The integration follows a hub-and-spoke architecture where the INR99 Academy platform serves as the control plane coordinating sessions, and go2rtc serves as the media plane handling all audio and video traffic. When users interact with the live session feature, the platform handles API requests for session creation, attendance tracking, and user management, while go2rtc establishes and manages WebRTC connections for media transmission.

The architecture separates concerns between the control plane and media plane. The control plane manages business logic including user authentication, subscription verification, session scheduling, and attendance tracking. The media plane handles real-time media transmission including video capture, encoding, transmission, decoding, and rendering. This separation enables independent scaling of each component based on their respective load characteristics and resource requirements.

The signaling layer uses HTTP-based protocols (WHIP and WHEP) to exchange WebRTC session descriptions between clients and the media server. This approach differs from traditional WebSocket-based signaling by using standard REST APIs for offer/answer exchange and polling for candidate discovery. The HTTP-based approach simplifies deployment in environments with restrictive network policies and enables easy integration with existing API infrastructure.

### 2.2 Component Interaction Flow

The interaction flow begins when an instructor creates a live session through the platform interface. The platform creates a session record in the database and simultaneously initializes a corresponding stream in go2rtc. The stream is identified by the session identifier, linking the platform session with the video stream. The instructor receives stream configuration including the broadcasting URL and authentication credentials.

When the session begins, the instructor's browser captures video and audio from the local device using the MediaDevices API. The browser creates a WebRTC peer connection to the go2rtc server using the WHIP protocol, sending an SDP offer that describes the media capabilities. The go2rtc server responds with an SDP answer, and the ICE negotiation proceeds to establish the peer-to-peer connection. Once connected, the instructor's media flows to go2rtc for distribution.

Students joining the session follow a similar flow using the WHEP protocol to consume the stream. The student's browser establishes a WebRTC connection to receive the instructor's media. The platform verifies enrollment and subscription status before providing the stream configuration. The student's WebRTC client connects to go2rtc and receives the media stream for local playback.

Throughout the session, the platform maintains awareness of participant state through its existing attendance tracking system. The go2rtc server handles media transmission while the platform handles access control and session management. This separation ensures that media connectivity issues do not affect the core session management functionality.

## 3. Configuration

### 3.1 Environment Variables

The integration requires several environment variables to be added to the INR99 Academy configuration. These variables specify the go2rtc server location, authentication credentials, and storage paths. Add the following entries to the project's environment configuration file.

```bash
# go2RTC Configuration
GO2RTC_API_URL="http://localhost:1984"
GO2RTC_API_TOKEN="your-secure-random-token-here"
GO2RTC_STREAM_HOST="localhost"
GO2RTC_STREAM_PORT="8555"
GO2RTC_RECORDING_PATH="./storage/recordings"
GO2RTC_STUN_SERVER="stun:stun.l.google.com:19302"
```

The GO2RTC_API_URL specifies the base URL for the go2rtc management API. In production deployments, this URL points to the internal Docker network address or internal service URL. The GO2RTC_API_TOKEN provides authentication for API requests, preventing unauthorized stream management operations. The stream host and port configure the WebRTC listening endpoints. The recording path specifies where go2rtc stores recorded video files.

### 3.2 go2rtc Server Configuration

Create a go2rtc.yaml configuration file in the project root or deployment directory. This file configures the go2rtc server behavior including API access, protocol listeners, and recording settings.

```yaml
# go2rtc Configuration for INR99 Academy

# API Configuration
api:
  listen: "0.0.0.0:1984"
  origin: "*"

# RTSP Configuration
rtsp:
  listen: "0.0.0.0:8554"

# WebRTC Configuration
webrtc:
  listen: "0.0.0.0:8555"
  # STUN servers for NAT traversal
  stun:
    - "stun.l.google.com:19302"
    - "stun1.l.google.com:19302"

# Recording Configuration
recorders:
  mp4:
    path: "./storage/recordings/{stream_id}/{time}.mp4"

# Logging Configuration
logs:
  level: "info"
```

The configuration enables the REST API on port 1984 for stream management operations. The RTSP listener on port 8554 provides compatibility with existing camera infrastructure if needed. The WebRTC listener on port 8555 accepts incoming peer connections from browsers. The STUN servers enable NAT traversal for participants behind standard network address translators.

### 3.3 Docker Deployment

For containerized deployments, use the official go2rtc Docker image with appropriate port mappings and volume mounts for recording storage.

```bash
# Docker run command for go2rtc
docker run -d \
  --name go2rtc \
  -p 1984:1984 \
  -p 8554:8554 \
  -p 8555:8555/udp \
  -p 8555:8555/tcp \
  -v ./storage/recordings:/recordings \
  -v ./go2rtc.yaml:/go2rtc.yaml \
  alexxit/go2rtc:latest
```

The port mappings expose the API, RTSP, and WebRTC ports to the host network. The volume mount preserves recorded video files to persistent storage. The configuration file mount provides custom settings for the deployment environment.

## 4. Backend Implementation

### 4.1 go2rtc Utility Library

The integration includes a utility library that encapsulates all go2rtc API interactions. This library provides methods for stream creation, deletion, recording management, and status checking.

```typescript
// src/lib/go2rtc.ts

interface StreamConfig {
  name: string;
  url?: string;
}

interface RecordingConfig {
  streamName: string;
  outputPath: string;
}

interface StreamStatus {
  name: string;
  status: 'idle' | 'broadcasting' | 'recording';
  viewers: number;
  bitrate: number;
}

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

    return response.json();
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

  async getWHIPUrl(streamName: string): string {
    return `${this.baseUrl}/api/whip?src=${streamName}`;
  }

  async getWHEPUrl(streamName: string): string {
    return `${this.baseUrl}/api/whep?src=${streamName}`;
  }
}

export const go2rtc = new Go2RTCService();
export type { StreamConfig, RecordingConfig, StreamStatus };
```

The utility library provides a clean interface for all go2rtc operations. The request method handles authentication headers and error handling consistently across all API calls. The stream management methods create and delete dynamic streams as sessions begin and end. Recording methods control the capture of live sessions to video files.

### 4.2 Stream Management API

The stream management API provides endpoints for creating video streams when sessions begin and cleaning up resources when sessions end.

```typescript
// src/app/api/go2rtc/streams/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, hostId } = body;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.hostId !== hostId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const streamName = `session_${sessionId}`;

    await go2rtc.createStream({ name: streamName });

    await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        roomId: streamName,
        roomUrl: go2rtc.getWHEPUrl(streamName),
      },
    });

    return NextResponse.json({
      success: true,
      streamName,
      whipUrl: go2rtc.getWHIPUrl(streamName),
      whepUrl: go2rtc.getWHEPUrl(streamName),
    });
  } catch (error) {
    console.error('Failed to create stream:', error);
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const streamName = `session_${sessionId}`;

    await go2rtc.deleteStream(streamName);

    await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        roomId: null,
        roomUrl: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete stream:', error);
    return NextResponse.json(
      { error: 'Failed to delete stream' },
      { status: 500 }
    );
  }
}
```

### 4.3 Signaling Proxy API

The signaling proxy handles WebRTC offer/answer exchange between clients and go2rtc, enforcing access control.

```typescript
// src/app/api/go2rtc/signal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface SignalRequest {
  sessionId: string;
  sdp: string;
  type: 'offer' | 'answer';
  protocol: 'whip' | 'whep';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sdp, type, protocol } = body as SignalRequest;

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (protocol === 'whep') {
      const hasAccess = await verifySessionAccess(sessionId, session.user.id);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    if (protocol === 'whip' && liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Only host can broadcast' }, { status: 403 });
    }

    const streamName = liveSession.roomId || `session_${sessionId}`;

    const streamUrl = protocol === 'whip' 
      ? go2rtc.getWHIPUrl(streamName)
      : go2rtc.getWHEPUrl(streamName);

    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sdp',
      },
      body: sdp,
    });

    if (!response.ok) {
      throw new Error(`SDP exchange failed: ${response.statusText}`);
    }

    const responseSdp = await response.text();

    return NextResponse.json({
      sdp: responseSdp,
      type: 'answer',
    });
  } catch (error) {
    console.error('Signal exchange failed:', error);
    return NextResponse.json(
      { error: 'Signal exchange failed' },
      { status: 500 }
    );
  }
}

async function verifySessionAccess(sessionId: string, userId: string): Promise<boolean> {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    include: {
      course: {
        include: {
          enrollments: { where: { userId } },
        },
      },
    },
  });

  if (session?.courseId && session.course.enrollments.length > 0) {
    return true;
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      endDate: { gte: new Date() },
    },
  });

  return !!subscription;
}
```

### 4.4 Recording Management API

The recording management API controls session recording functionality.

```typescript
// src/app/api/go2rtc/recording/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { go2rtc } from '@/lib/go2rtc';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action } = body;

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (liveSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const streamName = liveSession.roomId || `session_${sessionId}`;

    if (action === 'start') {
      const recordingPath = await go2rtc.startRecording(streamName);
      
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: {
          isRecorded: true,
          recordingUrl: recordingPath,
        },
      });

      return NextResponse.json({ success: true, recordingPath });
    } 
    
    if (action === 'stop') {
      await go2rtc.stopRecording(streamName);
      
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: { isRecorded: false },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Recording operation failed:', error);
    return NextResponse.json(
      { error: 'Recording operation failed' },
      { status: 500 }
    );
  }
}
```

## 5. Frontend Implementation

### 5.1 Host Broadcaster Component

The host broadcaster component handles instructor video and audio capture, WebRTC connection establishment, and stream management.

```typescript
// src/components/live-sessions/Broadcaster.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface BroadcasterProps {
  sessionId: string;
  streamUrl: string;
  iceServers: RTCIceServer[];
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
  onError?: (error: Error) => void;
}

interface BroadcastState {
  status: 'idle' | 'connecting' | 'live' | 'error';
  error?: string;
}

export function Broadcaster({
  sessionId,
  streamUrl,
  iceServers,
  onStreamStart,
  onStreamEnd,
  onError,
}: BroadcasterProps) {
  const [state, setState] = useState<BroadcastState>({ status: 'idle' });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setState({ status: 'idle' });
    onStreamEnd?.();
  }, [onStreamEnd]);

  const startBroadcast = useCallback(async () => {
    try {
      setState({ status: 'connecting' });

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = localStream;

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }

      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;

      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendICECandidate(event.candidate);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case 'connected':
            setState({ status: 'live' });
            onStreamStart?.();
            break;
          case 'disconnected':
          case 'failed':
            setState({ status: 'error', error: 'Connection lost' });
            cleanup();
            break;
        }
      };

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await peerConnection.setLocalDescription(offer);

      const answer = await exchangeSDP(offer.sdp!, 'offer');
      await peerConnection.setRemoteDescription(answer);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to start broadcast');
      setState({ status: 'error', error: err.message });
      onError?.(err);
    }
  }, [iceServers, onStreamStart, onError, cleanup]);

  const stopBroadcast = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="broadcaster">
      <video ref={videoRef} autoPlay muted playsInline className="local-video" />
      
      <div className="broadcast-controls">
        <span className={`status status-${state.status}`}>{state.status}</span>
        
        <button
          onClick={isAudioEnabled ? toggleAudio : undefined}
          disabled={state.status !== 'live'}
          className={`btn btn-audio ${isAudioEnabled ? 'enabled' : 'disabled'}`}
        >
          {isAudioEnabled ? 'Mute' : 'Unmute'}
        </button>
        
        <button
          onClick={isVideoEnabled ? toggleVideo : undefined}
          disabled={state.status !== 'live'}
          className={`btn btn-video ${isVideoEnabled ? 'enabled' : 'disabled'}`}
        >
          {isVideoEnabled ? 'Stop Video' : 'Start Video'}
        </button>
        
        {state.status === 'idle' && (
          <button onClick={startBroadcast} className="btn btn-start">Start Broadcast</button>
        )}
        
        {state.status === 'live' && (
          <button onClick={stopBroadcast} className="btn btn-stop">End Broadcast</button>
        )}
      </div>
    </div>
  );
}

async function sendICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
  await fetch('/api/go2rtc/signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate }),
  });
}

async function exchangeSDP(sdp: string, type: 'offer' | 'answer'): Promise<RTCSessionDescriptionInit> {
  const response = await fetch('/api/go2rtc/signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sdp, type, protocol: 'whip' }),
  });

  if (!response.ok) throw new Error('SDP exchange failed');
  return response.json();
}
```

### 5.2 Viewer Component

The viewer component handles student video and audio reception using the WHEP protocol.

```typescript
// src/components/live-sessions/Viewer.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ViewerProps {
  sessionId: string;
  streamUrl: string;
  iceServers: RTCIceServer[];
  onError?: (error: Error) => void;
}

interface ViewerState {
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error?: string;
}

export function Viewer({
  sessionId,
  streamUrl,
  iceServers,
  onError,
}: ViewerProps) {
  const [state, setState] = useState<ViewerState>({ status: 'idle' });
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startViewing = useCallback(async () => {
    try {
      setState({ status: 'connecting' });

      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;

      peerConnection.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        
        event.streams[0].getTracks().forEach(track => {
          if (remoteStreamRef.current) {
            remoteStreamRef.current.addTrack(track);
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = remoteStreamRef.current;
          videoRef.current.play().catch(console.error);
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendICECandidate(event.candidate);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        switch (peerConnection.connectionState) {
          case 'connected':
            setState({ status: 'connected' });
            break;
          case 'disconnected':
          case 'failed':
            setState({ status: 'error', error: 'Connection lost' });
            break;
        }
      };

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnection.setLocalDescription(offer);

      const answer = await exchangeSDP(offer.sdp!, 'offer');
      await peerConnection.setRemoteDescription(answer);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to connect');
      setState({ status: 'error', error: err.message });
      onError?.(err);
    }
  }, [iceServers, onError]);

  const stopViewing = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    remoteStreamRef.current = null;
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState({ status: 'idle' });
  }, []);

  useEffect(() => {
    startViewing();
    
    return () => {
      stopViewing();
    };
  }, [startViewing, stopViewing]);

  return (
    <div className="viewer">
      <video ref={videoRef} autoPlay playsInline className="remote-video" />
      
      <div className="viewer-controls">
        <span className={`status status-${state.status}`}>{state.status}</span>
        
        {state.status === 'idle' && (
          <button onClick={startViewing} className="btn btn-connect">Connect</button>
        )}
        
        {state.status === 'connected' && (
          <button onClick={stopViewing} className="btn btn-disconnect">Disconnect</button>
        )}
      </div>
    </div>
  );
}

async function sendICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
  await fetch('/api/go2rtc/signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate }),
  });
}

async function exchangeSDP(sdp: string, type: 'offer' | 'answer'): Promise<RTCSessionDescriptionInit> {
  const response = await fetch('/api/go2rtc/signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sdp, type, protocol: 'whep' }),
  });

  if (!response.ok) throw new Error('SDP exchange failed');
  return response.json();
}
```

### 5.3 Session Page Integration

The session page integrates the broadcaster and viewer components based on the user's role.

```typescript
// src/app/live-sessions/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Broadcaster } from '@/components/live-sessions/Broadcaster';
import { Viewer } from '@/components/live-sessions/Viewer';
import { notFound, redirect } from 'next/navigation';

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
  });

  if (!liveSession) {
    notFound();
  }

  const isHost = liveSession.hostId === session.user.id;
  const streamUrl = liveSession.roomUrl || `${process.env.GO2RTC_API_URL}/api/whep?src=session_${id}`;
  
  const iceServers: RTCIceServer[] = [
    { urls: process.env.GO2RTC_STUN_SERVER || 'stun:stun.l.google.com:19302' },
  ];

  return (
    <div className="session-page">
      <header className="session-header">
        <h1>{liveSession.title}</h1>
        <span className={`status status-${liveSession.status.toLowerCase()}`}>
          {liveSession.status}
        </span>
      </header>

      <main className="session-content">
        {isHost ? (
          <Broadcaster
            sessionId={id}
            streamUrl={streamUrl}
            iceServers={iceServers}
            onStreamStart={() => console.log('Broadcast started')}
            onStreamEnd={() => console.log('Broadcast ended')}
            onError={(error) => console.error('Broadcast error:', error)}
          />
        ) : (
          <Viewer
            sessionId={id}
            streamUrl={streamUrl}
            iceServers={iceServers}
            onError={(error) => console.error('Viewer error:', error)}
          />
        )}
      </main>
    </div>
  );
}
```

## 6. Session Lifecycle Integration

### 6.1 Session Creation Enhancement

```typescript
// Enhanced session creation logic

async function createSessionWithVideo(data: CreateSessionRequest): Promise<LiveSession> {
  const session = await prisma.liveSession.create({
    data: {
      title: data.title,
      description: data.description,
      scheduledAt: new Date(data.scheduledAt),
      duration: data.duration,
      hostId: data.hostId,
      courseId: data.courseId,
      maxParticipants: data.maxParticipants,
      isRecorded: data.isRecorded || false,
      status: 'SCHEDULED',
    },
  });

  if (data.enableVideo !== false) {
    try {
      const streamName = `session_${session.id}`;
      
      await go2rtc.createStream({ name: streamName });

      await prisma.liveSession.update({
        where: { id: session.id },
        data: {
          roomId: streamName,
          roomUrl: go2rtc.getWHEPUrl(streamName),
        },
      });

      console.log(`Created go2rtc stream for session ${session.id}: ${streamName}`);
    } catch (error) {
      console.error('Failed to prepare video stream:', error);
    }
  }

  return session;
}
```

### 6.2 Session End Cleanup

```typescript
// Session cleanup logic

async function endSessionWithCleanup(sessionId: string): Promise<void> {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.isRecorded && session.roomId) {
    try {
      await go2rtc.stopRecording(session.roomId);
      
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: {
          isRecorded: false,
          recordingStatus: 'completed',
        },
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  await prisma.liveSession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
    },
  });

  if (session.roomId) {
    try {
      await go2rtc.deleteStream(session.roomId);
      console.log(`Cleaned up go2rtc stream: ${session.roomId}`);
    } catch (error) {
      console.error('Failed to cleanup stream:', error);
    }
  }
}
```

## 7. Deployment

### 7.1 Production Deployment

```nginx
# Nginx configuration for go2rtc reverse proxy

server {
    listen 443 ssl;
    server_name stream.inr99academy.com;

    ssl_certificate /etc/nginx/ssl/stream.inr99academy.com.crt;
    ssl_certificate_key /etc/nginx/ssl/stream.inr99academy.com.key;

    location /api/whep {
        proxy_pass http://go2rtc:8555/api/whep;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://go2rtc:1984/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /health {
        proxy_pass http://go2rtc:1984/api/streams;
        proxy_http_version 1.1;
    }
}

server {
    listen 80;
    server_name stream.inr99academy.com;
    return 301 https://$server_name$request_uri;
}
```

### 7.2 Firewall Configuration

```bash
# Allow UDP ports for WebRTC
sudo ufw allow 8555/udp
sudo ufw allow 10000:60000/udp
```

## 8. Troubleshooting

### 8.1 Common Issues

Connection failures typically result from network configuration issues. Verify that STUN servers are correctly configured and that TURN relay is available for participants behind symmetric NAT. Check browser console logs for ICE candidate failures and connection state changes.

Recording failures may result from incorrect file path permissions or storage capacity issues. Verify that the recording directory exists and is writable by the go2rtc process. Check available disk space and rotate or archive old recordings as needed.

Latency issues may result from network distance between participants and the go2rtc server or from insufficient server resources. Consider deploying go2rtc instances in multiple regions for globally distributed audiences.

### 8.2 Monitoring

Monitor the following metrics to ensure healthy operation. The go2rtc API provides stream statistics including viewer count, bitrate, and connection state. The INR99 Academy platform should track session creation success rates, video connectivity failures, and recording completion rates.

Health check endpoints should verify that go2rtc instances are responsive and able to create new streams. Configure alerting for failed health checks and elevated error rates.

---

**Document End**
