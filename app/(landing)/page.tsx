"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MediaiLogo from "@/components/shared/MediaiLogo";
import {
  ChevronRight,
  Check,
  Globe,
  Calendar,
  MessageCircle,
  Activity,
  Shield,
  Users,
  X,
  Star,
  Sparkles,
  Bot,
  Phone,
  Mail,
  MapPin,
  Play,
  ArrowRight,
  Zap,
  Clock,
  Heart,
} from "lucide-react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 THEME COLORS (matching logo)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Primary: Green gradient (#22C55E → #10B981 → #06B6D4)
// Secondary: Navy/Teal (#0F766E, #134E4A, #115E59)

type Language = "en" | "ar" | "tr" | "fr";

const languages: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
  fr: "Français",
};

const content: Record<Language, {
  hero: { title: string; subtitle: string; cta: string };
  benefits: string;
  features: string;
  pricing: string;
  testimonials: string;
  contact: string;
}> = {
  en: {
    hero: {
      title: "Redefining Patient Experience in Aesthetic Medicine",
      subtitle:
        "AI-powered multilingual concierge system designed for aesthetic clinics in Turkey and the Gulf",
      cta: "Book a Demo",
    },
    benefits: "Benefits",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Success Stories",
    contact: "Contact Us",
  },
  ar: {
    hero: {
      title: "إعادة تعريف تجربة المرضى في الطب التجميلي",
      subtitle:
        "نظام كونسيرج متعدد اللغات مدعوم بالذكاء الاصطناعي مصمم للعيادات التجميلية في تركيا والخليج",
      cta: "احجز عرضاً توضيحياً",
    },
    benefits: "الفوائد",
    features: "الميزات",
    pricing: "الأسعار",
    testimonials: "قصص النجاح",
    contact: "اتصل بنا",
  },
  tr: {
    hero: {
      title: "Estetik Tıpta Hasta Deneyimini Yeniden Tanımlamak",
      subtitle:
        "Türkiye ve Körfez bölgesindeki estetik klinikler için tasarlanmış yapay zeka destekli çok dilli concierge sistemi",
      cta: "Demo Randevusu Alın",
    },
    benefits: "Faydalar",
    features: "Özellikler",
    pricing: "Fiyatlandırma",
    testimonials: "Başarı Hikayeleri",
    contact: "Bize Ulaşın",
  },
  fr: {
    hero: {
      title: "Redéfinir l'expérience patient en médecine esthétique",
      subtitle:
        "Système de conciergerie multilingue alimenté par l'IA conçu pour les cliniques esthétiques en Turquie et dans le Golfe",
      cta: "Réserver une démo",
    },
    benefits: "Avantages",
    features: "Fonctionnalités",
    pricing: "Tarification",
    testimonials: "Témoignages",
    contact: "Contactez-nous",
  },
};

const benefits = [
  {
    icon: MessageCircle,
    title: "Multilingual Communication",
    titleAr: "تواصل متعدد اللغات",
    description:
      "Connect with patients in Arabic, Turkish, English and French with natural, culturally-appropriate conversations",
    stat: "76%",
    statDescription: "of clinics struggle with multilingual communication",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Calendar,
    title: "Automated Scheduling",
    titleAr: "جدولة تلقائية",
    description:
      "Reduce missed calls and scheduling errors with 24/7 AI-powered booking and management",
    stat: "87%",
    statDescription: "of clinics miss 30+ international patient calls daily",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Activity,
    title: "Operational Efficiency",
    titleAr: "كفاءة تشغيلية",
    description:
      "Free up staff time by automating repetitive patient inquiries and follow-ups",
    stat: "91%",
    statDescription: "of staff time currently spent on repetitive inquiries",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Privacy & Compliance",
    titleAr: "الخصوصية والامتثال",
    description:
      "Enterprise-grade security with GDPR, KVKK compliance for patient data protection",
    stat: "100%",
    statDescription: "privacy compliant with regional regulations",
    gradient: "from-cyan-500 to-sky-500",
  },
];

