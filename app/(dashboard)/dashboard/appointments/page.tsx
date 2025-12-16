"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  User,
  MapPin,
  Phone,
  X,
  Check,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Mock appointments data
const appointments = [
  {
    id: "1",
    patient: "نورة السعيد",
    phone: "+966501234567",
    treatment: "فيلر الشفاه",
    doctor: "د. أحمد محمد",
    date: "2024-01-18",
    time: "09:00",
    duration: 45,
    status: "confirmed",
    notes: "زيارة متابعة",
  },
  {
    id: "2",
    patient: "عبدالله العتيبي",
    phone: "+966507654321",
    treatment: "استشارة زراعة شعر",
    doctor: "د. أحمد محمد",
    date: "2024-01-18",
    time: "10:30",
    duration: 30,
    status: "confirmed",
    notes: "",
  },
  {
    id: "3",
    patient: "منى الشمري",
    phone: "+966509876543",
    treatment: "بوتوكس",
    doctor: "د. سارة أحمد",
    date: "2024-01-18",
    time: "12:00",
    duration: 30,
    status: "pending",
    notes: "أول زيارة",
  },
  {
    id: "4",
    patient: "خالد الدوسري",
    phone: "+966502345678",
    treatment: "ليزر إزالة الشعر",
    doctor: "د. سارة أحمد",
    date: "2024-01-18",
    time: "14:00",
    duration: 60,
    status: "confirmed",
    notes: "الجلسة الثالثة",
  },
  {
    id: "5",
    patient: "هند القحطاني",
    phone: "+966508765432",
    treatment: "ميزوثيرابي",
    doctor: "د. أحمد محمد",
    date: "2024-01-19",
    time: "10:00",
    duration: 45,
    status: "confirmed",
    notes: "",
  },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const weekDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [view, setView] = useState<"week" | "day">("week");

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startHour = 8;
    const position = (hours - startHour) * 60 + minutes;
    return position;
  };

  const handleExport = () => {
    const csvContent = [
      ["المريض", "الهاتف", "العلاج", "الطبيب", "التاريخ", "الوقت", "الحالة"],
      ...appointments.map((apt) => [
        apt.patient,
        apt.phone,
        apt.treatment,
        apt.doctor,
        apt.date,
        apt.time,
        apt.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">المواعيد</h2>
          <p className="text-slate-400">إدارة مواعيد العيادة</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            تصدير
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            موعد جديد
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/50 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentDate(newDate);
            }}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {currentDate.toLocaleDateString("ar-SA", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentDate(newDate);
            }}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
          >
            اليوم
          </button>
          <div className="flex rounded-lg border border-white/10 bg-white/5">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1.5 text-sm transition ${
                view === "day" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              يوم
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 text-sm transition ${
                view === "week" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              أسبوع
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-6 border-b border-white/5">
          <div className="p-4 text-center text-sm text-slate-500">الوقت</div>
          {weekDates.map((date, i) => (
            <div
              key={i}
              className={`border-r border-white/5 p-4 text-center ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-cyan-500/10"
                  : ""
              }`}
            >
              <p className="text-sm text-slate-400">{weekDays[i]}</p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  date.toDateString() === new Date().toDateString()
                    ? "text-cyan-400"
                    : "text-white"
                }`}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="relative max-h-[600px] overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 border-b border-white/5">
              <div className="p-4 text-center text-sm text-slate-500">{time}</div>
              {weekDates.map((date, dayIndex) => {
                const dayAppointments = getAppointmentsForDate(date).filter(
                  (apt) => apt.time === time
                );
                return (
                  <div
                    key={dayIndex}
                    className="relative min-h-[60px] border-r border-white/5 p-1"
                  >
                    {dayAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={`w-full rounded-lg p-2 text-right text-xs transition hover:opacity-80 ${
                          apt.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : apt.status === "pending"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        <p className="font-medium truncate">{apt.patient}</p>
                        <p className="truncate text-slate-400">{apt.treatment}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">تفاصيل الموعد</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                  {selectedAppointment.patient.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{selectedAppointment.patient}</p>
                  <p className="text-sm text-slate-400">{selectedAppointment.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-slate-400 mb-1">العلاج</p>
                  <p className="text-sm text-white">{selectedAppointment.treatment}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-slate-400 mb-1">الطبيب</p>
                  <p className="text-sm text-white">{selectedAppointment.doctor}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-slate-400 mb-1">التاريخ</p>
                  <p className="text-sm text-white">{selectedAppointment.date}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-slate-400 mb-1">الوقت</p>
                  <p className="text-sm text-white">{selectedAppointment.time}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-slate-400 mb-1">ملاحظات</p>
                  <p className="text-sm text-white">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button className="flex-1 rounded-lg border border-red-500/50 py-2 text-sm text-red-400 transition hover:bg-red-500/10">
                  إلغاء الموعد
                </button>
                <button className="flex-1 rounded-lg bg-cyan-500 py-2 text-sm text-white transition hover:bg-cyan-400">
                  تعديل الموعد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">موعد جديد</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">المريض</label>
                <input
                  type="text"
                  placeholder="اسم المريض أو رقم الهاتف"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">العلاج</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none">
                  <option value="">اختر العلاج</option>
                  <option value="botox">بوتوكس</option>
                  <option value="filler">فيلر</option>
                  <option value="laser">ليزر</option>
                  <option value="consultation">استشارة</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">التاريخ</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">الوقت</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">الطبيب</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none">
                  <option value="">اختر الطبيب</option>
                  <option value="dr1">د. أحمد محمد</option>
                  <option value="dr2">د. سارة أحمد</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">ملاحظات</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات إضافية..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white transition hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cyan-500 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400"
                >
                  حفظ الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

