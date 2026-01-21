# 🚀 نشر التطبيق على Vercel - عيادة حياة للتجميل

## ✅ المتطلبات قبل النشر

- [x] ✅ تم إنشاء `vercel.json`
- [x] ✅ تم إعداد NextAuth.js
- [x] ✅ تم إعداد Prisma Schema
- [x] ✅ تم إعداد Environment Variables في `.env.example`

---

## 📋 الطريقة 1: النشر عبر Vercel CLI

### الخطوة 1: تثبيت Vercel CLI

```bash
npm install -g vercel
```

### الخطوة 2: تسجيل الدخول

```bash
vercel login
```

سيطلب منك:
- فتح المتصفح
- تسجيل الدخول بحساب Vercel
- الموافقة على الصلاحيات

### الخطوة 3: النشر الأولي (Preview)

```bash
cd hayat-ai
vercel
```

سيطلب منك:
- **Set up and deploy?** → `Y`
- **Which scope?** → اختر حسابك
- **Link to existing project?** → `N` (للمرة الأولى)
- **What's your project's name?** → `hayat-ai` أو أي اسم تريده
- **In which directory is your code located?** → `./` (Enter)

### الخطوة 4: إضافة Environment Variables

```bash
# OpenAI API Key (Secret)
vercel secrets add openai-api-key
# الصق API Key عند السؤال

# Environment Variables
vercel env add OPENAI_MODEL production
# أدخل: gpt-4-turbo-preview

vercel env add TEMPERATURE production
# أدخل: 0.7

vercel env add MAX_TOKENS production
# أدخل: 2000

# NextAuth.js
vercel env add NEXTAUTH_SECRET production
# أدخل: secret-key-here (استخدم openssl rand -base64 32)

vercel env add NEXTAUTH_URL production
# أدخل: https://your-project.vercel.app (سيتم تحديثه بعد النشر)

# Database
vercel env add DATABASE_URL production
# أدخل: postgresql://user:password@host:5432/database

# Build Environment Variables
vercel env add NEXT_PUBLIC_APP_URL production
# أدخل: https://your-project.vercel.app

vercel env add NEXT_PUBLIC_APP_NAME production
# أدخل: Hayat Beauty Clinic

vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production
# أدخل: 00905362266054

vercel env add NEXT_PUBLIC_PHONE_NUMBER production
# أدخل: 00905362266054

vercel env add NEXT_PUBLIC_EMAIL production
# أدخل: info@mediai.tr

# Google OAuth (اختياري)
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

### الخطوة 5: النشر للإنتاج

```bash
vercel --prod
```

---

## 🌐 الطريقة 2: النشر عبر Vercel Dashboard (أسهل)

### الخطوة 1: الدخول إلى Vercel

1. ادخل على: https://vercel.com
2. سجّل الدخول بحساب GitHub/GitLab/Bitbucket

### الخطوة 2: إنشاء مشروع جديد

1. اضغط **"New Project"** أو **"Add New..."** > **"Project"**
2. اربط Git Repository:
   - اختر **GitHub** / **GitLab** / **Bitbucket**
   - سجّل الدخول وامنح الصلاحيات
   - اختر Repository: `hayat-ai` (أو اسم المشروع)

### الخطوة 3: إعداد المشروع

1. **Framework Preset**: Next.js (سيتم اكتشافه تلقائياً)
2. **Root Directory**: `./` أو `hayat-ai` (إذا كان المشروع في مجلد فرعي)
3. **Build Command**: `npm run build` (افتراضي)
4. **Output Directory**: `.next` (افتراضي)
5. **Install Command**: `npm install` (افتراضي)

### الخطوة 4: إضافة Environment Variables

قبل الضغط على **"Deploy"**، اضغط **"Environment Variables"** وأضف:

#### Secrets (مخفية):
```
openai-api-key = sk-proj-your-actual-key-here
```

#### Environment Variables (Production):
```
OPENAI_MODEL = gpt-4-turbo-preview
TEMPERATURE = 0.7
MAX_TOKENS = 2000
NEXTAUTH_SECRET = your-secret-key-here
NEXTAUTH_URL = https://your-project.vercel.app
DATABASE_URL = postgresql://user:password@host:5432/database
GOOGLE_CLIENT_ID = your-google-client-id (optional)
GOOGLE_CLIENT_SECRET = your-google-client-secret (optional)
```

#### Build Environment Variables (Production):
```
NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
NEXT_PUBLIC_APP_NAME = Hayat Beauty Clinic
NEXT_PUBLIC_WHATSAPP_NUMBER = 00905362266054
NEXT_PUBLIC_PHONE_NUMBER = 00905362266054
NEXT_PUBLIC_EMAIL = info@mediai.tr
```

**ملاحظة:** بعد النشر الأول، عد إلى Settings > Environment Variables وحدّث `NEXTAUTH_URL` و `NEXT_PUBLIC_APP_URL` برابط المشروع الفعلي.

### الخطوة 5: النشر

1. اضغط **"Deploy"**
2. انتظر (2-3 دقائق)
3. ✅ جاهز! ستحصل على رابط:
   ```
   https://your-project.vercel.app
   ```

---

## 🔧 بعد النشر

### 1. تحديث Environment Variables

بعد الحصول على رابط المشروع:

1. اذهب إلى **Settings** > **Environment Variables**
2. حدّث:
   - `NEXTAUTH_URL` → `https://your-project.vercel.app`
   - `NEXT_PUBLIC_APP_URL` → `https://your-project.vercel.app`
