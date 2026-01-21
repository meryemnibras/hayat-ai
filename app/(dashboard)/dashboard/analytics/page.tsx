"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  period: {
    start: string;
    end: string;
  };
  appointments: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
    bySource: Array<{ source: string; count: number }>;
    dailyTrend: Array<{ date: string; count: number }>;
  };
  patients: {
    total: number;
  };
  conversations: {
    total: number;
    messages: number;
  };
  topDoctors: Array<{
    doctor: {
      id: string;
      fullName: string;
      specialization: string;
    } | null;
    count: number;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinicId") || process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID || "";
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/analytics?clinicId=${clinicId}`);
        const result = await response.json();
        if (result.success) {
          setData(result.analytics);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    if (clinicId) {
      fetchAnalytics();
    }
  }, [clinicId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Period: {new Date(data.period.start).toLocaleDateString()} -{" "}
          {new Date(data.period.end).toLocaleDateString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400">Total Appointments</h3>
          <p className="text-3xl font-bold mt-2">{data.appointments.total}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400">Total Patients</h3>
          <p className="text-3xl font-bold mt-2">{data.patients.total}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400">Conversations</h3>
          <p className="text-3xl font-bold mt-2">{data.conversations.total}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-sm text-gray-400">Messages</h3>
          <p className="text-3xl font-bold mt-2">{data.conversations.messages}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Appointments by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.appointments.byStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.appointments.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments by Source */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Appointments by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.appointments.bySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trend */}
        <div className="bg-slate-800 p-6 rounded-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Daily Appointments Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.appointments.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Doctors */}
        <div className="bg-slate-800 p-6 rounded-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Top Doctors by Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.topDoctors.map((item) => ({
                name: item.doctor?.fullName || "Unknown",
                count: item.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
