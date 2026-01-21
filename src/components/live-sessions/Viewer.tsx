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

      // Create peer connection
      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        
        event.streams[0].getTracks().forEach(track => {
          if (remoteStreamRef.current) {
            remoteStreamRef.current.addTrack(track);
          }
        });

        // Render remote stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStreamRef.current;
          videoRef.current.play().catch(console.error);
        }
      };

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
            setState({ status: 'connected' });
            break;
          case 'disconnected':
            setState({ status: 'idle' });
            break;
          case 'failed':
            setState({ status: 'error', error: 'Connection lost. Please try again.' });
            break;
        }
      };

      // Create and send offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnection.setLocalDescription(offer);

      // Exchange SDP with signaling server
      const answer = await exchangeSDP(sessionId, offer.sdp!, 'offer', 'whep');

      // Set remote description
      await peerConnection.setRemoteDescription(answer);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to connect');
      setState({ status: 'error', error: err.message });
      onError?.(err);
    }
  }, [sessionId, iceServers, onError]);

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

  // Start viewing when component mounts
  useEffect(() => {
    // Small delay to ensure component is ready
    const timer = setTimeout(() => {
      startViewing();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      stopViewing();
    };
  }, [startViewing, stopViewing]);

  return (
    <div className="viewer-container">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="remote-video"
        />
        
        {state.status === 'idle' && (
          <div className="video-placeholder">
            <p>Connecting to live session...</p>
          </div>
        )}
        
        {state.status === 'connecting' && (
          <div className="video-loading">
            <div className="loading-spinner"></div>
            <p>Connecting to broadcast...</p>
          </div>
        )}
        
        {state.status === 'error' && (
          <div className="video-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Error: {state.error}</p>
            <button onClick={startViewing} className="retry-btn">
              Try Again
            </button>
          </div>
        )}
      </div>
      
      <div className="viewer-controls">
        <div className="status-indicator">
          <span className={`status-badge status-${state.status}`}>
            {state.status === 'connected' ? 'LIVE' : state.status.toUpperCase()}
          </span>
        </div>
        
        <div className="control-buttons">
          {state.status === 'idle' || state.status === 'error' ? (
            <button onClick={startViewing} className="control-btn btn-connect primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Connect</span>
            </button>
          ) : (
            <button onClick={stopViewing} className="control-btn btn-disconnect">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              <span>Disconnect</span>
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
        protocol: 'whep',
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
