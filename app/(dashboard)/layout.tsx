"use client";

import React from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import LandingFooter from "@/components/shared/LandingFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50" dir="rtl">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="pr-64">
          {/* Top Header */}
          <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 px-8 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">مرحباً بك مجدداً</p>
                <h1 className="text-xl font-semibold text-white">عيادة الحياة التجميلية</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-emerald-300">متصل</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-8">{children}</main>

          {/* Footer */}
          <LandingFooter />
        </div>
      </div>
    </QueryProvider>
  );
}
