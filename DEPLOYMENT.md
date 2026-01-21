# 🚀 دليل النشر على Vercel

## الطريقة 1: عبر Vercel CLI (للمطورين)

### الخطوة 1: تثبيت Vercel CLI

```bash
npm install -g vercel
```

### الخطوة 2: تسجيل الدخول

```bash
vercel login
```

سيتم فتح المتصفح تلقائياً لتسجيل الدخول.

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
- **Link to existing project?** → اضغط `N` (مشروع جديد)
- **What's your project's name?** → `hayat-ai` أو أي اسم
- **In which directory is your code located?** → اضغط `Enter` (الحالي)

### الخطوة 5: إضافة Environment Variables

```bash
# إضافة OPENAI_API_KEY
vercel env add OPENAI_API_KEY
# اختر: Production, Preview, Development
# الصق API Key عند السؤال

# إضافة باقي المتغيرات
vercel env add OPENAI_MODEL production
vercel env add TEMPERATURE production
vercel env add MAX_TOKENS production
vercel env add NEXT_PUBLIC_APP_URL production
```

أو أضفها جميعاً دفعة واحدة:

```bash
vercel env add OPENAI_API_KEY production
# الصق: sk-proj-your-api-key-here

vercel env add OPENAI_MODEL production
# الصق: gpt-4-turbo-preview

vercel env add TEMPERATURE production
# الصق: 0.7

vercel env add MAX_TOKENS production
# الصق: 2000

vercel env add NEXT_PUBLIC_APP_URL production
# الصق: https://your-project.vercel.app (بعد النشر)
```

### الخطوة 6: النشر للإنتاج

```bash
vercel --prod
```

---

## الطريقة 2: عبر Vercel Dashboard (الأسهل) ⭐

### الخطوة 1: إنشاء حساب

1. ادخل على: https://vercel.com
2. سجل دخول باستخدام GitHub/GitLab/Bitbucket

### الخطوة 2: ربط المشروع

1. اضغط **"New Project"**
2. اختر **"Import Git Repository"**
3. اختر المستودع الخاص بك
4. اضغط **"Import"**

### الخطوة 3: إعداد المشروع

1. **Project Name**: `hayat-ai` (أو أي اسم)
2. **Framework Preset**: Next.js (سيتم اكتشافه تلقائياً)
3. **Root Directory**: `./` (أو `hayat-ai` إذا كان في مجلد فرعي)
4. **Build Command**: `npm run build` (افتراضي)
5. **Output Directory**: `.next` (افتراضي)

### الخطوة 4: إضافة Environment Variables

في قسم **"Environment Variables"**، أضف:

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENAI_API_KEY` | `sk-proj-your-api-key-here` | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-4-turbo-preview` | Production, Preview, Development |
| `TEMPERATURE` | `0.7` | Production, Preview, Development |
| `MAX_TOKENS` | `2000` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production, Preview, Development |

**ملاحظة**: `NEXT_PUBLIC_APP_URL` يجب تحديثه بعد النشر بالرابط الفعلي.

### الخطوة 5: النشر

1. اضغط **"Deploy"**
2. انتظر 2-3 دقائق
3. ✅ جاهز! ستحصل على رابط:
   ```
   https://your-project.vercel.app
   ```

---

## بعد النشر

### 1. اختبار الموقع

- ✅ جرب المحادثة مع AI
- ✅ تأكد من ظهور WhatsApp Widget
- ✅ اختبر على الموبايل
- ✅ تحقق من الألوان والتنسيق

### 2. تحديث NEXT_PUBLIC_APP_URL

بعد الحصول على الرابط الفعلي:

1. اذهب إلى **Settings** > **Environment Variables**
2. عدّل `NEXT_PUBLIC_APP_URL` بالرابط الجديد
3. أعد النشر (سيتم تلقائياً عند push جديد)

### 3. ربط Domain مخصص (اختياري)

1. اذهب إلى **Settings** > **Domains**
2. اضغط **"Add Domain"**
3. أدخل: `hayat-clinic.com` (أو أي domain)
4. اتبع التعليمات لإعداد DNS

### 4. تفعيل Analytics

1. اذهب إلى **Analytics** tab
2. اضغط **"Enable Web Analytics"**
3. اختر الخطة المناسبة

### 5. إعداد Secrets (للـ API Keys الحساسة)

للحصول على أفضل أمان:

1. اذهب إلى **Settings** > **Environment Variables**
2. أضف `OPENAI_API_KEY` كـ **Secret**
3. استخدم `@openai-api-key` في `vercel.json`

---

## استكشاف الأخطاء

### خطأ: "Build Failed"

```bash
# تحقق من الأخطاء في Build Logs
# تأكد من:
- جميع Environment Variables موجودة
- package.json صحيح
- لا توجد أخطاء TypeScript
```

### خطأ: "API Key Invalid"

```bash
# تأكد من:
- OPENAI_API_KEY صحيح
- تم إضافته في Environment Variables
- تم اختيار Production, Preview, Development
```

### خطأ: "Module not found"

```bash
# تأكد من:
- جميع dependencies مثبتة في package.json
- لا توجد imports خاطئة
```

---

## نصائح مهمة

1. **استخدم Vercel Secrets** للمفاتيح الحساسة
2. **فعّل Preview Deployments** لاختبار التغييرات
3. **راقب Analytics** لتحسين الأداء
4. **استخدم Custom Domains** للعلامة التجارية
5. **فعّل Automatic HTTPS** (مفعل تلقائياً)

---

## روابط مفيدة

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 🔐 [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- 🌐 [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- 📊 [Analytics](https://vercel.com/docs/analytics)

---

✅ **جاهز للنشر!**













