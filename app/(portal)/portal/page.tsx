"use client";

import { useState, useEffect, useRef } from "react";
import MediaiLogo from "@/components/shared/MediaiLogo";
import {
  MessageCircle,
  Mic,
  Calendar,
  FileText,
  Bell,
  Send,
  Phone,
  Video,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Search,
  X,
  Check,
  Loader2,
  Volume2,
  Stethoscope,
  Activity,
  Heart,
  Home,
  Settings,
  LogOut,
  Menu,
  MoreVertical,
  Paperclip,
  Smile,
  Play,
  PhoneCall,
  Pill,
  TestTube,
  ChevronLeft,
  Zap,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { usePortal } from "../layout";
import { useDoctors } from "@/hooks/useDoctors";
import { useAppointments } from "@/hooks/useAppointments";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧩 UI COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const StatusBadge = ({
  status,
  size = "md",
}: {
  status: string;
  size?: string;
}) => {
  const statusConfig: Record<string, { color: string; pulse: boolean }> = {
    online: { color: "bg-green-500", pulse: true },
    offline: { color: "bg-gray-400", pulse: false },
    busy: { color: "bg-yellow-500", pulse: true },
    away: { color: "bg-orange-500", pulse: false },
  };

  const config = statusConfig[status] || statusConfig.offline;
  const sizeClass = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <div className="absolute -bottom-0.5 -right-0.5">
      <div className={`${sizeClass} ${config.color} rounded-full border-2 border-white dark:border-gray-800`} />
      {config.pulse && (
        <div
          className={`absolute inset-0 ${sizeClass} ${config.color} rounded-full animate-ping opacity-75`}
        />
      )}
    </div>
  );
};

