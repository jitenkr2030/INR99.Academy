/**
 * WordPress Integration Module
 * Export all WordPress-related functionality
 */

// API Client
export {
  getWordPressSite,
  validateWordPressCredentials,
  createWordPressSite,
  revokeWordPressSiteCredentials,
  deactivateWordPressSite,
  getAllWordPressSites,
  getWordPressSiteByApiKey,
  generateSignature,
} from './api-client';

// Authentication
export {
  generateAccessToken,
  refreshAccessToken,
  validateAccessToken,
  revokeAccessToken,
  revokeAllSiteTokens,
  generateSSOUrl,
  verifySSOSession,
  cleanupExpiredAuthData,
} from './auth';

// Webhook Handler
export {
  processWebhookEvent,
  verifyWebhookSignature,
  sendWebhookToSite,
  getWebhookLogs,
} from './webhook-handler';

// License Manager
export {
  validateLicense,
  checkFeatureAccess,
  checkAPILimit,
  recordAPICall,
  updateLicenseTier,
  checkCourseLimit,
  checkUserLimit,
  getLicenseTierInfo,
  getAllLicenseTiers,
} from './license-manager';
