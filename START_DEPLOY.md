# 🚀 ابدأ النشر الآن!

## ⚡ طريقة سريعة (3 خطوات)

### 1️⃣ شغّل السكريبت التلقائي

```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
.\deploy-full.ps1
```

السكريبت سيقوم بـ:
- ✅ التحقق من Node.js
- ✅ تثبيت Dependencies
- ✅ توليد Prisma Client
- ✅ بناء المشروع
- ✅ تثبيت Vercel CLI
- ✅ النشر على Vercel

---

### 2️⃣ أضف Environment Variables

بعد النشر الأولي، اذهب إلى:
**https://vercel.com/dashboard** → مشروعك → **Settings** → **Environment Variables**

#### المتغيرات المطلوبة:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEFAULT_CLINIC_ID=default-clinic-id
```

#### للحصول على قاعدة بيانات مجانية:

1. **Supabase** (موصى به): https://supabase.com
   - أنشئ حساب مجاني
   - أنشئ مشروع جديد
   - انسخ `DATABASE_URL` من Settings → Database

2. **Neon**: https://neon.tech
   - أنشئ حساب مجاني
   - أنشئ مشروع جديد
   - انسخ `Connection String`

---

### 3️⃣ النشر النهائي

```powershell
vercel --prod
```

---

## ✅ تم! 🎉

المشروع الآن على السيرفر!

---

## 📞 مساعدة

إذا واجهت أي مشكلة:
1. راجع `DEPLOY_COMPLETE.md`
2. راجع `النشر_النهائي.md`
3. تحقق من الأخطاء في Vercel Dashboard → Deployments

---

**جاهز للانطلاق! 🚀**



