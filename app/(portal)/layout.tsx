"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Moon, Sun, Globe, ChevronDown, Check } from "lucide-react";
import Image from "next/image";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌍 TRANSLATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const translations = {
  tr: {
    welcome: "Hoş Geldiniz",
    greeting: "Günaydın",
    dashboard: "Ana Sayfa",
    aiAssistant: "AI Asistan",
    appointments: "Randevular",
    doctors: "Doktorlar",
    medicalRecords: "Tıbbi Kayıtlar",
    notifications: "Bildirimler",
    settings: "Ayarlar",
    logout: "Çıkış",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    searchPlaceholder: "Ne yardım edebilirim?",
    voiceAssistant: "Sesli asistan için basılı tutun",
    typeMessage: "Mesajınızı yazın...",
    bookAppointment: "Randevu Al",
    selectDoctor: "Doktor Seçin",
    selectDate: "Tarih Seçin",
    selectTime: "Saat Seçin",
    confirmBooking: "Randevuyu Onayla",
    cancel: "İptal",
    viewAll: "Tümünü Gör",
    emergency: "Acil Durum",
    onlineConsultation: "Online Konsültasyon",
    labResults: "Test Sonuçları",
    prescriptions: "Reçeteler",
    aiThinking: "AI düşünüyor...",
    aiSpeaking: "AI konuşuyor...",
    nextAppointment: "Sonraki Randevu",
    recentActivity: "Son Aktiviteler",
    healthSummary: "Sağlık Özeti",
    quickActions: "Hızlı İşlemler",
    experience: "yıl deneyim",
    rating: "değerlendirme",
    available: "Müsait",
    online: "Çevrimiçi",
    offline: "Çevrimdışı",
    typing: "yazıyor...",
    patientPortal: "Hasta Portalı",
  },
  ar: {
    welcome: "أهلاً وسهلاً",
    greeting: "صباح الخير",
    dashboard: "الرئيسية",
    aiAssistant: "المساعد الذكي",
    appointments: "المواعيد",
    doctors: "الأطباء",
    medicalRecords: "السجلات الطبية",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    logout: "تسجيل خروج",
    login: "تسجيل دخول",
    register: "إنشاء حساب",
    searchPlaceholder: "كيف يمكنني مساعدتك؟",
    voiceAssistant: "اضغط مطولاً للمساعد الصوتي",
    typeMessage: "اكتب رسالتك...",
    bookAppointment: "حجز موعد",
    selectDoctor: "اختر الطبيب",
    selectDate: "اختر التاريخ",
    selectTime: "اختر الوقت",
    confirmBooking: "تأكيد الحجز",
    cancel: "إلغاء",
    viewAll: "عرض الكل",
    emergency: "حالة طوارئ",
    onlineConsultation: "استشارة أونلاين",
    labResults: "نتائج التحاليل",
    prescriptions: "الوصفات الطبية",
    aiThinking: "المساعد يفكر...",
    aiSpeaking: "المساعد يتحدث...",
    nextAppointment: "الموعد القادم",
    recentActivity: "النشاط الأخير",
    healthSummary: "ملخص صحي",
    quickActions: "إجراءات سريعة",
    experience: "سنوات خبرة",
    rating: "تقييم",
    available: "متاح",
    online: "متصل",
    offline: "غير متصل",
    typing: "يكتب...",
    patientPortal: "بوابة المريض",
  },
  en: {
    welcome: "Welcome",
    greeting: "Good morning",
    dashboard: "Dashboard",
    aiAssistant: "AI Assistant",
    appointments: "Appointments",
    doctors: "Doctors",
    medicalRecords: "Medical Records",
    notifications: "Notifications",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    register: "Register",
    searchPlaceholder: "How can I help you?",
    voiceAssistant: "Press and hold for voice assistant",
    typeMessage: "Type your message...",
    bookAppointment: "Book Appointment",
    selectDoctor: "Select Doctor",
    selectDate: "Select Date",
    selectTime: "Select Time",
    confirmBooking: "Confirm Booking",
    cancel: "Cancel",
    viewAll: "View All",
    emergency: "Emergency",
    onlineConsultation: "Online Consultation",
    labResults: "Lab Results",
    prescriptions: "Prescriptions",
    aiThinking: "AI is thinking...",
    aiSpeaking: "AI is speaking...",
    nextAppointment: "Next Appointment",
    recentActivity: "Recent Activity",
    healthSummary: "Health Summary",
    quickActions: "Quick Actions",
    experience: "years experience",
    rating: "rating",
    available: "Available",
    online: "Online",
    offline: "Offline",
    typing: "typing...",
    patientPortal: "Patient Portal",
  },
  fr: {
    welcome: "Bienvenue",
    greeting: "Bonjour",
    dashboard: "Tableau de bord",
    aiAssistant: "Assistant IA",
    appointments: "Rendez-vous",
    doctors: "Médecins",
    medicalRecords: "Dossiers Médicaux",
    notifications: "Notifications",
    settings: "Paramètres",
    logout: "Déconnexion",
    login: "Connexion",
    register: "Inscription",
    searchPlaceholder: "Comment puis-je vous aider?",
    voiceAssistant: "Maintenez pour l'assistant vocal",
    typeMessage: "Tapez votre message...",
    bookAppointment: "Prendre Rendez-vous",
    selectDoctor: "Sélectionner Médecin",
    selectDate: "Sélectionner Date",
    selectTime: "Sélectionner Heure",
    confirmBooking: "Confirmer Réservation",
    cancel: "Annuler",
    viewAll: "Voir Tout",
    emergency: "Urgence",
    onlineConsultation: "Consultation en Ligne",
    labResults: "Résultats de Laboratoire",
    prescriptions: "Ordonnances",
    aiThinking: "L'IA réfléchit...",
    aiSpeaking: "L'IA parle...",
    nextAppointment: "Prochain Rendez-vous",
    recentActivity: "Activité Récente",
    healthSummary: "Résumé de Santé",
    quickActions: "Actions Rapides",
    experience: "ans d'expérience",
    rating: "évaluation",
    available: "Disponible",
    online: "En ligne",
    offline: "Hors ligne",
    typing: "écrit...",
    patientPortal: "Portail Patient",
  },
};

