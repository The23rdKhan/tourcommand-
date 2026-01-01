// Subscription tier utilities

import type { SubscriptionTier } from '../types';

export const TIER_LIMITS = {
  Free: {
    maxTours: 1,
    features: {
      csvExport: true,
      pdfExport: false,
      shareableLinks: false,
      integrations: false,
      unlimitedTours: false
    }
  },
  Pro: {
    maxTours: Infinity,
    features: {
      csvExport: true,
      pdfExport: true,
      shareableLinks: true,
      integrations: true,
      unlimitedTours: true
    }
  },
  Agency: {
    maxTours: Infinity,
    features: {
      csvExport: true,
      pdfExport: true,
      shareableLinks: true,
      integrations: true,
      unlimitedTours: true,
      multiUser: true,
      apiAccess: true
    }
  }
} as const;

export function checkTierLimit(tier: SubscriptionTier, currentCount: number, limitType: 'tours'): boolean {
  const limits = TIER_LIMITS[tier];
  
  if (limitType === 'tours') {
    if (limits.maxTours === Infinity) return true;
    return currentCount < limits.maxTours;
  }
  
  return true;
}

export function hasFeature(tier: SubscriptionTier, feature: keyof typeof TIER_LIMITS.Pro.features): boolean {
  return TIER_LIMITS[tier].features[feature] || false;
}

export function requireFeature(tier: SubscriptionTier, feature: keyof typeof TIER_LIMITS.Pro.features): void {
  if (!hasFeature(tier, feature)) {
    throw new Error(`Feature "${feature}" requires Pro or Agency subscription`);
  }
}

