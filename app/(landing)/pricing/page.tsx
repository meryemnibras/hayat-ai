"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown, ArrowLeft } from "lucide-react";

type PlanTier = "ESSENTIAL" | "PROFESSIONAL" | "PREMIUM";

interface Plan {
  tier: PlanTier;
  name: string;
  nameAr: string;
  price: number;
  interactions: number;
  languages: number;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const plans: Plan[] = [
  {
    tier: "ESSENTIAL",
    name: "Essential",
    nameAr: "الأساسية",
    price: 300,
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
    icon: Zap,
    gradient: "from-slate-600 to-slate-800",
  },
  {
    tier: "PROFESSIONAL",
    name: "Professional",
    nameAr: "الاحترافية",
    price: 500,
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
    icon: Sparkles,
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    tier: "PREMIUM",
    name: "Premium",
    nameAr: "المميزة",
    price: 800,
    interactions: -1,
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
    icon: Crown,
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function PricingPage() {
  const [lang, setLang] = useState<"en" | "ar">("ar");
  const [loading, setLoading] = useState<PlanTier | null>(null);

  const handleSubscribe = async (tier: PlanTier) => {
    setLoading(tier);
    try {
      // In production, get clinicId from auth context
      const clinicId = "demo-clinic-id";

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, tier }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "حدث خطأ");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee15,_transparent_40%),_radial-gradient(circle_at_80%_60%,_#8b5cf615,_transparent_35%)]" />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="h-5 w-5 text-slate-400" />
            <Image
              src="/images/logo.png"
              alt="Mediai Logo"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 transition hover:bg-white/10"
          >
            {lang === "ar" ? "English" : "عربي"}
          </button>
        </div>
      </nav>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {lang === "ar" ? "اختر باقتك المناسبة" : "Choose Your Plan"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300/80">
            {lang === "ar"
              ? "باقات مرنة تناسب جميع أحجام العيادات. ابدأ بفترة تجريبية مجانية 14 يوم."
              : "Flexible plans for clinics of all sizes. Start with a free 14-day trial."}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const features = lang === "ar" ? plan.featuresAr : plan.features;
            const name = lang === "ar" ? plan.nameAr : plan.name;

            return (
              <div
                key={plan.tier}
                className={`relative rounded-2xl border bg-slate-900/80 p-8 shadow-xl transition hover:-translate-y-1 ${
                  plan.popular
                    ? "border-cyan-400/50 ring-2 ring-cyan-400/20"
                    : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1 text-xs font-semibold text-slate-950">
                    {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient}`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Name & Price */}
                <h3 className="mb-2 text-2xl font-bold text-white">{name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-slate-400">
                    /{lang === "ar" ? "شهر" : "mo"}
                  </span>
                </div>

                {/* Interactions */}
                <div className="mb-6 rounded-lg bg-white/5 p-3 text-center text-sm">
                  <span className="font-semibold text-cyan-200">
                    {plan.interactions === -1
                      ? lang === "ar"
                        ? "غير محدود"
                        : "Unlimited"
                      : plan.interactions.toLocaleString()}
                  </span>{" "}
                  <span className="text-slate-400">
                    {lang === "ar" ? "تفاعل/شهر" : "interactions/mo"}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading === plan.tier}
                  className={`w-full rounded-full py-3 text-base font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  } disabled:opacity-50`}
                >
                  {loading === plan.tier
                    ? lang === "ar"
                      ? "جارٍ التحميل..."
                      : "Loading..."
                    : lang === "ar"
                    ? "ابدأ الآن"
                    : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-sm text-slate-400">
          {lang === "ar"
            ? "جميع الباقات تتضمن فترة تجريبية مجانية 14 يوم. يمكنك الإلغاء في أي وقت."
            : "All plans include a 14-day free trial. Cancel anytime."}
        </p>
      </div>
    </div>
  );
}

