/**
 * Security Tests - Authentication & Authorization
 * 
 * Tests to validate authentication mechanisms, authorization checks,
 * and protection against common security vulnerabilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateSession, extractAuthToken, checkAuthorization } from '@/lib/auth';
import { getServerSession } from 'next-auth';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
  AuthOptions: {},
  NextAuth: vi.fn(),
  default: vi.fn(),
}));

describe('Security Tests - Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Token Extraction', () => {
    it('should extract token from Authorization header', () => {
      const headers = new Headers({
        'Authorization': 'Bearer test-token-123'
      });
      
      const token = extractAuthToken(headers);
      expect(token).toBe('test-token-123');
    });

    it('should reject invalid Authorization format', () => {
      const headers = new Headers({
        'Authorization': 'InvalidFormat token'
      });
      
      const token = extractAuthToken(headers);
      expect(token).toBeNull();
    });

    it('should handle missing Authorization header', () => {
      const headers = new Headers({});
      
      const token = extractAuthToken(headers);
      expect(token).toBeNull();
    });

    it('should reject empty Authorization header', () => {
      const headers = new Headers({
        'Authorization': ''
      });
      
      const token = extractAuthToken(headers);
      expect(token).toBeNull();
    });

    it('should reject Bearer without token', () => {
      const headers = new Headers({
        'Authorization': 'Bearer'
      });
      
      const token = extractAuthToken(headers);
      expect(token).toBeNull();
    });
  });

  describe('Session Validation', () => {
    it('should validate null session', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);
      
      const result = await validateSession();
      expect(result.valid).toBe(false);
    });

    it('should validate session with user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user123', email: 'test@example.com' },
        expires: new Date(Date.now() + 86400000).toISOString()
      });
      
      const result = await validateSession();
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should reject expired session', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user123' },
        expires: new Date(Date.now() - 86400000).toISOString() // Expired
      });
      
      const result = await validateSession();
      expect(result.valid).toBe(false);
    });

    it('should handle session without user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: null,
        expires: new Date(Date.now() + 86400000).toISOString()
      });
      
      const result = await validateSession();
      expect(result.valid).toBe(false);
    });
  });

  describe('Authorization Checks', () => {
    it('should allow authorized user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user123', role: 'student' },
        expires: new Date(Date.now() + 86400000).toISOString()
      });
      
      const result = await checkAuthorization('student', ['student', 'instructor', 'admin']);
      expect(result.authorized).toBe(true);
    });

    it('should deny unauthorized role', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user123', role: 'student' },
        expires: new Date(Date.now() + 86400000).toISOString()
      });
      
      const result = await checkAuthorization('student', ['admin']);
      expect(result.authorized).toBe(false);
    });

    it('should handle no session', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);
      
      const result = await checkAuthorization('student', ['student']);
      expect(result.authorized).toBe(false);
      expect(result.reason).toBe('No session');
    });

    it('should allow multiple roles', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user123', role: 'instructor' },
        expires: new Date(Date.now() + 86400000).toISOString()
      });
      
      const result = await checkAuthorization('instructor', ['student', 'instructor', 'admin']);
      expect(result.authorized).toBe(true);
    });
  });

  describe('Brute Force Protection', () => {
    it('should track failed attempts', () => {
      const failedAttempts = new Map<string, number>();
      
      const trackAttempt = (ip: string) => {
        const count = failedAttempts.get(ip) || 0;
        failedAttempts.set(ip, count + 1);
        return count + 1;
      };
      
      expect(trackAttempt('192.168.1.1')).toBe(1);
      expect(trackAttempt('192.168.1.1')).toBe(2);
      expect(trackAttempt('192.168.1.2')).toBe(1);
    });

    it('should detect brute force pattern', () => {
      const failedAttempts = new Map<string, number>();
      const BRUTE_FORCE_THRESHOLD = 5;
      
      const isBruteForce = (ip: string) => {
        const count = failedAttempts.get(ip) || 0;
        failedAttempts.set(ip, count + 1);
        return count >= BRUTE_FORCE_THRESHOLD;
      };
      
      for (let i = 0; i < 5; i++) {
        expect(isBruteForce('192.168.1.1')).toBe(false);
      }
      
      // 6th attempt should trigger brute force detection
      expect(isBruteForce('192.168.1.1')).toBe(true);
    });

    it('should reset failed attempts after success', () => {
      const failedAttempts = new Map<string, number>();
      const BRUTE_FORCE_THRESHOLD = 5;
      
      const trackAttempt = (ip: string, success: boolean) => {
        if (success) {
          failedAttempts.delete(ip);
          return true;
        }
        const count = failedAttempts.get(ip) || 0;
        failedAttempts.set(ip, count + 1);
        return count + 1 >= BRUTE_FORCE_THRESHOLD;
      };
      
      // 4 failed attempts
      for (let i = 0; i < 4; i++) {
        trackAttempt('192.168.1.1', false);
      }
      
      // Successful login resets counter
      trackAttempt('192.168.1.1', true);
      
      // Should not trigger brute force after reset
      for (let i = 0; i < 4; i++) {
        expect(trackAttempt('192.168.1.1', false)).toBe(false);
      }
    });
  });

  describe('Session Security', () => {
    it('should generate secure session token', () => {
      const generateToken = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      };
      
      const token1 = generateToken();
      const token2 = generateToken();
      
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);
    });

    it('should detect suspicious session activity', () => {
      const session = {
        id: 'session-123',
        userId: 'user-123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        createdAt: Date.now() - 3600000, // 1 hour ago
      };
      
      const isSuspiciousActivity = (session: typeof session, currentIp: string, currentUserAgent: string) => {
        // Check IP change
        const ipChanged = session.ipAddress !== currentIp;
        // Check user agent change
        const uaChanged = session.userAgent !== currentUserAgent;
        // Check for rapid requests from different locations
        const rapidRequests = Date.now() - session.createdAt < 60000; // Within 1 minute
        
        return (ipChanged || uaChanged) && rapidRequests;
      };
      
      // Same location - not suspicious
      expect(isSuspiciousActivity(session, '192.168.1.100', 'Mozilla/5.0')).toBe(false);
      
      // Different IP within short time - suspicious
      expect(isSuspiciousActivity(session, '10.0.0.1', 'Mozilla/5.0')).toBe(true);
      
      // Different user agent within short time - suspicious
      expect(isSuspiciousActivity(session, '192.168.1.100', 'SuspiciousBot/1.0')).toBe(true);
    });
  });
});
