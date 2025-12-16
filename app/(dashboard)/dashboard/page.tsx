"use client";

import React from "react";
import {
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock data for charts
const weeklyData = [
  { day: "الأحد", appointments: 12, conversations: 28 },
  { day: "الاثنين", appointments: 19, conversations: 35 },
  { day: "الثلاثاء", appointments: 15, conversations: 42 },
  { day: "الأربعاء", appointments: 22, conversations: 38 },
  { day: "الخميس", appointments: 18, conversations: 45 },
  { day: "الجمعة", appointments: 8, conversations: 20 },
  { day: "السبت", appointments: 14, conversations: 32 },
];

const recentConversations = [
  { id: 1, name: "سارة أحمد", message: "أريد حجز موعد للبوتوكس", time: "منذ 5 دقائق", status: "new" },
  { id: 2, name: "محمد علي", message: "ما هي تكلفة زراعة الشعر؟", time: "منذ 15 دقيقة", status: "replied" },
  { id: 3, name: "فاطمة خالد", message: "شكراً على الخدمة الممتازة", time: "منذ 30 دقيقة", status: "closed" },
  { id: 4, name: "أحمد حسن", message: "هل يمكنني تغيير موعدي؟", time: "منذ ساعة", status: "pending" },
];

const todayAppointments = [
  { id: 1, patient: "نورة السعيد", treatment: "فيلر الشفاه", time: "09:00", status: "completed" },
  { id: 2, patient: "عبدالله العتيبي", treatment: "استشارة زراعة شعر", time: "10:30", status: "completed" },
  { id: 3, patient: "منى الشمري", treatment: "بوتوكس", time: "12:00", status: "in-progress" },
  { id: 4, patient: "خالد الدوسري", treatment: "ليزر إزالة الشعر", time: "14:00", status: "upcoming" },
  { id: 5, patient: "هند القحطاني", treatment: "ميزوثيرابي", time: "15:30", status: "upcoming" },
];

const stats = [
  {
    title: "المواعيد اليوم",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Calendar,
    color: "cyan",
  },
  {
    title: "المحادثات النشطة",
    value: "28",
    change: "+12",
    trend: "up",
    icon: MessageSquare,
    color: "emerald",
  },
  {
    title: "مرضى جدد هذا الأسبوع",
    value: "45",
    change: "+8",
    trend: "up",
    icon: Users,
    color: "violet",
  },
  {
    title: "معدل الرد الآلي",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: Bot,
    color: "amber",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
            cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "text-cyan-300" },
            emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-300" },
            violet: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-300" },
            amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-300" },
          };
          const colors = colorClasses[stat.color];

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/5 bg-slate-900/50 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${colors.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Area Chart - Weekly Overview */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">نشاط الأسبوع</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#colorAppointments)"
                  name="المواعيد"
                />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke="#34d399"
                  fillOpacity={1}
                  fill="url(#colorConversations)"
                  name="المحادثات"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - AI Performance */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">أداء المساعد الذكي</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="conversations"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="المحادثات"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Conversations */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">أحدث المحادثات</h3>
            <a
              href="/dashboard/conversations"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              عرض الكل
            </a>
          </div>
          <div className="space-y-4">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                  {conv.name.charAt(0)}
                </div>
                <div className="flex-1 truncate">
                  <p className="font-medium text-white">{conv.name}</p>
                  <p className="truncate text-sm text-slate-400">{conv.message}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">{conv.time}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                      conv.status === "new"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : conv.status === "replied"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : conv.status === "pending"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {conv.status === "new"
                      ? "جديد"
                      : conv.status === "replied"
                      ? "تم الرد"
                      : conv.status === "pending"
                      ? "معلق"
                      : "مغلق"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">مواعيد اليوم</h3>
            <a
              href="/dashboard/appointments"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              عرض الكل
            </a>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="flex flex-col items-center rounded-lg bg-slate-800 px-3 py-2 text-center">
                  <Clock className="mb-1 h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-white">{apt.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{apt.patient}</p>
                  <p className="text-sm text-slate-400">{apt.treatment}</p>
                </div>
                <div>
                  {apt.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : apt.status === "in-progress" ? (
                    <div className="flex items-center gap-1 text-cyan-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                      <span className="text-xs">الآن</span>
                    </div>
                  ) : (
                    <AlertCircle className="h-5 w-5 text-slate-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

