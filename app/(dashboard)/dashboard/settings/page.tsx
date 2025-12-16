"use client";

import React, { useState } from "react";
import {
  Building,
  User,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Bot,
  Users,
  Save,
  Upload,
  Check,
  AlertTriangle,
} from "lucide-react";

const tabs = [
  { id: "clinic", label: "العيادة", icon: Building },
  { id: "team", label: "الفريق", icon: Users },
  { id: "ai", label: "المساعد الذكي", icon: Bot },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "billing", label: "الفوترة", icon: CreditCard },
  { id: "security", label: "الأمان", icon: Shield },
];

const teamMembers = [
  { id: 1, name: "د. أحمد محمد", email: "ahmed@clinic.com", role: "admin", status: "active" },
  { id: 2, name: "د. سارة أحمد", email: "sara@clinic.com", role: "doctor", status: "active" },
  { id: 3, name: "نورة العلي", email: "noura@clinic.com", role: "staff", status: "active" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("clinic");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">الإعدادات</h2>
        <p className="text-slate-400">إدارة إعدادات العيادة والنظام</p>
      </div>

      <div className="flex gap-8">
        {/* Tabs Navigation */}
        <div className="w-56 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          {/* Clinic Settings */}
          {activeTab === "clinic" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">إعدادات العيادة</h3>

              <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-3xl font-bold text-slate-900">
                  ح
                </div>
                <div>
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    <Upload className="h-4 w-4" />
                    تغيير الشعار
                  </button>
                  <p className="mt-2 text-xs text-slate-500">PNG, JPG حتى 2MB</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">اسم العيادة</label>
                  <input
                    type="text"
                    defaultValue="عيادة الحياة التجميلية"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">البريد الإلكتروني</label>
                  <input
                    type="email"
                    defaultValue="info@hayat-clinic.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">رقم الهاتف</label>
                  <input
                    type="tel"
                    defaultValue="+966501234567"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">المنطقة الزمنية</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none">
                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                    <option value="Asia/Dubai">دبي (GMT+4)</option>
                    <option value="Europe/Istanbul">إسطنبول (GMT+3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">العنوان</label>
                <textarea
                  rows={2}
                  defaultValue="حي الملقا، الرياض، المملكة العربية السعودية"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Team Settings */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">إدارة الفريق</h3>
                <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400">
                  إضافة عضو
                </button>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          member.role === "admin"
                            ? "bg-amber-500/20 text-amber-300"
                            : member.role === "doctor"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {member.role === "admin"
                          ? "مدير"
                          : member.role === "doctor"
                          ? "طبيب"
                          : "موظف"}
                      </span>
                      <button className="text-sm text-slate-400 hover:text-white">
                        تعديل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">إعدادات المساعد الذكي</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">اسم المساعد</label>
                  <input
                    type="text"
                    defaultValue="هيا"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-400">شخصية المساعد</label>
                  <textarea
                    rows={3}
                    defaultValue="مساعدة ودودة ومتعاطفة تساعد المرضى في استفساراتهم عن العلاجات التجميلية وحجز المواعيد."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">اللغات المدعومة</label>
                  <div className="flex flex-wrap gap-2">
                    {["العربية", "الإنجليزية", "التركية", "الفرنسية"].map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                      >
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">أوقات العمل الآلي</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500">من</label>
                      <input
                        type="time"
                        defaultValue="00:00"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">إلى</label>
                      <input
                        type="time"
                        defaultValue="23:59"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-300">تنبيه</p>
                      <p className="text-sm text-amber-200/80">
                        المساعد لن يقدم تشخيصات طبية أو يصف أدوية. سيحول الأسئلة الطبية المعقدة إلى الفريق الطبي.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400"
                >
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">إعدادات الإشعارات</h3>

              <div className="space-y-4">
                {[
                  { id: "new_message", label: "رسالة جديدة", desc: "عند استلام رسالة من مريض" },
                  { id: "new_appointment", label: "موعد جديد", desc: "عند حجز موعد جديد" },
                  { id: "appointment_reminder", label: "تذكير بالموعد", desc: "قبل الموعد بساعة" },
                  { id: "escalation", label: "تصعيد محادثة", desc: "عند تصعيد محادثة للفريق" },
                  { id: "usage_alert", label: "تنبيه الاستخدام", desc: "عند اقتراب الحد الشهري" },
                ].map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-medium text-white">{notif.label}</p>
                      <p className="text-sm text-slate-400">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:right-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-cyan-500 peer-checked:after:translate-x-[-100%]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">الفوترة والاشتراك</h3>

              {/* Current Plan */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-200">الباقة الحالية</p>
                    <p className="text-2xl font-bold text-white">Professional</p>
                    <p className="text-sm text-slate-400">5,000 تفاعل/شهر • 4 لغات</p>
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-bold text-white">$500</p>
                    <p className="text-sm text-slate-400">/شهر</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">الاستخدام هذا الشهر</span>
                    <span className="text-white">3,245 / 5,000</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-l from-cyan-400 to-emerald-400"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white transition hover:bg-white/5">
                  تغيير الباقة
                </button>
                <button className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white transition hover:bg-white/5">
                  إدارة طريقة الدفع
                </button>
                <button className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white transition hover:bg-white/5">
                  عرض الفواتير
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">الأمان والخصوصية</h3>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">المصادقة الثنائية</p>
                      <p className="text-sm text-slate-400">طبقة حماية إضافية لحسابك</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-4 w-4" />
                      مفعّل
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">تشفير البيانات</p>
                      <p className="text-sm text-slate-400">AES-256 encryption</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-4 w-4" />
                      مفعّل
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="font-medium text-white">تغيير كلمة المرور</p>
                  <p className="mb-4 text-sm text-slate-400">آخر تغيير: منذ 30 يوم</p>
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    تغيير كلمة المرور
                  </button>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="font-medium text-white">سجل النشاط</p>
                  <p className="mb-4 text-sm text-slate-400">عرض جميع عمليات تسجيل الدخول</p>
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    عرض السجل
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

