import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export interface User {
  id: string
  mobileNumber: string
  email?: string
  name?: string
  role?: string
}

export function getAuthenticatedUser(request: NextRequest): User | null {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // For now, we'll use a simple token-based approach
    // In a real app, you'd want to use proper JWT tokens
    const userStr = Buffer.from(token, 'base64').toString('utf-8')
    const user: User = JSON.parse(userStr)
    
    return user
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function createAuthToken(user: User): string {
  // Simple base64 encoding for now
  // In a real app, you'd want to use proper JWT tokens
  const userStr = JSON.stringify(user)
  return Buffer.from(userStr).toString('base64')
}

/**
 * Extract auth token from request headers
 */
export function extractAuthToken(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }
  
  // Must be exactly "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  const token = parts[1];
  if (!token || token.length === 0) {
    return null;
  }
  
  return token;
}

/**
 * Validate session and return session status
 */
export interface SessionValidationResult {
  valid: boolean;
  user?: User;
  reason?: string;
}

export async function validateSession(): Promise<SessionValidationResult> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return { valid: false, reason: 'No session' };
    }
    
    // Check if session is expired
    if (session.expires) {
      const expiresAt = new Date(session.expires);
      if (expiresAt < new Date()) {
        return { valid: false, reason: 'Session expired' };
      }
    }
    
    return {
      valid: true,
      user: session.user as User
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false, reason: 'Validation error' };
  }
}

/**
 * Check if user is authorized for specific roles
 */
export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
}

export async function checkAuthorization(
  userRole: string,
  allowedRoles: string[]
): Promise<AuthorizationResult> {
  const sessionResult = await validateSession();
  
  if (!sessionResult.valid) {
    return { authorized: false, reason: sessionResult.reason };
  }
  
  if (!allowedRoles.includes(userRole)) {
    return { authorized: false, reason: 'Role not authorized' };
  }
  
  return { authorized: true };
}