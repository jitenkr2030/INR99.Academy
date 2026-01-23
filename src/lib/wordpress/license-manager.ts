/**
 * WordPress License Manager
 * Handles license validation and tier management for WordPress sites
 */

import { db } from '@/lib/db';

export interface LicenseTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    courses: number;
    students: number;
    storage: number; // in GB
    bandwidth: number; // in GB per month
  };
}

export interface LicenseInfo {
  isValid: boolean;
  tier: string;
  expiresAt?: Date;
  features: string[];
  usage: {
    courses: number;
    students: number;
    storage: number;
    bandwidth: number;
  };
}

// License tier definitions
export const LICENSE_TIERS: Record<string, LicenseTier> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: [
      'Up to 10 courses',
      'Up to 100 students',
      'Basic analytics',
      'Email support',
      'Standard video quality'
    ],
    limits: {
      courses: 10,
      students: 100,
      storage: 5,
      bandwidth: 50,
    },
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 79,
    features: [
      'Up to 50 courses',
      'Up to 500 students',
      'Advanced analytics',
      'Priority support',
      'HD video quality',
      'Custom branding',
      'API access'
    ],
    limits: {
      courses: 50,
      students: 500,
      storage: 20,
      bandwidth: 200,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited courses',
      'Up to 5000 students',
      'Premium analytics',
      '24/7 phone support',
      '4K video quality',
      'White-label options',
      'Advanced API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      courses: -1, // unlimited
      students: 5000,
      storage: 100,
      bandwidth: 1000,
    },
  },
};

/**
 * Get all available license tiers
 */
export function getAllLicenseTiers(): LicenseTier[] {
  return Object.values(LICENSE_TIERS);
}

/**
 * Get license tier by ID
 */
export function getLicenseTier(tierId: string): LicenseTier | null {
  return LICENSE_TIERS[tierId] || null;
}

/**
 * Validate license for a WordPress site
 */
export async function validateLicense(siteId: string): Promise<LicenseInfo> {
  try {
    const site = await db.wpSites.findUnique({
      where: { id: siteId },
      include: {
        _count: {
          select: {
            courses: true,
            users: true,
          },
        },
      },
    });

    if (!site || !site.isActive) {
      return {
        isValid: false,
        tier: 'none',
        features: [],
        usage: {
          courses: 0,
          students: 0,
          storage: 0,
          bandwidth: 0,
        },
      };
    }

    const tier = getLicenseTier(site.licenseTier);
    if (!tier) {
      return {
        isValid: false,
        tier: 'invalid',
        features: [],
        usage: {
          courses: site._count.courses,
          students: site._count.users,
          storage: 0, // TODO: Calculate actual storage usage
          bandwidth: 0, // TODO: Calculate actual bandwidth usage
        },
      };
    }

    // Check if license is expired (if we have expiration dates)
    let isExpired = false;
    if (site.licenseExpiresAt && site.licenseExpiresAt < new Date()) {
      isExpired = true;
    }

    // Get current usage
    const usage = {
      courses: site._count.courses,
      students: site._count.users,
      storage: await getStorageUsage(siteId), // TODO: Implement storage calculation
      bandwidth: await getBandwidthUsage(siteId), // TODO: Implement bandwidth calculation
    };

    // Check if usage exceeds limits
    const exceedsLimits = 
      (tier.limits.courses > 0 && usage.courses > tier.limits.courses) ||
      (tier.limits.students > 0 && usage.students > tier.limits.students) ||
      (tier.limits.storage > 0 && usage.storage > tier.limits.storage) ||
      (tier.limits.bandwidth > 0 && usage.bandwidth > tier.limits.bandwidth);

    return {
      isValid: !isExpired && !exceedsLimits,
      tier: site.licenseTier,
      expiresAt: site.licenseExpiresAt || undefined,
      features: tier.features,
      usage,
    };
  } catch (error) {
    console.error('Failed to validate license:', error);
    return {
      isValid: false,
      tier: 'error',
      features: [],
      usage: {
        courses: 0,
        students: 0,
        storage: 0,
        bandwidth: 0,
      },
    };
  }
}

/**
 * Update license tier for a WordPress site
 */
export async function updateLicenseTier(siteId: string, newTier: string): Promise<void> {
  try {
    const tier = getLicenseTier(newTier);
    if (!tier) {
      throw new Error(`Invalid license tier: ${newTier}`);
    }

    // Calculate new expiration date (1 year from now for paid tiers)
    let licenseExpiresAt = null;
    if (newTier !== 'basic') {
      licenseExpiresAt = new Date();
      licenseExpiresAt.setFullYear(licenseExpiresAt.getFullYear() + 1);
    }

    await db.wpSites.update({
      where: { id: siteId },
      data: {
        licenseTier: newTier,
        licenseExpiresAt,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to update license tier:', error);
    throw error;
  }
}

/**
 * Check if a feature is available for a site's license tier
 */
export async function isFeatureAvailable(siteId: string, feature: string): Promise<boolean> {
  const license = await validateLicense(siteId);
  
  if (!license.isValid) {
    return false;
  }

  return license.features.includes(feature);
}

/**
 * Get storage usage for a site
 */
async function getStorageUsage(siteId: string): Promise<number> {
  // TODO: Implement actual storage calculation
  // This would sum up all file sizes for the site
  return 0;
}

/**
 * Get bandwidth usage for a site
 */
async function getBandwidthUsage(siteId: string): Promise<number> {
  // TODO: Implement actual bandwidth calculation
  // This would sum up all data transfer for the current month
  return 0;
}

/**
 * Get license usage statistics
 */
export async function getLicenseUsageStats(siteId: string): Promise<{
  courses: { used: number; limit: number; percentage: number };
  students: { used: number; limit: number; percentage: number };
  storage: { used: number; limit: number; percentage: number };
  bandwidth: { used: number; limit: number; percentage: number };
}> {
  const license = await validateLicense(siteId);
  const tier = getLicenseTier(license.tier);

  if (!tier) {
    throw new Error('Invalid license tier');
  }

  const calculatePercentage = (used: number, limit: number) => {
    if (limit <= 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return {
    courses: {
      used: license.usage.courses,
      limit: tier.limits.courses,
      percentage: calculatePercentage(license.usage.courses, tier.limits.courses),
    },
    students: {
      used: license.usage.students,
      limit: tier.limits.students,
      percentage: calculatePercentage(license.usage.students, tier.limits.students),
    },
    storage: {
      used: license.usage.storage,
      limit: tier.limits.storage,
      percentage: calculatePercentage(license.usage.storage, tier.limits.storage),
    },
    bandwidth: {
      used: license.usage.bandwidth,
      limit: tier.limits.bandwidth,
      percentage: calculatePercentage(license.usage.bandwidth, tier.limits.bandwidth),
    },
  };
}