3. اضغط **"Redeploy"** لإعادة النشر

### 2. إعداد قاعدة البيانات

```bash
# على Vercel، استخدم Prisma Migrate
npx prisma migrate deploy

# أو عبر Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

### 3. اختبار الموقع

#### اختبارات أساسية:
- [ ] ✅ فتح الصفحة الرئيسية
- [ ] ✅ اختبار المحادثة (Chat Interface)
- [ ] ✅ اختبار WhatsApp Widget
- [ ] ✅ اختبار Quick Actions
- [ ] ✅ اختبار على الموبايل (Responsive)

#### اختبارات متقدمة:
- [ ] ✅ تسجيل الدخول (NextAuth.js)
- [ ] ✅ API Routes (`/api/chat`, `/api/chat/stream`)
- [ ] ✅ قاعدة البيانات (Prisma)

### 4. ربط Domain مخصص (اختياري)

1. اذهب إلى **Settings** > **Domains**
2. أضف Domain:
   - `hayat-clinic.com`
   - `www.hayat-clinic.com`
3. اتبع التعليمات لإضافة DNS records
4. انتظر (قد يستغرق بضع دقائق)

### 5. تفعيل Analytics

1. اذهب إلى **Analytics** tab
2. اضغط **"Enable Web Analytics"**
3. (اختياري) أضف Google Analytics ID في Environment Variables:
   ```
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```

---

## 🔍 استكشاف الأخطاء

### خطأ: "Build failed"

**الحل:**
1. تحقق من `package.json` scripts
2. تحقق من Environment Variables
3. راجع Build Logs في Vercel Dashboard

### خطأ: "Database connection failed"

**الحل:**
1. تحقق من `DATABASE_URL` في Environment Variables
2. تأكد من أن قاعدة البيانات متاحة من Vercel
3. تحقق من Firewall rules

### خطأ: "NEXTAUTH_SECRET is missing"

**الحل:**
1. أضف `NEXTAUTH_SECRET` في Environment Variables
2. أعد النشر

### خطأ: "OpenAI API Key invalid"

**الحل:**
1. تحقق من `openai-api-key` Secret
2. تأكد من إضافته كـ Secret وليس Environment Variable

---

## 📊 Checklist النشر الكامل

### قبل النشر:
- [ ] ✅ تم إعداد `vercel.json`
- [ ] ✅ تم إعداد `.env.example`
- [ ] ✅ تم إعداد Prisma Schema
- [ ] ✅ تم اختبار التطبيق محلياً (`npm run dev`)

### أثناء النشر:
- [ ] ✅ تم ربط Git Repository
- [ ] ✅ تم إضافة جميع Environment Variables
- [ ] ✅ تم إضافة Secrets (openai-api-key)
- [ ] ✅ تم النشر بنجاح

### بعد النشر:
- [ ] ✅ تم تحديث `NEXTAUTH_URL` و `NEXT_PUBLIC_APP_URL`
- [ ] ✅ تم إعداد قاعدة البيانات
- [ ] ✅ تم اختبار جميع الميزات
- [ ] ✅ (اختياري) تم ربط Domain مخصص
- [ ] ✅ (اختياري) تم تفعيل Analytics

---

## 🎉 مبروك!

التطبيق الآن متاح على:
```
https://your-project.vercel.app
```

### روابط مفيدة:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Status Page**: https://www.vercel-status.com

---

**آخر تحديث:** 2024











