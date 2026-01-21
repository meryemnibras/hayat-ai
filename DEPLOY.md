# 🚀 دليل النشر الكامل - Hayat AI Clinic

## 📋 Checklist قبل النشر

### ✅ 1. التحقق من الملفات الأساسية
- [ ] ملف `.env` موجود (محلياً فقط - لا يُرفع)
- [ ] `package.json` محدث
- [ ] `tsconfig.json` صحيح
- [ ] `next.config.ts` جاهز
- [ ] `vercel.json` موجود (للنشر على Vercel)

### ✅ 2. التحقق من الكود
- [ ] لا توجد أخطاء TypeScript (`npm run build`)
- [ ] لا توجد أخطاء ESLint (`npm run lint`)
- [ ] جميع المسارات صحيحة
- [ ] جميع الاستيرادات تعمل

### ✅ 3. متغيرات البيئة المطلوبة

#### في Vercel Dashboard → Settings → Environment Variables:

```env
# OpenAI (مطلوب)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Hayat Beauty Clinic

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr

# Database (إذا كنت تستخدم Prisma)
DATABASE_URL=postgresql://...

# Twilio (إذا كنت تستخدم WhatsApp)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+...
```

---

## 🌐 النشر على Vercel

### الطريقة 1: عبر GitHub (موصى به)

1. **ارفع المشروع إلى GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/hayat-ai.git
   git push -u origin main
   ```

2. **في Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اضغط "New Project"
   - اختر المستودع من GitHub
   - أضف متغيرات البيئة
   - اضغط "Deploy"

### الطريقة 2: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd hayat-ai
vercel

# النشر للإنتاج
vercel --prod
```

---

## 🔧 إعدادات Vercel

### Build Settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (افتراضي)
- **Install Command**: `npm install`

### Environment Variables:
- أضف جميع المتغيرات من القائمة أعلاه
- **مهم**: `OPENAI_API_KEY` مطلوب!

---

## 📝 ملف vercel.json

الملف موجود في `hayat-ai/vercel.json` ويحتوي على:
- إعدادات البناء
- Headers للأمان
- Redirects
- Regions

### تحديث Domain:
```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://your-actual-domain.com"
    }
  }
}
```

---

## 🗄️ قاعدة البيانات (Prisma)

إذا كنت تستخدم Prisma:

### 1. إعداد Database:
- استخدم [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) أو
- [Supabase](https://supabase.com) أو
- أي PostgreSQL آخر

### 2. إضافة DATABASE_URL في Vercel:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### 3. تشغيل Migrations:
```bash
# محلياً
npm run db:migrate

# على Vercel (يتم تلقائياً في postinstall)
# أو يدوياً:
vercel env pull .env.local
npx prisma migrate deploy
```

---

## ✅ التحقق بعد النشر

### 1. فحص الموقع:
- [ ] الموقع يفتح بدون أخطاء
- [ ] الصفحة الرئيسية تعمل
- [ ] Chat AI يعمل
- [ ] API endpoints تعمل

### 2. فحص API:
```bash
# فحص Chat API
curl https://your-domain.vercel.app/api/chat

# يجب أن يعيد:
# {"status":"online","service":"Hayat AI Chat API",...}
```

### 3. فحص Console:
- افتح Developer Tools
- تحقق من عدم وجود أخطاء
- تحقق من Network requests

---

## 🐛 حل المشاكل الشائعة

### خطأ: OPENAI_API_KEY not found
- تأكد من إضافة `OPENAI_API_KEY` في Vercel Environment Variables
- تأكد من إعادة النشر بعد إضافة المتغيرات

### خطأ: Module not found
- تأكد من `package.json` يحتوي على جميع Dependencies
- شغّل `npm install` محلياً للتأكد

### خطأ: Build failed
- تحقق من Logs في Vercel Dashboard
- تأكد من عدم وجود أخطاء TypeScript
- تأكد من `next.config.ts` صحيح

### خطأ: Runtime error
- تحقق من Console في المتصفح
- تحقق من Server Logs في Vercel
- تأكد من جميع Environment Variables موجودة

---

## 🔄 التحديثات المستقبلية

### بعد أي تغيير:
```bash
git add .
git commit -m "Update: description"
git push
```

Vercel سينشر تلقائياً!

---

## 📞 الدعم

للمساعدة:
- **WhatsApp**: 00905362266054
- **Email**: info@mediai.tr

---

## ✅ Checklist النهائي

- [ ] المشروع على GitHub
- [ ] Vercel Project مرتبط
- [ ] جميع Environment Variables مضافة
- [ ] Build نجح
- [ ] الموقع يعمل
- [ ] Chat AI يعمل
- [ ] لا توجد أخطاء في Console

**🎉 جاهز للنشر!**




