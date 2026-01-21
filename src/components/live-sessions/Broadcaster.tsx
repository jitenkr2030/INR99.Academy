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

      // Capture media from camera and microphone
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

      // Display local preview
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;

      // Add local tracks to the connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendICECandidate(sessionId, event.candidate);
        }
      };

      // Handle connection state changes
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

      // Create and send offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
      });
      await peerConnection.setLocalDescription(offer);

      // Exchange SDP with signaling server
      const answer = await exchangeSDP(sessionId, offer.sdp!, 'offer', 'whip');

      // Set remote description
      await peerConnection.setRemoteDescription(answer);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to start broadcast');
      setState({ status: 'error', error: err.message });
      onError?.(err);
    }
  }, [sessionId, iceServers, onStreamStart, onError, cleanup]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="broadcaster-container">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="local-video"
        />
        
        {state.status === 'idle' && (
          <div className="video-placeholder">
            <p>Click "Start Broadcast" to begin streaming</p>
          </div>
        )}
        
        {state.status === 'connecting' && (
          <div className="video-loading">
            <p>Connecting to broadcast...</p>
          </div>
        )}
        
        {state.status === 'error' && (
          <div className="video-error">
            <p>Error: {state.error}</p>
            <button onClick={startBroadcast}>Retry</button>
          </div>
        )}
      </div>
      
      <div className="broadcast-controls">
        <div className="status-indicator">
          <span className={`status-badge status-${state.status}`}>
            {state.status.toUpperCase()}
          </span>
        </div>
        
        <div className="control-buttons">
          <button
            onClick={isAudioEnabled ? toggleAudio : undefined}
            disabled={state.status !== 'live'}
            className={`control-btn btn-audio ${isAudioEnabled ? 'enabled' : 'disabled'}`}
            title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isAudioEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
            <span>{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
          </button>
          
          <button
            onClick={isVideoEnabled ? toggleVideo : undefined}
            disabled={state.status !== 'live'}
            className={`control-btn btn-video ${isVideoEnabled ? 'enabled' : 'disabled'}`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
            <span>{isVideoEnabled ? 'Stop Video' : 'Start Video'}</span>
          </button>
          
          {state.status === 'idle' && (
            <button onClick={startBroadcast} className="control-btn btn-start primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Start Broadcast</span>
            </button>
          )}
          
          {state.status === 'live' && (
            <button onClick={stopBroadcast} className="control-btn btn-stop danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>End Broadcast</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

async function sendICECandidate(sessionId: string, candidate: RTCIceCandidateInit): Promise<void> {
  try {
    await fetch('/api/go2rtc/signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        candidate,
        type: 'candidate',
        protocol: 'whip',
      }),
    });
  } catch (error) {
    console.error('Failed to send ICE candidate:', error);
  }
}

async function exchangeSDP(
  sessionId: string,
  sdp: string,
  type: 'offer' | 'answer',
  protocol: 'whip' | 'whep'
): Promise<RTCSessionDescriptionInit> {
  const response = await fetch('/api/go2rtc/signal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      sdp,
      type,
      protocol,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SDP exchange failed: ${error}`);
  }

  return response.json();
}
