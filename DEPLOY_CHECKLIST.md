# ✅ Checklist النشر - Hayat AI Clinic

## 🔍 قبل النشر

### الملفات الأساسية
- [ ] `package.json` موجود ومحدث
- [ ] `tsconfig.json` صحيح
- [ ] `next.config.ts` موجود
- [ ] `vercel.json` موجود
- [ ] `.gitignore` موجود

### الكود
- [ ] لا أخطاء TypeScript: `npm run build`
- [ ] لا أخطاء ESLint: `npm run lint`
- [ ] جميع المسارات صحيحة
- [ ] جميع الاستيرادات تعمل

### متغيرات البيئة
- [ ] `OPENAI_API_KEY` (مطلوب!)
- [ ] `OPENAI_MODEL`
- [ ] `TEMPERATURE`
- [ ] `MAX_TOKENS`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_APP_NAME`
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] `NEXT_PUBLIC_PHONE_NUMBER`
- [ ] `NEXT_PUBLIC_EMAIL`

---

## 🚀 خطوات النشر

### 1. إعداد Git
- [ ] `git init` (إذا لم يكن موجوداً)
- [ ] `git add .`
- [ ] `git commit -m "Ready for deployment"`
- [ ] رفع إلى GitHub

### 2. إعداد Vercel
- [ ] تسجيل الدخول إلى Vercel
- [ ] إنشاء Project جديد
- [ ] ربط GitHub Repository
- [ ] إضافة Environment Variables
- [ ] Deploy

### 3. بعد النشر
- [ ] فحص الموقع يعمل
- [ ] فحص Chat AI يعمل
- [ ] فحص API endpoints
- [ ] فحص Console للأخطاء

---

## 🔧 إعدادات Vercel

### Build Settings
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Environment Variables
أضف جميع المتغيرات من القائمة أعلاه

---

## ✅ التحقق النهائي

- [ ] الموقع يفتح: https://your-domain.vercel.app
- [ ] الصفحة الرئيسية تعمل
- [ ] Chat AI يعمل
- [ ] API `/api/chat` يعمل
- [ ] لا أخطاء في Console
- [ ] لا أخطاء في Network

---

**🎉 جاهز!**




