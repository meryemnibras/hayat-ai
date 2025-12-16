"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Bot,
  Clock,
  Download,
  Filter,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Mock data
const monthlyRevenue = [
  { month: "يناير", revenue: 45000, appointments: 120 },
  { month: "فبراير", revenue: 52000, appointments: 135 },
  { month: "مارس", revenue: 48000, appointments: 128 },
  { month: "أبريل", revenue: 61000, appointments: 155 },
  { month: "مايو", revenue: 55000, appointments: 142 },
  { month: "يونيو", revenue: 67000, appointments: 168 },
];

const treatmentBreakdown = [
  { name: "بوتوكس", value: 35, color: "#22d3ee" },
  { name: "فيلر", value: 25, color: "#34d399" },
  { name: "ليزر", value: 20, color: "#8b5cf6" },
  { name: "زراعة شعر", value: 12, color: "#f59e0b" },
  { name: "أخرى", value: 8, color: "#64748b" },
];

const aiPerformance = [
  { day: "الأحد", resolved: 85, escalated: 15 },
  { day: "الاثنين", resolved: 90, escalated: 10 },
  { day: "الثلاثاء", resolved: 88, escalated: 12 },
  { day: "الأربعاء", resolved: 92, escalated: 8 },
  { day: "الخميس", resolved: 87, escalated: 13 },
];

const patientSources = [
  { source: "WhatsApp", count: 145 },
  { source: "موقع الويب", count: 89 },
  { source: "إحالة", count: 67 },
  { source: "إنستغرام", count: 54 },
  { source: "مباشر", count: 32 },
];

const stats = [
  {
    title: "إجمالي الإيرادات",
    value: "328,000",
    unit: "ر.س",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "emerald",
  },
  {
    title: "المرضى الجدد",
    value: "234",
    unit: "مريض",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "cyan",
  },
  {
    title: "المواعيد المكتملة",
    value: "848",
    unit: "موعد",
    change: "+15.3%",
    trend: "up",
    icon: Calendar,
    color: "violet",
  },
  {
    title: "معدل الرد الآلي",
    value: "89%",
    unit: "",
    change: "+3.1%",
    trend: "up",
    icon: Bot,
    color: "amber",
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const handleExport = () => {
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      stats,
      monthlyRevenue,
      treatmentBreakdown,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${period}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">التحليلات</h2>
          <p className="text-slate-400">تقارير الأداء والإحصائيات</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex rounded-lg border border-white/10 bg-white/5">
            {(["week", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm transition ${
                  period === p
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {p === "week" ? "أسبوع" : p === "month" ? "شهر" : "سنة"}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400"
          >
            <Download className="h-4 w-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, { bg: string; icon: string }> = {
            emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400" },
            cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-400" },
            violet: { bg: "bg-violet-500/10", icon: "text-violet-400" },
            amber: { bg: "bg-amber-500/10", icon: "text-amber-400" },
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
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">
                  {stat.value}
                  {stat.unit && (
                    <span className="mr-1 text-lg font-normal text-slate-400">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">الإيرادات الشهرية</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${(value as number)?.toLocaleString() ?? 0} ر.س`, "الإيرادات"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#34d399"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treatment Breakdown */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">توزيع العلاجات</h3>
          <div className="flex items-center">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {treatmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "النسبة"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {treatmentBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Performance */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">أداء المساعد الذكي</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiPerformance}>
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
                  dataKey="resolved"
                  fill="#22d3ee"
                  name="تم الحل"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="escalated"
                  fill="#f59e0b"
                  name="تم التصعيد"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-400" />
              <span className="text-sm text-slate-400">تم الحل آلياً</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="text-sm text-slate-400">تم التصعيد للموظف</span>
            </div>
          </div>
        </div>

        {/* Patient Sources */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">مصادر المرضى</h3>
          <div className="space-y-4">
            {patientSources.map((source, index) => {
              const maxCount = Math.max(...patientSources.map((s) => s.count));
              const percentage = (source.count / maxCount) * 100;

              return (
                <div key={source.source}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300">{source.source}</span>
                    <span className="text-sm font-medium text-white">{source.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-l from-cyan-400 to-emerald-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-2xl font-bold text-white">2.5 ثانية</p>
              <p className="text-xs text-slate-400">متوسط وقت الرد</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-xs text-slate-400">محادثة هذا الشهر</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-violet-400" />
            <div>
              <p className="text-2xl font-bold text-white">4.8/5</p>
              <p className="text-xs text-slate-400">تقييم المرضى</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-white">92%</p>
              <p className="text-xs text-slate-400">معدل الحضور</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

