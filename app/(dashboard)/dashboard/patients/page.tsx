"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Filter,
  Phone,
  Mail,
  Calendar,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Tag,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// Mock patients data
const patients = [
  {
    id: "1",
    name: "نورة السعيد",
    email: "noura@example.com",
    phone: "+966501234567",
    gender: "female",
    dateOfBirth: "1990-05-15",
    totalVisits: 8,
    lastVisit: "2024-01-15",
    totalSpent: 12500,
    tags: ["VIP", "بوتوكس"],
    notes: "تفضل مواعيد الصباح",
  },
  {
    id: "2",
    name: "عبدالله العتيبي",
    email: "abdullah@example.com",
    phone: "+966507654321",
    gender: "male",
    dateOfBirth: "1985-08-22",
    totalVisits: 3,
    lastVisit: "2024-01-10",
    totalSpent: 8500,
    tags: ["زراعة شعر"],
    notes: "",
  },
  {
    id: "3",
    name: "منى الشمري",
    email: "muna@example.com",
    phone: "+966509876543",
    gender: "female",
    dateOfBirth: "1995-12-03",
    totalVisits: 1,
    lastVisit: "2024-01-18",
    totalSpent: 1500,
    tags: ["جديد"],
    notes: "أول زيارة",
  },
  {
    id: "4",
    name: "خالد الدوسري",
    email: "khaled@example.com",
    phone: "+966502345678",
    gender: "male",
    dateOfBirth: "1988-03-10",
    totalVisits: 5,
    lastVisit: "2024-01-12",
    totalSpent: 7500,
    tags: ["ليزر"],
    notes: "حساسية من بعض المواد",
  },
  {
    id: "5",
    name: "هند القحطاني",
    email: "hind@example.com",
    phone: "+966508765432",
    gender: "female",
    dateOfBirth: "1992-07-25",
    totalVisits: 12,
    lastVisit: "2024-01-17",
    totalSpent: 25000,
    tags: ["VIP", "عضوية ذهبية"],
    notes: "",
  },
  {
    id: "6",
    name: "فهد المالكي",
    email: "fahad@example.com",
    phone: "+966503456789",
    gender: "male",
    dateOfBirth: "1980-11-08",
    totalVisits: 6,
    lastVisit: "2024-01-05",
    totalSpent: 15000,
    tags: ["زراعة شعر", "VIP"],
    notes: "",
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.includes(searchQuery) ||
      patient.phone.includes(searchQuery) ||
      patient.email.includes(searchQuery)
  );

  const handleExport = () => {
    const csvContent = [
      ["الاسم", "البريد", "الهاتف", "الجنس", "الزيارات", "آخر زيارة", "المصروف"],
      ...patients.map((p) => [
        p.name,
        p.email,
        p.phone,
        p.gender === "male" ? "ذكر" : "أنثى",
        p.totalVisits.toString(),
        p.lastVisit,
        p.totalSpent.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">المرضى</h2>
          <p className="text-slate-400">إدارة سجلات المرضى</p>
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
            مريض جديد
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف أو البريد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/50 py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10">
          <Filter className="h-4 w-4" />
          فلترة
        </button>
      </div>

      {/* Patients Table */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-right">
              <th className="px-6 py-4 text-sm font-medium text-slate-400">المريض</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">التواصل</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">الزيارات</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">آخر زيارة</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">المصروف</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">الوسوم</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{patient.name}</p>
                      <p className="text-xs text-slate-400">
                        {patient.gender === "male" ? "ذكر" : "أنثى"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      {patient.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{patient.totalVisits}</span>
                  <span className="text-slate-500"> زيارة</span>
                </td>
                <td className="px-6 py-4 text-slate-300">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className="font-medium text-emerald-400">
                    {patient.totalSpent.toLocaleString()}
                  </span>
                  <span className="text-slate-500"> ر.س</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {patient.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          tag === "VIP"
                            ? "bg-amber-500/20 text-amber-300"
                            : tag === "جديد"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <p className="text-sm text-slate-400">
            عرض {filteredPatients.length} من {patients.length} مريض
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-sm text-white">1</span>
            <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-2xl font-bold text-slate-900">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedPatient.name}</h3>
                  <p className="text-slate-400">{selectedPatient.email}</p>
                  <div className="mt-2 flex gap-2">
                    {selectedPatient.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          tag === "VIP"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{selectedPatient.totalVisits}</p>
                <p className="text-sm text-slate-400">زيارة</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {selectedPatient.totalSpent.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">ر.س مصروف</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">{selectedPatient.lastVisit}</p>
                <p className="text-sm text-slate-400">آخر زيارة</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-400 mb-2">معلومات الاتصال</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {selectedPatient.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {selectedPatient.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {selectedPatient.dateOfBirth}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-400 mb-2">ملاحظات</p>
                <p className="text-sm text-white">
                  {selectedPatient.notes || "لا توجد ملاحظات"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white transition hover:bg-white/5">
                عرض السجل الطبي
              </button>
              <button className="flex-1 rounded-lg bg-cyan-500 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400">
                حجز موعد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">مريض جديد</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">الاسم الكامل</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المريض"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">رقم الهاتف</label>
                  <input
                    type="tel"
                    placeholder="+966"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">تاريخ الميلاد</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">الجنس</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none">
                    <option value="">اختر</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
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
                  حفظ المريض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

