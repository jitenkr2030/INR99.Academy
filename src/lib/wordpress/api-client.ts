/**
 * WordPress API Client
 * Handles communication with WordPress sites
 */

import { db } from '@/lib/db';
import crypto from 'crypto';

export interface WordPressSite {
  id: string;
  siteName: string;
  siteUrl: string;
  apiKey: string;
  apiSecret: string;
  licenseTier: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWordPressSiteRequest {
  siteName: string;
  siteUrl: string;
  licenseTier?: string;
}

/**
 * Generate API credentials for WordPress site
 */
function generateApiCredentials() {
  const apiKey = crypto.randomBytes(16).toString('hex');
  const apiSecret = crypto.randomBytes(32).toString('hex');
  return { apiKey, apiSecret };
}

/**
 * Get all WordPress sites
 */
export async function getAllWordPressSites(): Promise<WordPressSite[]> {
  try {
    const sites = await db.wpSites.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            courses: true,
            liveSessions: true,
            pptxJobs: true,
            users: true,
          },
        },
      },
    });

    return sites.map(site => ({
      ...site,
      apiKey: '***', // Hide actual API key
      apiSecret: '***', // Hide actual API secret
    }));
  } catch (error) {
    console.error('Failed to fetch WordPress sites:', error);
    throw new Error('Failed to fetch WordPress sites');
  }
}

/**
 * Create a new WordPress site
 */
export async function createWordPressSite(request: CreateWordPressSiteRequest): Promise<WordPressSite> {
  try {
    const { siteName, siteUrl, licenseTier = 'basic' } = request;

    // Check if site URL already exists
    const existingSite = await db.wpSites.findFirst({
      where: {
        siteUrl,
      },
    });

    if (existingSite) {
      throw new Error('A site with this URL already exists');
    }

    // Generate API credentials
    const { apiKey, apiSecret } = generateApiCredentials();

    // Create the site
    const site = await db.wpSites.create({
      data: {
        siteName,
        siteUrl,
        apiKey,
        apiSecret,
        licenseTier,
        isActive: true,
      },
    });

    return site;
  } catch (error) {
    console.error('Failed to create WordPress site:', error);
    throw error;
  }
}

/**
 * Deactivate a WordPress site
 */
export async function deactivateWordPressSite(siteId: string): Promise<WordPressSite> {
  try {
    const site = await db.wpSites.update({
      where: {
        id: siteId,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return site;
  } catch (error) {
    console.error('Failed to deactivate WordPress site:', error);
    throw new Error('Failed to deactivate WordPress site');
  }
}

/**
 * Revoke WordPress site credentials (generate new ones)
 */
export async function revokeWordPressSiteCredentials(siteId: string): Promise<WordPressSite> {
  try {
    const { apiKey, apiSecret } = generateApiCredentials();

    const site = await db.wpSites.update({
      where: {
        id: siteId,
      },
      data: {
        apiKey,
        apiSecret,
        updatedAt: new Date(),
      },
    });

    return site;
  } catch (error) {
    console.error('Failed to revoke WordPress site credentials:', error);
    throw new Error('Failed to revoke WordPress site credentials');
  }
}

/**
 * Validate WordPress site credentials
 */
export async function validateWordPressCredentials(apiKey: string, apiSecret: string): Promise<boolean> {
  try {
    const site = await db.wpSites.findFirst({
      where: {
        apiKey,
        apiSecret,
        isActive: true,
      },
    });

    return !!site;
  } catch (error) {
    console.error('Failed to validate WordPress credentials:', error);
    return false;
  }
}

/**
 * Get WordPress site by API key
 */
export async function getWordPressSiteByApiKey(apiKey: string): Promise<WordPressSite | null> {
  try {
    const site = await db.wpSites.findFirst({
      where: {
        apiKey,
        isActive: true,
      },
    });

    return site;
  } catch (error) {
    console.error('Failed to get WordPress site by API key:', error);
    return null;
  }
}

/**
 * Update WordPress site
 */
export async function updateWordPressSite(
  siteId: string,
  updates: Partial<WordPressSite>
): Promise<WordPressSite> {
  try {
    const site = await db.wpSites.update({
      where: {
        id: siteId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    return site;
  } catch (error) {
    console.error('Failed to update WordPress site:', error);
    throw new Error('Failed to update WordPress site');
  }
}