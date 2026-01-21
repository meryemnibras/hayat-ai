# 🚀 النشر الآن - خطوات سريعة

## ✅ ما تم إنجازه:

1. ✅ تم فتح صفحة Vercel
2. ✅ تم تثبيت Vercel CLI
3. ✅ تم تثبيت Dependencies
4. ✅ تم توليد Prisma Client
5. ✅ تم بدء تسجيل الدخول

---

## 📋 الخطوات التالية:

### 1. أكمل تسجيل الدخول

- تم فتح المتصفح تلقائياً
- أكمل تسجيل الدخول في المتصفح
- بعد الانتهاء، ارجع إلى Terminal

### 2. النشر

بعد اكتمال تسجيل الدخول، شغّل:

```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
vercel
```

سيطلب منك:
- **Set up and deploy?** → اضغط `Y`
- **Which scope?** → اختر حسابك
- **Link to existing project?** → اضغط `N`
- **Project name?** → اضغط Enter (hayat-ai)
- **Directory?** → اضغط Enter (./)

### 3. إضافة Environment Variables

بعد النشر، اذهب إلى:
**https://vercel.com/dashboard** → مشروعك → **Settings** → **Environment Variables**

أضف:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEFAULT_CLINIC_ID=default-clinic-id
```

### 4. النشر النهائي

```powershell
vercel --prod
```

---

## 🎉 تم!

المشروع الآن على السيرفر!



