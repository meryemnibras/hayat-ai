# 🚀 دليل النشر على Vercel - عيادة حياة للتجميل

## ✅ التحقق من الجاهزية

قبل البدء، تأكد من:

- [x] ✅ جميع الملفات محفوظة
- [x] ✅ `package.json` يحتوي على جميع المكتبات
- [x] ✅ `.env.example` موجود
- [x] ✅ `vercel.json` موجود
- [x] ✅ `next.config.ts` محدث
- [x] ✅ المشروع يعمل محلياً (`npm run dev`)

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

سيطلب منك فتح المتصفح وتسجيل الدخول بحساب Vercel.

### الخطوة 3: الانتقال إلى مجلد المشروع

```bash
cd hayat-ai
```

### الخطوة 4: النشر الأولي (Preview)

```bash
vercel
```

سيطلب منك:
- **Set up and deploy?** → اضغط `Y`
- **Which scope?** → اختر حسابك
- **Link to existing project?** → اضغط `N` (للمشروع الأول)
- **What's your project's name?** → `hayat-ai` (أو أي اسم تريده)
- **In which directory is your code located?** → `./` (اضغط Enter)

### الخطوة 5: إضافة Environment Variables

```bash
# إضافة OPENAI_API_KEY
vercel env add OPENAI_API_KEY

# عند السؤال:
# - What's the value of OPENAI_API_KEY? → الصق API Key
# - Which Environments should it be available on? → اختر Production, Preview, Development (أو اضغط Enter للكل)

# إضافة باقي المتغيرات
vercel env add OPENAI_MODEL
# القيمة: gpt-4-turbo-preview

vercel env add TEMPERATURE
# القيمة: 0.7

vercel env add MAX_TOKENS
# القيمة: 2000

vercel env add NEXT_PUBLIC_APP_URL
# القيمة: https://your-project.vercel.app (سيتم تحديثها بعد النشر)

vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
# القيمة: 00905362266054

vercel env add NEXT_PUBLIC_PHONE_NUMBER
# القيمة: 00905362266054

vercel env add NEXT_PUBLIC_EMAIL
# القيمة: info@mediai.tr
```

### الخطوة 6: النشر للإنتاج

```bash
vercel --prod
```

✅ **تم النشر!** ستحصل على رابط مثل: `https://hayat-ai.vercel.app`

---

## 🌐 الطريقة 2: النشر عبر Vercel Dashboard (الأسهل)

### الخطوة 1: ربط Git Repository

