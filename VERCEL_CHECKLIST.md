# ✅ Vercel Deployment Checklist

## قبل النشر

### 1. ملفات الإعداد
- [x] `vercel.json` موجود ومحدث
- [x] `.env.example` موجود للتوثيق
- [x] `.gitignore` يمنع `.env` من الرفع
- [x] `next.config.ts` محسّن للإنتاج

### 2. Environment Variables المطلوبة

تأكد من إضافة هذه المتغيرات في Vercel:

#### Required (مطلوبة)
- [ ] `OPENAI_API_KEY` - مفتاح OpenAI API
- [ ] `OPENAI_MODEL` - `gpt-4-turbo-preview`
- [ ] `TEMPERATURE` - `0.7`
- [ ] `MAX_TOKENS` - `2000`

#### Public (للعميل)
- [ ] `NEXT_PUBLIC_APP_URL` - رابط Vercel (يُحدّث بعد النشر)
- [ ] `NEXT_PUBLIC_APP_NAME` - `Hayat Beauty Clinic`
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` - `00905362266054`
- [ ] `NEXT_PUBLIC_PHONE_NUMBER` - `00905362266054`
- [ ] `NEXT_PUBLIC_EMAIL` - `info@mediai.tr`

#### Optional (اختيارية)
- [ ] `NEXT_PUBLIC_ENABLE_WHATSAPP_WIDGET` - `true`
- [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS` - `false`

### 3. اختبار محلي

قبل النشر، تأكد من:

```bash
# 1. بناء المشروع
npm run build

# 2. التحقق من عدم وجود أخطاء
npm run lint

# 3. تشغيل محلي
npm run dev
```

### 4. Git Repository

- [ ] المشروع موجود على GitHub/GitLab/Bitbucket
- [ ] جميع التغييرات تم commit
- [ ] تم push إلى main/master

---

## أثناء النشر

### Vercel Dashboard

1. [ ] تسجيل الدخول على https://vercel.com
2. [ ] ربط Git Repository
3. [ ] إضافة جميع Environment Variables
4. [ ] النقر على "Deploy"
5. [ ] انتظار اكتمال البناء (2-3 دقائق)

### Vercel CLI

```bash
# 1. تثبيت CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر الأولي
vercel

# 4. إضافة Environment Variables
vercel env add OPENAI_API_KEY production
# ... (كرر لكل متغير)

# 5. النشر للإنتاج
vercel --prod
```

---

## بعد النشر

### 1. اختبار الموقع

- [ ] الموقع يعمل: `https://your-project.vercel.app`
- [ ] صفحة الرئيسية تظهر بشكل صحيح
- [ ] المحادثة مع AI تعمل
- [ ] WhatsApp Widget يظهر ويعمل
- [ ] الألوان والتنسيق صحيحة
- [ ] الموقع يعمل على الموبايل

### 2. تحديث Environment Variables

- [ ] تحديث `NEXT_PUBLIC_APP_URL` بالرابط الفعلي
- [ ] إعادة النشر (أو انتظار push جديد)

### 3. إعدادات إضافية

- [ ] ربط Domain مخصص (اختياري)
- [ ] تفعيل Analytics (اختياري)
- [ ] إعداد Custom Headers (موجودة في vercel.json)

---

## استكشاف الأخطاء

### Build Failed

**السبب المحتمل:**
- Environment Variables مفقودة
- أخطاء TypeScript
- Dependencies غير مثبتة

**الحل:**
```bash
# تحقق من Build Logs في Vercel Dashboard
# أصلح الأخطاء محلياً
npm run build
```

### API Key Invalid

**السبب المحتمل:**
- `OPENAI_API_KEY` غير صحيح
- لم يتم إضافته في Environment Variables

**الحل:**
1. تحقق من API Key في OpenAI Dashboard
2. أضفه في Vercel Environment Variables
3. أعد النشر

### Module Not Found

**السبب المحتمل:**
- Import خاطئ
- Dependency مفقودة

**الحل:**
```bash
# تحقق من package.json
# تأكد من تثبيت جميع dependencies
npm install
```

---

## روابط سريعة

- 🔗 [Vercel Dashboard](https://vercel.com/dashboard)
- 📚 [Vercel Docs](https://vercel.com/docs)
- 🔐 [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- 🌐 [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

---

✅ **جاهز للنشر عندما تكمل جميع العناصر أعلاه!**













