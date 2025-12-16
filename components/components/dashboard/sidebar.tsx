"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "نظرة عامة", labelEn: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/conversations", label: "المحادثات", labelEn: "Conversations", icon: MessageSquare },
  { href: "/dashboard/appointments", label: "المواعيد", labelEn: "Appointments", icon: Calendar },
  { href: "/dashboard/patients", label: "المرضى", labelEn: "Patients", icon: Users },
  { href: "/dashboard/analytics", label: "التحليلات", labelEn: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", labelEn: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-slate-900/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400">
          <Sparkles className="h-5 w-5 text-slate-900" />
        </div>
        <div>
          <p className="font-semibold text-white">Hayat AI</p>
          <p className="text-xs text-slate-400">لوحة التحكم</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-cyan-400" : ""}`} />
              <span>{item.label}</span>
              {item.href === "/dashboard/conversations" && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500/20 px-1.5 text-xs text-cyan-300">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/5 p-4">
        {/* Notifications */}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
          <span>الإشعارات</span>
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/20 px-1.5 text-xs text-red-400">
            2
          </span>
        </button>

        {/* User */}
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-sm font-semibold text-white">
            د
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-white">د. أحمد محمد</p>
            <p className="truncate text-xs text-slate-400">مدير العيادة</p>
          </div>
          <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

