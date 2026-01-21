import { PlanTier } from "./plans";

export interface UsageStatus {
  used: number;
  limit: number;
  remaining: number;
  percentUsed: number;
  isOverLimit: boolean;
  overage: number;
  isUnlimited: boolean;
}

/**
 * Get current usage status for a clinic (mock implementation)
 * TODO: Implement with Subscription and UsageRecord models
 */
export async function getUsageStatus(clinicId: string): Promise<UsageStatus> {
  // Mock implementation - always return unlimited
  return {
    used: 0,
    limit: -1,
    remaining: -1,
    percentUsed: 0,
    isOverLimit: false,
    overage: 0,
    isUnlimited: true,
  };
}

/**
 * Increment interaction count for a clinic (mock implementation)
 */
export async function incrementUsage(clinicId: string): Promise<UsageStatus> {
  return await getUsageStatus(clinicId);
}

/**
 * Check if clinic can perform an interaction (mock implementation)
 */
export async function canPerformInteraction(clinicId: string): Promise<{
  allowed: boolean;
  reason?: string;
  status: UsageStatus;
}> {
  const status = await getUsageStatus(clinicId);
  return { allowed: true, status };
}

/**
 * Get usage alerts for a clinic (mock implementation)
 */
export async function getUsageAlerts(clinicId: string): Promise<string[]> {
  return [];
}