const features = [
  {
    title: "Multilingual Voice Assistant",
    description:
      "Natural conversations in Arabic, Turkish, English, and French with cultural adaptation",
    icon: Globe,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    title: "WhatsApp Integration",
    description:
      "Seamless patient engagement through the most popular messaging platform in the region",
    icon: MessageCircle,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Real-time Appointment Management",
    description:
      "Smart scheduling, automated reminders, and no-show reduction system",
    icon: Calendar,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    title: "Treatment Guidance",
    description:
      "AI-powered treatment recommendations and pre/post-procedure instructions",
    icon: Heart,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    title: "Automated Follow-ups",
    description:
      "Personalized patient communication throughout the treatment journey",
    icon: Clock,
    color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Operational insights, patient satisfaction tracking, and revenue optimization",
    icon: Activity,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

const pricingTiers = [
  {
    name: "Essential",
    nameAr: "الأساسية",
    price: "$300",
    period: "per month",
    description: "Perfect for small aesthetic clinics",
    features: [
      "Basic AI concierge",
      "Support for 2 languages",
      "Up to 1,000 patient interactions monthly",
      "Standard email support",
      "Basic appointment scheduling",
    ],
    mostPopular: false,
    icon: Zap,
  },
  {
    name: "Professional",
    nameAr: "الاحترافية",
    price: "$500",
    period: "per month",
    description: "Ideal for growing aesthetic practices",
    features: [
      "Advanced AI concierge",
      "Support for all 4 languages",
      "Unlimited patient interactions",
      "Integration with existing systems",
      "Analytics dashboard",
      "Priority support",
    ],
    mostPopular: true,
    icon: Sparkles,
  },
  {
    name: "Premium",
    nameAr: "المميزة",
    price: "$800",
    period: "per month",
    description: "For premium clinics and medical tourism centers",
    features: [
      "All Professional features",
      "Custom AI persona",
      "White-label option",
      "Unlimited integrations",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    mostPopular: false,
    icon: Star,
  },
];

const testimonials = [
  {
    quote:
      "Mediai has transformed our patient engagement. We've seen an 80% reduction in missed calls and improved appointment utilization by 40%.",
    author: "Dr. Ayşe Demir",
    role: "Founder, Luxe Aesthetics Istanbul",
    rating: 5,
  },
  {
    quote:
      "Our Gulf patients especially appreciate the Arabic language support. Patient satisfaction scores increased from 3.2 to 4.7 out of 5.",
    author: "Sarah Al Mansoori",
    role: "Operations Manager, Dubai Beauty Hub",
    rating: 5,
  },
  {
    quote:
      "The ROI was clear within just 4 months. Staff workload for routine inquiries dropped by 60%.",
    author: "Mehmet Özkan",
    role: "CEO, Antalya Aesthetic Center",
    rating: 5,
  },
];

export default function LandingPage() {
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = activeLanguage === "ar";
  const t = content[activeLanguage];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen font-sans ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ━━━ NAVIGATION ━━━ */}
      <nav
        className={`fixed w-full py-4 transition-all duration-500 z-50 ${
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <MediaiLogo size="md" href="/" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#benefits"
              className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
            >
              {t.benefits}
            </a>
            <a
              href="#features"
              className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
            >
              {t.features}
            </a>
            <a
              href="#pricing"
              className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
            >
              {t.pricing}
            </a>
            <a
              href="#testimonials"
              className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
            >
              {t.testimonials}
            </a>

            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-slate-700 hover:text-teal-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Globe size={18} />
                <span className="font-medium">{languages[activeLanguage]}</span>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 py-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                    {(Object.entries(languages) as [Language, string][]).map(
                      ([code, name]) => (
                        <button
                          key={code}
                          className={`block w-full text-left px-4 py-2.5 transition-colors ${
                            activeLanguage === code
                              ? "bg-gradient-to-r from-green-50 to-teal-50 text-teal-700 font-medium"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                          onClick={() => {
                            setActiveLanguage(code);
                            setIsMenuOpen(false);
                          }}
                        >
                          {name}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
              onClick={() => setShowDemoModal(true)}
            >
              {t.contact}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t p-4 space-y-3">
            <a href="#benefits" className="block py-2 text-slate-700">{t.benefits}</a>
            <a href="#features" className="block py-2 text-slate-700">{t.features}</a>
            <a href="#pricing" className="block py-2 text-slate-700">{t.pricing}</a>
            <a href="#testimonials" className="block py-2 text-slate-700">{t.testimonials}</a>
            <button
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-medium"
              onClick={() => setShowDemoModal(true)}
            >
              {t.contact}
            </button>
          </div>
        )}
      </nav>

      {/* ━━━ HERO SECTION ━━━ */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/50 to-teal-50/50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-green-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-teal-100/40 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero Text */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 rounded-full px-4 py-2 mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  AI Medical Concierge Platform
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6 animate-slide-up">
                {t.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {t.hero.title.split(" ").slice(-2).join(" ")}
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed animate-slide-up animation-delay-100">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animation-delay-200">
                <button
                  className="group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={() => setShowDemoModal(true)}
                >
                  {t.hero.cta}
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button className="group border-2 border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                  <Play size={20} className="text-teal-500" />
                  Watch Video
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 animate-fade-in animation-delay-300">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-green-500" />
                  GDPR & KVKK Compliant
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-green-500" />
                  100+ Premium Clinics
                </div>
              </div>
            </div>

            {/* Hero Chat Preview */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end animate-float">
              <div className="relative">
                {/* Main Chat Window */}
                <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden max-w-md border border-slate-100">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl text-teal-600 flex items-center justify-center font-bold shadow-lg">
                          <Bot size={20} />
                        </div>
                        <div>
                          <div className="font-semibold">Mediai Assistant</div>
                          <div className="text-xs opacity-80 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                            Online
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-md py-3 px-4 max-w-xs shadow-md border border-slate-100">
                        <p className="text-sm text-slate-700">
                          Hello! I'm your AI concierge. How may I assist you today?
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl rounded-tr-md py-3 px-4 max-w-xs shadow-md">
                        <p className="text-sm text-white">
                          Can I schedule a Botox consultation for next week?
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-md py-3 px-4 max-w-xs shadow-md border border-slate-100">
                        <p className="text-sm text-slate-700">
                          Of course! Dr. Ayşe has availability on Tuesday 2PM or Thursday 11AM. Which works for you?
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl rounded-tr-md py-3 px-4 max-w-xs shadow-md">
                        <p className="text-sm text-white">Thursday at 11AM would be perfect.</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="border-t p-4 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                      />
                      <button className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/25 hover:shadow-xl transition-all">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Bubbles */}
                <div className="absolute -right-8 -bottom-8 bg-white rounded-xl shadow-xl p-3 max-w-[180px] transform rotate-3 animate-bounce-slow border border-slate-100">
                  <p className="text-sm text-right text-slate-700 font-arabic">
                    مرحباً، أود حجز موعد 🇸🇦
                  </p>
                </div>

                <div className="absolute -left-8 -top-4 bg-white rounded-xl shadow-xl p-3 max-w-[180px] transform -rotate-3 animate-bounce-slow animation-delay-500 border border-slate-100">
                  <p className="text-sm text-slate-700">
                    Randevunuz onaylandı ✓ 🇹🇷
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ BENEFITS SECTION ━━━ */}
      <section id="benefits" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Solving Critical Challenges for{" "}
              <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Aesthetic Clinics
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Mediai addresses the unique challenges faced by aesthetic clinics in Turkey and the Gulf region
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg shadow-slate-100 p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-100 border border-slate-100 hover:border-teal-200"
                >
                  <div
                    className={`bg-gradient-to-r ${benefit.gradient} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 mb-5 leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="pt-5 border-t border-slate-100">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                      {benefit.stat}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {benefit.statDescription}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-full px-8 py-4 text-teal-700 font-medium shadow-inner">
              <Zap className="text-green-500" size={20} />
              Clinics using Mediai report 80% reduction in missed calls
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES SECTION ━━━ */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-teal-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive{" "}
              <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                AI Concierge
              </span>{" "}
              Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything aesthetic clinics need to automate patient engagement and streamline operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 border border-slate-100 hover:border-teal-200"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${feature.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-2xl hover:-translate-y-1"
              onClick={() => setShowDemoModal(true)}
            >
              See All Features
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ PRICING SECTION ━━━ */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Transparent
              </span>{" "}
              Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the plan that fits your clinic's needs
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-8">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-8 flex flex-col flex-1 max-w-md mx-auto lg:mx-0 transition-all duration-500 ${
                    tier.mostPopular
                      ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white lg:scale-110 shadow-2xl shadow-green-500/30 z-10"
                      : "bg-white border-2 border-slate-100 hover:border-teal-200 shadow-lg hover:shadow-xl"
                  } relative`}
                >
                  {tier.mostPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-teal-600 text-sm font-bold py-2 px-6 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        tier.mostPopular
                          ? "bg-white/20"
                          : "bg-gradient-to-r from-green-100 to-teal-100"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={tier.mostPopular ? "text-white" : "text-teal-600"}
                      />
                    </div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        tier.mostPopular ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-bold ${
                          tier.mostPopular ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {tier.price}
                      </span>
                      <span
                        className={tier.mostPopular ? "text-white/70" : "text-slate-500"}
                      >
                        {tier.period}
                      </span>
                    </div>
                    <p
                      className={`mt-2 ${
                        tier.mostPopular ? "text-white/80" : "text-slate-600"
                      }`}
                    >
                      {tier.description}
                    </p>
                  </div>

                  <ul className="mb-8 space-y-4 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          size={20}
                          className={`flex-shrink-0 mt-0.5 ${
                            tier.mostPopular ? "text-white" : "text-green-500"
                          }`}
                        />
                        <span
                          className={tier.mostPopular ? "text-white/90" : "text-slate-700"}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full ${
                      tier.mostPopular
                        ? "bg-white text-teal-600 hover:bg-slate-50 shadow-lg"
                        : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-lg shadow-green-500/25"
                    }`}
                    onClick={() => setShowDemoModal(true)}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS SECTION ━━━ */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                Leading Clinics
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how Mediai is transforming patient experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Ready to transform your patient experience?
              </h3>
              <p className="text-slate-600">
                Join 100+ premium aesthetic clinics already using Mediai
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-2xl whitespace-nowrap"
              onClick={() => setShowDemoModal(true)}
            >
              Book Your Demo Today
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="mb-6">
                <MediaiLogo size="md" />
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Redefining patient experience in aesthetic medicine with AI-powered multilingual concierge systems.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 flex items-center justify-center transition-all duration-300"
                  >
                    <span className="text-xs uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Solutions</h3>
              <ul className="space-y-3">
                {["Aesthetic Clinics", "Dental Clinics", "Hair Transplant", "Medical Tourism", "Enterprise"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail size={18} className="text-teal-400" />
                  info@mediai.tr
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone size={18} className="text-teal-400" />
                  +90 212 555 0123
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPin size={18} className="text-teal-400" />
                  Istanbul, Turkey
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400">
              © 2025 MEDI AI Technologies. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">GDPR</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ━━━ DEMO MODAL ━━━ */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl animate-scale-in">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowDemoModal(false)}
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Request a Demo</h3>
              <p className="text-slate-600 mt-2">
                Fill out the form and we'll get in touch
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="Dr. Ahmed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="Luxe Aesthetics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="doctor@clinic.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="+90 555 123 4567"
                />
              </div>

              <button
                type="button"
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl"
                onClick={() => {
                  setShowDemoModal(false);
                  alert("Thank you! Our team will contact you shortly.");
                }}
              >
                Request Demo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ━━━ CUSTOM ANIMATIONS ━━━ */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-10px) rotate(var(--tw-rotate)); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