1. اذهب إلى [https://vercel.com](https://vercel.com)
2. اضغط **"New Project"**
3. اربط Git Repository:
   - **GitHub** (موصى به)
   - **GitLab**
   - **Bitbucket**

### الخطوة 2: إعداد المشروع

1. **Import Git Repository** → اختر المشروع
2. **Project Name** → `hayat-ai` (أو أي اسم)
3. **Framework Preset** → Next.js (سيتم اكتشافه تلقائياً)
4. **Root Directory** → `hayat-ai` (إذا كان المشروع في مجلد فرعي)
5. **Build Command** → `npm run build` (افتراضي)
6. **Output Directory** → `.next` (افتراضي)
7. **Install Command** → `npm install` (افتراضي)

### الخطوة 3: إضافة Environment Variables

في قسم **Environment Variables**، أضف:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `OPENAI_API_KEY` | `sk-proj-xxx` | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-4-turbo-preview` | Production, Preview, Development |
| `TEMPERATURE` | `0.7` | Production, Preview, Development |
| `MAX_TOKENS` | `2000` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production, Preview, Development |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `00905362266054` | Production, Preview, Development |
| `NEXT_PUBLIC_PHONE_NUMBER` | `00905362266054` | Production, Preview, Development |
| `NEXT_PUBLIC_EMAIL` | `info@mediai.tr` | Production, Preview, Development |

**ملاحظة:** بعد النشر الأول، عد إلى Settings → Environment Variables وأضف `NEXT_PUBLIC_APP_URL` بالقيمة الفعلية للموقع.

### الخطوة 4: النشر

1. اضغط **"Deploy"**
2. انتظر 2-3 دقائق
3. ✅ **تم النشر!**

---

## 🔧 بعد النشر

### 1. تحديث NEXT_PUBLIC_APP_URL

بعد الحصول على رابط الموقع:

1. اذهب إلى **Settings** → **Environment Variables**
2. عدّل `NEXT_PUBLIC_APP_URL` بالقيمة الفعلية:
   ```
   https://hayat-ai.vercel.app
   ```
3. **Redeploy** المشروع (سيتم إعادة النشر تلقائياً)

### 2. اختبار الموقع

افتح الرابط واختبر:

- [ ] ✅ الصفحة الرئيسية تفتح
- [ ] ✅ المحادثة تعمل
- [ ] ✅ WhatsApp Widget يظهر
- [ ] ✅ الألوان والتصميم صحيح
- [ ] ✅ RTL يعمل بشكل صحيح
- [ ] ✅ API endpoints تعمل (`/api/chat`)

### 3. ربط Domain مخصص (اختياري)

1. اذهب إلى **Settings** → **Domains**
2. اضغط **"Add Domain"**
3. أدخل Domain: `hayat-clinic.com` (أو أي domain)
4. اتبع التعليمات لإضافة DNS records

### 4. تفعيل Analytics

1. اذهب إلى **Analytics** tab
2. اضغط **"Enable Web Analytics"**
3. (اختياري) أضف Google Analytics ID في Environment Variables

---

## 🔍 استكشاف الأخطاء

### خطأ: Build Failed

**الحل:**
```bash
# اختبر البناء محلياً
npm run build

# إذا نجح محلياً، تحقق من:
# 1. Environment Variables موجودة في Vercel
# 2. جميع المكتبات مثبتة في package.json
```

### خطأ: API Route Not Found

**الحل:**
- تأكد من أن الملفات في `src/app/api/` موجودة
- تحقق من أن `route.ts` موجود في كل API endpoint

### خطأ: Environment Variable Missing

**الحل:**
1. اذهب إلى **Settings** → **Environment Variables**
2. تأكد من إضافة جميع المتغيرات المطلوبة
3. **Redeploy** المشروع

### خطأ: Prisma Client Not Generated

**الحل:**
- تأكد من أن `postinstall` script موجود في `package.json`:
  ```json
  "postinstall": "prisma generate"
  ```
- أو أضف `prisma generate` في Build Command في Vercel

---

## 📊 Monitoring & Logs

### عرض Logs

1. اذهب إلى **Deployments** tab
2. اختر آخر deployment
3. اضغط **"View Function Logs"**

### Real-time Logs

```bash
vercel logs --follow
```

---

## 🔄 التحديثات المستقبلية

بعد ربط Git Repository:

1. **Push** التغييرات إلى Git:
   ```bash
   git add .
   git commit -m "Update features"
   git push
   ```

2. **Vercel** سينشر تلقائياً! 🎉

---

## ✅ Checklist النشر النهائي

- [ ] ✅ تم ربط Git Repository
- [ ] ✅ تم إضافة جميع Environment Variables
- [ ] ✅ تم النشر بنجاح
- [ ] ✅ تم تحديث `NEXT_PUBLIC_APP_URL`
- [ ] ✅ تم اختبار الموقع
- [ ] ✅ تم اختبار المحادثة
- [ ] ✅ تم اختبار WhatsApp Widget
- [ ] ✅ تم ربط Domain مخصص (اختياري)
- [ ] ✅ تم تفعيل Analytics (اختياري)

---

## 🎉 مبروك!

التطبيق الآن متاح على الإنترنت! 🚀

**الرابط:** `https://your-project.vercel.app`

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من [Vercel Documentation](https://vercel.com/docs)
2. راجع Logs في Vercel Dashboard
3. اختبر البناء محلياً أولاً

---

**آخر تحديث:** 2024












