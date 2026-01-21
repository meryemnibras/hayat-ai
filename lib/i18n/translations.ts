import { SupportedLanguage } from "./config";

export type TranslationKey =
  | "common.welcome"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.edit"
  | "common.search"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "dashboard.title"
  | "dashboard.overview"
  | "dashboard.appointments"
  | "dashboard.patients"
  | "dashboard.conversations"
  | "dashboard.analytics"
  | "appointments.title"
  | "appointments.new"
  | "appointments.upcoming"
  | "appointments.past"
  | "patients.title"
  | "patients.new"
  | "patients.search"
  | "notifications.title"
  | "notifications.new"
  | "notifications.markAllRead";

export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  ar: {
    "common.welcome": "مرحباً",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.search": "بحث",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "تم بنجاح",
    "dashboard.title": "لوحة التحكم",
    "dashboard.overview": "نظرة عامة",
    "dashboard.appointments": "المواعيد",
    "dashboard.patients": "المرضى",
    "dashboard.conversations": "المحادثات",
    "dashboard.analytics": "التحليلات",
    "appointments.title": "المواعيد",
    "appointments.new": "موعد جديد",
    "appointments.upcoming": "المواعيد القادمة",
    "appointments.past": "المواعيد السابقة",
    "patients.title": "المرضى",
    "patients.new": "مريض جديد",
    "patients.search": "بحث عن مريض",
    "notifications.title": "الإشعارات",
    "notifications.new": "إشعار جديد",
    "notifications.markAllRead": "تحديد الكل كمقروء",
  },
  en: {
    "common.welcome": "Welcome",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview",
    "dashboard.appointments": "Appointments",
    "dashboard.patients": "Patients",
    "dashboard.conversations": "Conversations",
    "dashboard.analytics": "Analytics",
    "appointments.title": "Appointments",
    "appointments.new": "New Appointment",
    "appointments.upcoming": "Upcoming",
    "appointments.past": "Past",
    "patients.title": "Patients",
    "patients.new": "New Patient",
    "patients.search": "Search Patient",
    "notifications.title": "Notifications",
    "notifications.new": "New Notification",
    "notifications.markAllRead": "Mark All as Read",
  },
  tr: {
    "common.welcome": "Hoş geldiniz",
    "common.save": "Kaydet",
    "common.cancel": "İptal",
    "common.delete": "Sil",
    "common.edit": "Düzenle",
    "common.search": "Ara",
    "common.loading": "Yükleniyor...",
    "common.error": "Bir hata oluştu",
    "common.success": "Başarılı",
    "dashboard.title": "Kontrol Paneli",
    "dashboard.overview": "Genel Bakış",
    "dashboard.appointments": "Randevular",
    "dashboard.patients": "Hastalar",
    "dashboard.conversations": "Konuşmalar",
    "dashboard.analytics": "Analitik",
    "appointments.title": "Randevular",
    "appointments.new": "Yeni Randevu",
    "appointments.upcoming": "Yaklaşan",
    "appointments.past": "Geçmiş",
    "patients.title": "Hastalar",
    "patients.new": "Yeni Hasta",
    "patients.search": "Hasta Ara",
    "notifications.title": "Bildirimler",
    "notifications.new": "Yeni Bildirim",
    "notifications.markAllRead": "Tümünü Okundu İşaretle",
  },
  fr: {
    "common.welcome": "Bienvenue",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.search": "Rechercher",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.success": "Succès",
    "dashboard.title": "Tableau de bord",
    "dashboard.overview": "Vue d'ensemble",
    "dashboard.appointments": "Rendez-vous",
    "dashboard.patients": "Patients",
    "dashboard.conversations": "Conversations",
    "dashboard.analytics": "Analyses",
    "appointments.title": "Rendez-vous",
    "appointments.new": "Nouveau rendez-vous",
    "appointments.upcoming": "À venir",
    "appointments.past": "Passé",
    "patients.title": "Patients",
    "patients.new": "Nouveau patient",
    "patients.search": "Rechercher un patient",
    "notifications.title": "Notifications",
    "notifications.new": "Nouvelle notification",
    "notifications.markAllRead": "Tout marquer comme lu",
  },
};

export function t(key: TranslationKey, lang: SupportedLanguage = "ar"): string {
  return translations[lang]?.[key] || key;
}

















