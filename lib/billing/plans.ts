export type PlanTier = "ESSENTIAL" | "PROFESSIONAL" | "PREMIUM";

export interface Plan {
  tier: PlanTier;
  name: string;
  nameAr: string;
  price: number;
  priceId: string; // Stripe Price ID - set in env
  interactions: number; // -1 means unlimited
  languages: number;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
}

export const PLANS: Record<PlanTier, Plan> = {
  ESSENTIAL: {
    tier: "ESSENTIAL",
    name: "Essential",
    nameAr: "الأساسية",
    price: 300,
    priceId: process.env.STRIPE_ESSENTIAL_PRICE_ID || "",
    interactions: 1000,
    languages: 2,
    features: [
      "1,000 AI interactions/month",
      "2 languages (Arabic + English)",
      "WhatsApp integration",
      "Basic analytics",
      "Email support",
    ],
    featuresAr: [
      "1,000 تفاعل ذكاء اصطناعي/شهر",
      "لغتان (عربي + إنجليزي)",
      "تكامل واتساب",
      "تحليلات أساسية",
      "دعم بالبريد الإلكتروني",
    ],
  },
  PROFESSIONAL: {
    tier: "PROFESSIONAL",
    name: "Professional",
    nameAr: "الاحترافية",
    price: 500,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
    interactions: 5000,
    languages: 4,
    features: [
      "5,000 AI interactions/month",
      "4 languages (AR, EN, TR, FR)",
      "WhatsApp + SMS integration",
      "Advanced analytics & reports",
      "Priority support",
      "Custom AI personality",
    ],
    featuresAr: [
      "5,000 تفاعل ذكاء اصطناعي/شهر",
      "4 لغات (عربي، إنجليزي، تركي، فرنسي)",
      "تكامل واتساب + رسائل قصيرة",
      "تحليلات وتقارير متقدمة",
      "دعم ذو أولوية",
      "شخصية ذكاء اصطناعي مخصصة",
    ],
    popular: true,
  },
  PREMIUM: {
    tier: "PREMIUM",
    name: "Premium",
    nameAr: "المميزة",
    price: 800,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    interactions: -1, // unlimited
    languages: 4,
    features: [
      "Unlimited AI interactions",
      "All 4 languages",
      "All integrations",
      "Custom workflows",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise option",
    ],
    featuresAr: [
      "تفاعلات غير محدودة",
      "جميع اللغات الأربع",
      "جميع التكاملات",
      "تدفقات عمل مخصصة",
      "مدير حساب مخصص",
      "ضمان اتفاقية مستوى الخدمة",
      "خيار التثبيت المحلي",
    ],
  },
};

export function getPlanByTier(tier: PlanTier): Plan {
  return PLANS[tier];
}

export function getInteractionLimit(tier: PlanTier): number {
  return PLANS[tier].interactions;
}

export function isUnlimited(tier: PlanTier): boolean {
  return PLANS[tier].interactions === -1;
}

