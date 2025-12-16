import { prisma } from "@/lib/prisma";
import { getInteractionLimit, isUnlimited, PlanTier } from "./plans";

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
 * Get current billing period start/end for a subscription
 */
function getCurrentPeriod(): { periodStart: Date; periodEnd: Date } {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { periodStart, periodEnd };
}

/**
 * Get or create usage record for the current period
 */
export async function getOrCreateUsageRecord(subscriptionId: string) {
  const { periodStart, periodEnd } = getCurrentPeriod();

  let record = await prisma.usageRecord.findUnique({
    where: {
      subscriptionId_periodStart: {
        subscriptionId,
        periodStart,
      },
    },
  });

  if (!record) {
    record = await prisma.usageRecord.create({
      data: {
        subscriptionId,
        periodStart,
        periodEnd,
        interactions: 0,
        overage: 0,
      },
    });
  }

  return record;
}

/**
 * Increment interaction count for a clinic
 */
export async function incrementUsage(clinicId: string): Promise<UsageStatus> {
  const subscription = await prisma.subscription.findUnique({
    where: { clinicId },
  });

  if (!subscription) {
    throw new Error("No subscription found for clinic");
  }

  const record = await getOrCreateUsageRecord(subscription.id);
  const tier = subscription.tier as PlanTier;
  const limit = getInteractionLimit(tier);
  const unlimited = isUnlimited(tier);

  // Calculate new values
  const newInteractions = record.interactions + 1;
  let newOverage = 0;

  if (!unlimited && newInteractions > limit) {
    newOverage = newInteractions - limit;
  }

  // Update record
  await prisma.usageRecord.update({
    where: { id: record.id },
    data: {
      interactions: newInteractions,
      overage: newOverage,
    },
  });

  return {
    used: newInteractions,
    limit: unlimited ? -1 : limit,
    remaining: unlimited ? -1 : Math.max(0, limit - newInteractions),
    percentUsed: unlimited ? 0 : Math.round((newInteractions / limit) * 100),
    isOverLimit: !unlimited && newInteractions > limit,
    overage: newOverage,
    isUnlimited: unlimited,
  };
}

/**
 * Get current usage status for a clinic
 */
export async function getUsageStatus(clinicId: string): Promise<UsageStatus> {
  const subscription = await prisma.subscription.findUnique({
    where: { clinicId },
  });

  if (!subscription) {
    // No subscription = no usage allowed
    return {
      used: 0,
      limit: 0,
      remaining: 0,
      percentUsed: 100,
      isOverLimit: true,
      overage: 0,
      isUnlimited: false,
    };
  }

  const record = await getOrCreateUsageRecord(subscription.id);
  const tier = subscription.tier as PlanTier;
  const limit = getInteractionLimit(tier);
  const unlimited = isUnlimited(tier);

  return {
    used: record.interactions,
    limit: unlimited ? -1 : limit,
    remaining: unlimited ? -1 : Math.max(0, limit - record.interactions),
    percentUsed: unlimited ? 0 : Math.round((record.interactions / limit) * 100),
    isOverLimit: !unlimited && record.interactions > limit,
    overage: record.overage,
    isUnlimited: unlimited,
  };
}

/**
 * Check if clinic can perform an interaction
 */
export async function canPerformInteraction(clinicId: string): Promise<{
  allowed: boolean;
  reason?: string;
  status: UsageStatus;
}> {
  const status = await getUsageStatus(clinicId);

  // Unlimited plan always allowed
  if (status.isUnlimited) {
    return { allowed: true, status };
  }

  // Allow up to 10% overage with warning
  const maxOverage = Math.ceil(status.limit * 0.1);
  if (status.overage > maxOverage) {
    return {
      allowed: false,
      reason: "Monthly interaction limit exceeded. Please upgrade your plan.",
      status,
    };
  }

  return { allowed: true, status };
}

/**
 * Get usage alerts for a clinic (near limit warnings)
 */
export async function getUsageAlerts(clinicId: string): Promise<string[]> {
  const status = await getUsageStatus(clinicId);
  const alerts: string[] = [];

  if (status.isUnlimited) return alerts;

  if (status.percentUsed >= 100) {
    alerts.push("لقد تجاوزت حد التفاعلات الشهري. يرجى ترقية باقتك.");
  } else if (status.percentUsed >= 90) {
    alerts.push(`تبقى ${status.remaining} تفاعل فقط هذا الشهر (90% مستخدم).`);
  } else if (status.percentUsed >= 75) {
    alerts.push(`استخدمت 75% من تفاعلاتك الشهرية.`);
  }

  return alerts;
}

