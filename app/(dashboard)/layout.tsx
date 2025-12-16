"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import MediaiLogo, { MediaiIcon } from "@/components/shared/MediaiLogo";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 DASHBOARD CONTEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface DashboardContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardLayout");
  }
  return context;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 NAV ITEMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navItems = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "المحادثات", icon: MessageSquare, badge: 3 },
  { href: "/dashboard/appointments", label: "المواعيد", icon: Calendar },
  { href: "/dashboard/patients", label: "المرضى", icon: Users },
  { href: "/dashboard/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏗️ LAYOUT COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <QueryProvider>
      <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen, isDarkMode, setIsDarkMode }}>
        <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`} dir="rtl">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* ━━━ SIDEBAR ━━━ */}
            <aside
              className={`
                fixed inset-y-0 right-0 z-50 flex flex-col
                bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700
                shadow-xl transition-all duration-300
                ${sidebarOpen ? "w-64" : "w-20"}
              `}
            >
              {/* Logo */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
                <Link href="/" className="flex items-center gap-3">
                  {sidebarOpen ? (
                    <MediaiLogo size="sm" />
                  ) : (
                    <MediaiIcon size={40} />
                  )}
                </Link>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive
                          ? "bg-gradient-to-l from-green-500/10 to-cyan-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                        ${!sidebarOpen && "justify-center"}
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-500" : ""}`} />
                      {sidebarOpen && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="mr-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* User Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                {sidebarOpen ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-cyan-500 text-sm font-semibold text-white">
                      د
                    </div>
                    <div className="flex-1 truncate">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">د. أحمد محمد</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">مدير العيادة</p>
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-cyan-500 text-sm font-semibold text-white">
                      د
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* ━━━ MAIN CONTENT ━━━ */}
            <div className={`transition-all duration-300 ${sidebarOpen ? "mr-64" : "mr-20"}`}>
              
              {/* Top Header */}
              <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">مرحباً بك مجدداً 👋</p>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">عيادة الحياة التجميلية</h1>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
                      <Search size={18} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder="بحث..."
                        className="bg-transparent border-none outline-none mr-2 text-sm w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                      />
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      {isDarkMode ? (
                        <Sun size={20} className="text-yellow-500" />
                      ) : (
                        <Moon size={20} className="text-gray-600" />
                      )}
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        2
                      </span>
                    </button>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">متصل</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </div>
      </DashboardContext.Provider>
    </QueryProvider>
  );
}
