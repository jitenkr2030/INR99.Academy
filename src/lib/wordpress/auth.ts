/**
 * WordPress Authentication Module
 * Handles authentication between WordPress sites and our platform
 */

import { db } from '@/lib/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface WordPressAuthCredentials {
  apiKey: string;
  apiSecret: string;
  siteId: string;
}

export interface WordPressUser {
  id: string;
  email: string;
  name: string;
  role: string;
  siteId: string;
}

export interface SSORequest {
  siteId: string;
  userId: string;
  timestamp: number;
  signature: string;
}

export interface TokenRequest {
  apiKey: string;
  signature: string;
  timestamp: number;
}

/**
 * Generate JWT secret for WordPress site
 */
function generateJWTSecret(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Create SSO token for WordPress user
 */
export function createSSOToken(siteId: string, userId: string, userEmail: string): string {
  const payload = {
    siteId,
    userId,
    email: userEmail,
    type: 'wordpress_sso',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 15), // 15 minutes
  };

  const site = db.wpSites.findUnique({
    where: { id: siteId },
  });

  if (!site || !site.jwtSecret) {
    throw new Error('Site not found or JWT secret not configured');
  }

  return jwt.sign(payload, site.jwtSecret);
}

/**
 * Verify SSO token
 */
export function verifySSOToken(token: string, siteId: string): any {
  const site = db.wpSites.findUnique({
    where: { id: siteId },
  });

  if (!site || !site.jwtSecret) {
    throw new Error('Site not found or JWT secret not configured');
  }

  try {
    return jwt.verify(token, site.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Create API token for WordPress site
 */
export function createAPIToken(siteId: string): { token: string; expiresAt: Date } {
  const payload = {
    siteId,
    type: 'wordpress_api',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  };

  const site = db.wpSites.findUnique({
    where: { id: siteId },
  });

  if (!site || !site.jwtSecret) {
    throw new Error('Site not found or JWT secret not configured');
  }

  const token = jwt.sign(payload, site.jwtSecret);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  return { token, expiresAt };
}

/**
 * Verify API token
 */
export function verifyAPIToken(token: string): any {
  try {
    // First decode the token to get the siteId
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.siteId) {
      throw new Error('Invalid token structure');
    }

    const site = db.wpSites.findUnique({
      where: { id: decoded.siteId },
    });

    if (!site || !site.jwtSecret) {
      throw new Error('Site not found or JWT secret not configured');
    }

    return jwt.verify(token, site.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate signature for WordPress requests
 */
export function generateSignature(data: any, apiSecret: string): string {
  const stringifiedData = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHmac('sha256', apiSecret).update(stringifiedData).digest('hex');
}

/**
 * Verify signature for WordPress requests
 */
export function verifySignature(data: any, signature: string, apiSecret: string): boolean {
  const expectedSignature = generateSignature(data, apiSecret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * Authenticate WordPress site
 */
export async function authenticateWordPressSite(apiKey: string, signature: string, timestamp: number): Promise<WordPressAuthCredentials | null> {
  try {
    const site = await db.wpSites.findFirst({
      where: {
        apiKey,
        isActive: true,
      },
    });

    if (!site) {
      return null;
    }

    // Check if timestamp is within 5 minutes
    const now = Date.now();
    const timestampMs = timestamp * 1000;
    if (now - timestampMs > 5 * 60 * 1000) {
      return null; // Request too old
    }

    // Verify signature
    const data = { apiKey, timestamp };
    const isValidSignature = verifySignature(data, signature, site.apiSecret);

    if (!isValidSignature) {
      return null;
    }

    return {
      apiKey: site.apiKey,
      apiSecret: site.apiSecret,
      siteId: site.id,
    };
  } catch (error) {
    console.error('WordPress authentication failed:', error);
    return null;
  }
}

/**
 * Get or create WordPress user
 */
export async function getOrCreateWordPressUser(email: string, name: string, siteId: string): Promise<WordPressUser> {
  try {
    // Check if user exists
    let user = await db.user.findFirst({
      where: {
        email,
        wpSites: {
          some: {
            id: siteId,
          },
        },
      },
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email,
          name,
          emailVerified: new Date(),
          wpSites: {
            connect: {
              id: siteId,
            },
          },
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: 'student', // Default role
      siteId,
    };
  } catch (error) {
    console.error('Failed to get or create WordPress user:', error);
    throw error;
  }
}

/**
 * Initialize JWT secret for WordPress site
 */
export async function initializeJWTSiteSecret(siteId: string): Promise<string> {
  try {
    const jwtSecret = generateJWTSecret();

    await db.wpSites.update({
      where: { id: siteId },
      data: { jwtSecret },
    });

    return jwtSecret;
  } catch (error) {
    console.error('Failed to initialize JWT secret:', error);
    throw error;
  }
}

/**
 * Revoke all tokens for a WordPress site
 */
export async function revokeAllTokens(siteId: string): Promise<void> {
  try {
    // Generate new JWT secret to invalidate all existing tokens
    await initializeJWTSiteSecret(siteId);
  } catch (error) {
    console.error('Failed to revoke tokens:', error);
    throw error;
  }
}