type Language = keyof typeof translations;
type TranslationKey = keyof (typeof translations)["en"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 CONTEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PortalContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

export const PortalContext = createContext<PortalContextType | null>(null);

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within PortalProvider");
  }
  return context;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏗️ LAYOUT COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const isRTL = language === "ar";

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang in translations) {
      setLanguage(browserLang as Language);
    }

    // Check for saved preferences
    const savedLang = localStorage.getItem("portal-language") as Language;
    const savedDark = localStorage.getItem("portal-dark-mode");

    if (savedLang && savedLang in translations) {
      setLanguage(savedLang);
    }
    if (savedDark) {
      setIsDarkMode(savedDark === "true");
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("portal-language", language);
    localStorage.setItem("portal-dark-mode", String(isDarkMode));
  }, [language, isDarkMode]);

  return (
    <PortalContext.Provider
      value={{ language, setLanguage, isDarkMode, setIsDarkMode, t, isRTL }}
    >
      <div
        className={`min-h-screen ${isDarkMode ? "dark" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
          {/* Top Navigation Bar */}
          <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/logo.svg"
                  alt="Mediai Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </a>

              {/* Right Controls */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-gray-600" />
                  )}
                </button>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Globe
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                      {language.toUpperCase()}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {showLanguageMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowLanguageMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50">
                        {(Object.keys(translations) as Language[]).map(
                          (lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                setLanguage(lang);
                                setShowLanguageMenu(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                                language === lang
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              <span>
                                {lang === "ar"
                                  ? "العربية"
                                  : lang === "tr"
                                    ? "Türkçe"
                                    : lang === "fr"
                                      ? "Français"
                                      : "English"}
                              </span>
                              {language === lang && <Check size={16} />}
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Auth Buttons */}
                <div className="hidden sm:flex items-center space-x-2">
                  <a
                    href="/portal/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {t("login")}
                  </a>
                  <a
                    href="/portal/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    {t("register")}
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="pt-16">{children}</main>
        </div>
      </div>
    </PortalContext.Provider>
  );
}

