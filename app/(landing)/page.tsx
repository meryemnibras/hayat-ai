import React from "react";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const stats = [
  { label: "استجابة الذكاء الاصطناعي", value: "24/7" },
  { label: "دقة التوصيات", value: "99.1%" },
  { label: "رضا المرضى", value: "4.9/5" },
];

const features = [
  {
    title: "مساعد ذكاء اصطناعي للعيادة",
    description:
      "يتعامل مع الاستشارات، يجيب عن الأسئلة، ويقدم توصيات مدعومة بالبيانات لكل مريض.",
    icon: Bot,
    accent: "bg-cyan-500/10 text-cyan-200",
  },
  {
    title: "لوحة تحكم للطبيب",
    description:
      "عرض شامل للحجوزات، المتابعات، وتحليل الأداء في لوحة واحدة بسيطة.",
    icon: Stethoscope,
    accent: "bg-emerald-500/10 text-emerald-200",
  },
  {
    title: "أمان وامتثال",
    description:
      "حماية بيانات المرضى مع تحكم كامل في الصلاحيات وتدقيق قابل للتتبع.",
    icon: ShieldCheck,
    accent: "bg-indigo-500/10 text-indigo-200",
  },
];

const steps = [
  {
    title: "ربط البيانات والأدوات",
    detail: "أضف قواعد بياناتك، مزودي الرسائل، والهوية خلال دقائق.",
  },
  {
    title: "تفعيل التدفقات الذكية",
    detail: "فعّل تدفقات الحجز والمتابعة والدفع لتعمل تلقائياً.",
  },
  {
    title: "تجربة مرضى استثنائية",
    detail: "وفّر ردوداً فورية، تذكيرات دقيقة، ومتابعات شخصية لكل زيارة.",
  },
];

export const metadata: Metadata = {
  title: "Hayat AI | منصة عيادات تجميل مدعومة بالذكاء الاصطناعي",
  description:
    "منصة موحدة لإدارة العيادات التجميلية مع مساعد ذكاء اصطناعي، حجوزات ذكية، ولوحة تحكم موحدة للأطباء.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee26,_transparent_35%),_radial-gradient(circle_at_20%_40%,_#8b5cf621,_transparent_32%),_radial-gradient(circle_at_80%_30%,_#22c55e1c,_transparent_30%)]" />

        <header className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-16">
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              منصة Hayat AI للعيادات التجميلية
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
              مساعد ذكاء اصطناعي وتشغيل آلي كامل
              <span className="text-cyan-300"> لرحلة المريض التجميلية</span>
            </h1>
            <p className="max-w-3xl text-lg text-slate-200/80">
              حلول موحدة للحجز، المتابعة، والتحويلات. امنح فريقك أدوات ذكية
              تبقي التجربة متصلة وآمنة من أول رسالة وحتى المتابعة بعد الإجراء.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <button className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300">
                ابدأ مجاناً
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-base font-semibold text-slate-50 transition hover:border-cyan-200/50 hover:text-cyan-100">
                تواصل معنا
              </button>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-5 text-center shadow-sm"
              >
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20">
          <section className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-white/5 bg-slate-900/80 p-6 shadow-lg transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${feature.accent}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300/80">
                  {feature.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 opacity-0 transition group-hover:opacity-100">
                  اكتشف المزيد
                  <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 p-8 shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200/80">
                  كيف يعمل
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  أتمتة متكاملة لرحلة المريض
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
                  اربط نظام الهوية، الدفعات، وقنوات التواصل. فعل التدفقات
                  المسبقة أو خصصها، واترك المساعد الذكي ينسق الاستجابات
                  والمتابعات.
                </p>
              </div>
              <div className="hidden rounded-full border border-cyan-200/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 md:inline-flex md:items-center md:gap-2">
                <CheckCircle2 className="h-4 w-4" />
                جاهز للإطلاق خلال أيام قليلة
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-white/5 bg-white/5 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-100">
                      {index + 1}
                    </span>
                    <p className="text-base font-semibold text-white">
                      {step.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-slate-300/80">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-slate-900/80 p-8 text-center shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200/80">
              جاهز للانطلاق
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Hayat AI يبقي عيادتك متصلة دائماً
            </h3>
            <p className="mt-3 text-sm text-slate-300/80">
              جرّب المساعد الذكي، فعل التدفقات، وراقب تحسن رضى المرضى والحجوزات
              في لوحة واحدة.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300">
                جرّب النسخة التجريبية
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-base font-semibold text-slate-50 transition hover:border-cyan-200/50 hover:text-cyan-100">
                حدد موعد عرض مباشر
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