const ProgressRing = ({
  percentage,
  size = 60,
  strokeWidth = 6,
  color = "#3B82F6",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
};

const VoiceWaveAnimation = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center justify-center space-x-1 h-8">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`w-1 bg-blue-500 rounded-full transition-all duration-200 ${
          isActive ? "animate-pulse" : ""
        }`}
        style={{
          height: isActive ? `${Math.random() * 20 + 10}px` : "4px",
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏥 MAIN PORTAL PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  timestamp: string;
  status: string;
  isVoice?: boolean;
  duration?: number;
}

interface Doctor {
  id: string | number;
  name: Record<string, string> | string;
  specialty: Record<string, string> | string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  languages: string[];
  availableSlots: string[];
  nextAvailable: string;
  price: string;
  badges: string[];
  bio: string;
}

export default function PatientPortalPage() {
  const { t, isRTL, language, isDarkMode } = usePortal();

  // ━━━ STATE ━━━
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      text: "Hello! I'm Hayat AI, your health assistant. How can I help you today? أنا حياة، مساعدك الصحي الذكي. كيف يمكنني مساعدتك؟",
      timestamp: new Date().toISOString(),
      status: "delivered",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Appointment States
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notifications = 3;

  // ━━━ REAL DATA FROM API ━━━
  const { doctors: doctorsData, loading: doctorsLoading, error: doctorsError } = useDoctors();
  const { appointments: appointmentsData, loading: appointmentsLoading, error: appointmentsError } = useAppointments();

  // Transform API doctors data to UI format
  const doctors: Doctor[] = doctorsData.map((doc, index) => {
    // Extract available slots from availabilitySchedule
    const schedule = doc.availabilitySchedule as any;
    const availableSlots: string[] = [];
    if (schedule) {
      Object.values(schedule).forEach((slots: any) => {
        if (Array.isArray(slots)) {
          slots.forEach((slot: string) => {
            const times = slot.split("-");
            if (times[0]) {
              availableSlots.push(times[0]);
            }
          });
        }
      });
    }

    // Default slots if none found
    const defaultSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    return {
      id: doc.id,
      name: {
        en: doc.fullName,
        ar: doc.fullName,
        tr: doc.fullName,
        fr: doc.fullName,
      },
      specialty: {
        en: doc.specialization,
        ar: doc.specialization,
        tr: doc.specialization,
        fr: doc.specialization,
      },
      experience: doc.yearsExperience,
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviews: Math.floor(Math.random() * 200) + 50,
      image: `https://i.pravatar.cc/150?u=${doc.id}`,
      languages: doc.languagesSpoken.length > 0 ? doc.languagesSpoken : ["EN", "AR"],
      availableSlots: availableSlots.length > 0 ? availableSlots : defaultSlots,
      nextAvailable: "Today",
      price: "$150",
      badges: doc.hospitalAffiliation ? ["Verified", "Hospital Affiliated"] : ["Verified"],
      bio: `${doc.yearsExperience} years of experience in ${doc.specialization}${doc.hospitalAffiliation ? ` at ${doc.hospitalAffiliation}` : ""}`,
    };
  });

  // Fallback to mock data if API fails or no data
  const mockDoctors: Doctor[] = [
    {
      id: 1,
      name: {
        en: "Dr. Sarah Johnson",
        ar: "د. سارة جونسون",
        tr: "Dr. Sarah Johnson",
        fr: "Dr. Sarah Johnson",
      },
      specialty: {
        en: "Dermatology",
        ar: "الأمراض الجلدية",
        tr: "Dermatoloji",
        fr: "Dermatologie",
      },
      experience: 15,
      rating: 4.9,
      reviews: 234,
      image: "https://i.pravatar.cc/150?img=1",
      languages: ["EN", "AR"],
      availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      nextAvailable: "Today",
      price: "$150",
      badges: ["Top Rated", "Quick Response"],
      bio: "Specialized in cosmetic dermatology with extensive experience in laser treatments.",
    },
    {
      id: 2,
      name: {
        en: "Dr. Ahmed Hassan",
        ar: "د. أحمد حسن",
        tr: "Dr. Ahmed Hassan",
        fr: "Dr. Ahmed Hassan",
      },
      specialty: {
        en: "Plastic Surgery",
        ar: "الجراحة التجميلية",
        tr: "Plastik Cerrahi",
        fr: "Chirurgie Plastique",
      },
      experience: 20,
      rating: 4.8,
      reviews: 189,
      image: "https://i.pravatar.cc/150?img=3",
      languages: ["AR", "EN", "TR"],
      availableSlots: ["10:00", "11:00", "14:00", "15:00"],
      nextAvailable: "Tomorrow",
      price: "$200",
      badges: ["Expert", "Verified"],
      bio: "Board certified plastic surgeon with focus on reconstructive and aesthetic procedures.",
    },
    {
      id: 3,
      name: {
        en: "Dr. Marie Dubois",
        ar: "د. ماري دوبوا",
        tr: "Dr. Marie Dubois",
        fr: "Dr. Marie Dubois",
      },
      specialty: {
        en: "Hair Transplant",
        ar: "زراعة الشعر",
        tr: "Saç Ekimi",
        fr: "Greffe de Cheveux",
      },
      experience: 12,
      rating: 4.9,
      reviews: 312,
      image: "https://i.pravatar.cc/150?img=5",
      languages: ["FR", "EN", "AR"],
      availableSlots: ["09:00", "11:00", "13:00", "15:00", "17:00"],
      nextAvailable: "Today",
      price: "$180",
      badges: ["Popular", "5 Star"],
      bio: "Leading expert in FUE hair transplant with over 3000 successful procedures.",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      date: "Dec 18, 2024",
      time: "14:00",
      type: "Follow-up",
      status: "confirmed",
      location: "Hayat Clinic - Downtown",
    },
    {
      id: 2,
      doctor: "Dr. Ahmed Hassan",
      specialty: "Plastic Surgery",
      date: "Dec 22, 2024",
      time: "10:00",
      type: "Consultation",
      status: "pending",
      location: "Hayat Clinic - West Side",
    },
  ];

  // ━━━ EFFECTS ━━━
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  // ━━━ HANDLERS ━━━
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: inputMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsAIThinking(true);

    try {
      // Call the real AI API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: "portal-session",
        }),
      });

      const data = await response.json();

      setIsAIThinking(false);
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        text: data.response || "I apologize, I couldn't process that request.",
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsAISpeaking(true);

      // Simulate AI speaking
      setTimeout(() => setIsAISpeaking(false), 3000);
    } catch {
      setIsAIThinking(false);
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        text: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      setIsAISpeaking(false);
    } else {
      handleVoiceMessage();
    }
  };

  const handleVoiceMessage = () => {
    const voiceMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: "🎤 Voice message",
      isVoice: true,
      duration: recordingDuration,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, voiceMessage]);
    setIsAIThinking(true);

    setTimeout(() => {
      setIsAIThinking(false);
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        text: "I received your voice message. How can I assist you further?",
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsAISpeaking(true);
      setTimeout(() => setIsAISpeaking(false), 3000);
    }, 2000);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    try {
      // Call appointment booking API
      const response = await fetch("/api/portal/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name[language],
          specialty: selectedDoctor.specialty[language],
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (response.ok) {
        alert(
          `✅ Appointment booked!\nDoctor: ${selectedDoctor.name[language]}\nDate: ${selectedDate}\nTime: ${selectedTime}`
        );
        resetAppointmentModal();
      }
    } catch {
      alert("Failed to book appointment. Please try again.");
    }
  };

  const resetAppointmentModal = () => {
    setShowAppointmentModal(false);
    setAppointmentStep(1);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      language === "ar" ? "ar-SA" : language === "tr" ? "tr-TR" : "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
  };

  const quickActions = [
    {
      icon: Calendar,
      label: t("bookAppointment"),
      action: () => setShowAppointmentModal(true),
      color: "blue",
    },
    {
      icon: Video,
      label: t("onlineConsultation"),
      action: () => {},
      color: "green",
    },
    { icon: TestTube, label: t("labResults"), action: () => {}, color: "purple" },
    { icon: Pill, label: t("prescriptions"), action: () => {}, color: "orange" },
    { icon: Phone, label: t("emergency"), action: () => {}, color: "red" },
  ];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="min-h-screen">
      {/* ━━━ SIDEBAR ━━━ */}
      <aside
        className={`
        fixed top-16 ${isRTL ? "right-0" : "left-0"} h-[calc(100vh-4rem)] 
        bg-white dark:bg-gray-800 shadow-xl z-30
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-20"}
        ${isMobile && !isSidebarOpen ? (isRTL ? "translate-x-full" : "-translate-x-full") : "translate-x-0"}
      `}
      >
        {/* Logo Section */}
        {isSidebarOpen && (
          <div className="p-4 border-b dark:border-gray-700">
            <a href="/" className="flex items-center justify-center">
              <MediaiLogo size="sm" />
            </a>
          </div>
        )}
        
        {/* User Profile Card */}
        {isSidebarOpen && (
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <StatusBadge status="online" size="sm" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Patient ID: #MED2024
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-4 ${isRTL ? "-left-3" : "-right-3"} w-6 h-6 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-full shadow-md flex items-center justify-center`}
        >
          <ChevronLeft
            size={14}
            className={`text-gray-600 dark:text-gray-300 transition-transform ${!isSidebarOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: "dashboard", icon: Home, label: t("dashboard") },
            {
              id: "chat",
              icon: MessageCircle,
              label: t("aiAssistant"),
              badge: 2,
            },
            { id: "appointments", icon: Calendar, label: t("appointments") },
            { id: "doctors", icon: Stethoscope, label: t("doctors") },
            { id: "records", icon: FileText, label: t("medicalRecords") },
            {
              id: "notifications",
              icon: Bell,
              label: t("notifications"),
              badge: notifications,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}
                px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  activeView === item.id
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                }
              `}
            >
              <div className="flex items-center">
                <item.icon
                  size={20}
                  className={`${!isSidebarOpen && "mx-auto"}`}
                />
                {isSidebarOpen && (
                  <span className={`${isRTL ? "mr-3" : "ml-3"} font-medium`}>
                    {item.label}
                  </span>
                )}
              </div>
              {isSidebarOpen && item.badge && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t dark:border-gray-700 space-y-1">
          <button
            className={`w-full flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"} px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors`}
          >
            <Settings size={20} />
            {isSidebarOpen && (
              <span className={`${isRTL ? "mr-3" : "ml-3"} font-medium`}>
                {t("settings")}
              </span>
            )}
          </button>
          <button
            className={`w-full flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"} px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors`}
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className={`${isRTL ? "mr-3" : "ml-3"} font-medium`}>
                {t("logout")}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen && !isMobile
            ? isRTL
              ? "mr-64"
              : "ml-64"
            : isRTL
              ? "mr-20"
              : "ml-20"
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm flex items-center justify-between px-6 sticky top-16 z-20">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("greeting")}, John! 👋
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {!isMobile && (
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            )}

            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <button className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* ━━━ DASHBOARD VIEW ━━━ */}
          {activeView === "dashboard" && (
            <div className="space-y-6">
              {/* Health Summary Card */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <Sparkles className="mr-2" size={24} />
                    {t("healthSummary")}
                  </h2>
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Health Score</span>
                      <Heart size={20} className="text-white/80" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <ProgressRing
                        percentage={85}
                        size={50}
                        strokeWidth={5}
                        color="#fff"
                      />
                      <div>
                        <p className="text-2xl font-bold">85%</p>
                        <p className="text-xs text-white/80">Excellent</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">
                        {t("nextAppointment")}
                      </span>
                      <Calendar size={20} className="text-white/80" />
                    </div>
                    <p className="text-2xl font-bold">Dec 18</p>
                    <p className="text-xs text-white/80">In 2 days</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Active Treatments</span>
                      <Activity size={20} className="text-white/80" />
                    </div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-white/80">On track</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap className="mr-2 text-yellow-500" size={20} />
                  {t("quickActions")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                    >
                      <action.icon
                        className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform"
                        size={28}
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <Clock className="mr-2 text-blue-500" size={20} />
                      {t("appointments")}
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      {t("viewAll")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {apt.doctor}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {apt.specialty}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              apt.status === "confirmed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {apt.date}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {apt.time}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin size={14} className="mr-1" />
                          {apt.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <Activity className="mr-2 text-purple-500" size={20} />
                      {t("recentActivity")}
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      {t("viewAll")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        icon: MessageCircle,
                        text: "AI Assistant consultation",
                        time: "2 hours ago",
                        color: "blue",
                      },
                      {
                        icon: TestTube,
                        text: "Lab results available",
                        time: "Yesterday",
                        color: "green",
                      },
                      {
                        icon: Pill,
                        text: "Prescription renewed",
                        time: "2 days ago",
                        color: "orange",
                      },
                      {
                        icon: Calendar,
                        text: "Appointment rescheduled",
                        time: "3 days ago",
                        color: "purple",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <activity.icon
                            className="text-blue-600 dark:text-blue-400"
                            size={20}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ━━━ AI CHAT VIEW ━━━ */}
          {activeView === "chat" && (
            <div className="h-[calc(100vh-180px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <StatusBadge status="online" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Hayat AI Assistant
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      {isAIThinking ? (
                        <>
                          <Loader2 className="animate-spin mr-1" size={14} />
                          {t("aiThinking")}
                        </>
                      ) : isAISpeaking ? (
                        <>
                          <Volume2 className="animate-pulse mr-1" size={14} />
                          {t("aiSpeaking")}
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                          {t("online")}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <PhoneCall
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Video
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user"
                        ? isRTL
                          ? "justify-start"
                          : "justify-end"
                        : isRTL
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${message.type === "user" ? "order-2" : "order-1"}`}
                    >
                      <div
                        className={`
                        px-4 py-3 rounded-2xl shadow-sm
                        ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }
                      `}
                      >
                        {message.isVoice ? (
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                              <Play size={16} />
                            </button>
                            <VoiceWaveAnimation isActive={false} />
                            <span className="text-xs">{message.duration}s</span>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">
                            {message.text}
                          </p>
                        )}
                      </div>
                      <div
                        className={`flex items-center mt-1 ${
                          message.type === "user"
                            ? isRTL
                              ? "justify-start"
                              : "justify-end"
                            : isRTL
                              ? "justify-end"
                              : "justify-start"
                        }`}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(message.timestamp)}
                        </p>
                        {message.type === "user" && (
                          <span className="ml-1">
                            {message.status === "sent" && (
                              <Check size={12} className="text-gray-400" />
                            )}
                            {message.status === "delivered" && (
                              <span className="flex">
                                <Check size={12} className="text-blue-500" />
                                <Check
                                  size={12}
                                  className="text-blue-500 -ml-2"
                                />
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* AI Thinking Indicator */}
                {isAIThinking && (
                  <div
                    className={`flex ${isRTL ? "justify-end" : "justify-start"}`}
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Speaking Indicator */}
                {isAISpeaking && (
                  <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                    <Volume2 className="animate-pulse" size={16} />
                    <VoiceWaveAnimation isActive={true} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t dark:border-gray-700">
                {/* Quick Reply Suggestions */}
                <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                  {[
                    "Book appointment",
                    "View lab results",
                    "Talk to doctor",
                    "Emergency help",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInputMessage(suggestion)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Paperclip
                      size={20}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Smile
                      size={20}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={t("typeMessage")}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Voice Record Button */}
                  <button
                    onMouseDown={handleVoiceRecord}
                    onMouseUp={() => isRecording && handleVoiceRecord()}
                    onTouchStart={handleVoiceRecord}
                    onTouchEnd={() => isRecording && handleVoiceRecord()}
                    className={`
                      p-3 rounded-xl transition-all duration-200
                      ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse scale-110"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }
                    `}
                  >
                    <Mic size={20} />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send size={20} />
                  </button>
                </div>

                {/* Voice Recording Indicator */}
                {isRecording && (
                  <div className="mt-2 flex items-center justify-center text-sm text-red-500">
                    <span className="animate-pulse">
                      ● Recording... {recordingDuration}s
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  {t("voiceAssistant")}
                </p>
              </div>
            </div>
          )}

          {/* ━━━ DOCTORS VIEW ━━━ */}
          {activeView === "doctors" && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("doctors")}
                  </h2>
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search doctors..."
                        className="pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {doctorsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading doctors...</span>
                </div>
              )}

              {/* Error State */}
              {doctorsError && !doctorsLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Error loading doctors</p>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">{doctorsError}</p>
                  </div>
                </div>
              )}

              {/* Doctors Grid */}
              {!doctorsLoading && !doctorsError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayDoctors.length > 0 ? (
                    displayDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Doctor Image & Badge */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-500 to-cyan-400">
                      <img
                        src={doctor.image}
                        alt={getDoctorName(doctor)}
                        className="absolute bottom-0 left-6 w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                      />
                      {doctor.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-700 rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6 pt-8">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {getDoctorName(doctor)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {getDoctorSpecialty(doctor)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star
                            className="text-yellow-400 fill-yellow-400 mr-1"
                            size={16}
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {doctor.rating}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({doctor.reviews})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.experience} {t("experience")}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center space-x-1 mb-4">
                        {doctor.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {doctor.bio}
                      </p>

                      {/* Available Times */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {t("available")}: {doctor.nextAvailable}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.availableSlots.slice(0, 4).map((slot) => (
                            <span
                              key={slot}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded"
                            >
                              {slot}
                            </span>
                          ))}
                          {doctor.availableSlots.length > 4 && (
                            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                              +{doctor.availableSlots.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowAppointmentModal(true);
                          }}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                        >
                          {t("bookAppointment")}
                        </button>
                        <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <MessageCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No doctors available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Other Views Placeholder */}
          {["appointments", "records", "notifications"].includes(activeView) && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeView === "appointments" && (
                  <Calendar className="text-gray-400" size={32} />
                )}
                {activeView === "records" && (
                  <FileText className="text-gray-400" size={32} />
                )}
                {activeView === "notifications" && (
                  <Bell className="text-gray-400" size={32} />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {activeView === "appointments" ? t("appointments") : 
                 activeView === "records" ? t("medicalRecords") : 
                 t("notifications")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isRTL ? "هذا القسم قيد التطوير..." : "This section is coming soon..."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ━━━ APPOINTMENT BOOKING MODAL ━━━ */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("bookAppointment")}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${
                          appointmentStep >= step
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }
                      `}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-12 h-0.5 ml-2 ${appointmentStep > step ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={resetAppointmentModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Step 1: Select Doctor */}
              {appointmentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {t("selectDoctor")}
                  </h3>
                  {displayDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`
                        p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${
                          selectedDoctor?.id === doctor.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name[language]}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {getDoctorName(doctor)}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doctor.specialty[language]}
                          </p>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="flex items-center text-sm">
                              <Star
                                className="text-yellow-400 fill-yellow-400 mr-1"
                                size={14}
                              />
                              {doctor.rating}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {doctor.experience} {t("experience")}
                            </span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {doctor.nextAvailable}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`text-gray-400 ${selectedDoctor?.id === doctor.id ? "text-blue-500" : ""}`}
                          size={20}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Select Date */}
              {appointmentStep === 2 && selectedDoctor && (
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name[language]}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {selectedDoctor.name[language]}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDoctor.specialty[language]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("selectDate")}
                  </h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              {/* Step 3: Select Time */}
              {appointmentStep === 3 && selectedDoctor && selectedDate && (
                <div className="space-y-4">
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name[language]}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {selectedDoctor.name[language]}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("selectTime")}
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedDoctor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`
                          p-3 rounded-xl font-medium transition-all
                          ${
                            selectedTime === slot
                              ? "bg-blue-500 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={() => {
                  if (appointmentStep > 1) {
                    setAppointmentStep(appointmentStep - 1);
                  } else {
                    resetAppointmentModal();
                  }
                }}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {appointmentStep === 1 ? t("cancel") : "Back"}
              </button>

              <button
                onClick={() => {
                  if (appointmentStep < 3) {
                    setAppointmentStep(appointmentStep + 1);
                  } else {
                    handleBookAppointment();
                  }
                }}
                disabled={
                  (appointmentStep === 1 && !selectedDoctor) ||
                  (appointmentStep === 2 && !selectedDate) ||
                  (appointmentStep === 3 && !selectedTime)
                }
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {appointmentStep === 3 ? t("confirmBooking") : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ MOBILE BOTTOM NAVIGATION ━━━ */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-40">
          <div className="flex items-center justify-around py-2">
            {[
              { id: "dashboard", icon: Home },
              { id: "chat", icon: MessageCircle },
              { id: "appointments", icon: Calendar },
              { id: "doctors", icon: Stethoscope },
              { id: "notifications", icon: Bell },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`p-3 rounded-xl transition-colors ${
                  activeView === item.id
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <item.icon size={24} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

