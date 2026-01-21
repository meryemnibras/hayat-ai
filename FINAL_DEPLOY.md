# ✅ المشروع موجود على Vercel!

## 🎉 تم العثور على المشروع!

المشروع **hayat-ai** موجود بالفعل على Vercel:
**https://vercel.com/ubcdsg-6272s-projects/hayat-ai**

---

## 📋 الخطوات التالية:

### الطريقة 1: النشر من Vercel Dashboard (الأسهل)

1. **اذهب إلى**: https://vercel.com/ubcdsg-6272s-projects/hayat-ai
2. **اضغط على**: "Add New..." أو "Deploy"
3. **اختر**: Import Git Repository (إذا كان مربوطاً بـ GitHub)
   - أو: Upload Files مباشرة

### الطريقة 2: النشر من Terminal

بعد إكمال تسجيل الدخول في المتصفح:

```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
vercel --prod
```

---

## ⚙️ إضافة Environment Variables

**اذهب إلى**: https://vercel.com/ubcdsg-6272s-projects/hayat-ai/settings/environment-variables

### أضف هذه المتغيرات:

```
DATABASE_URL
= postgresql://user:password@host:5432/dbname

OPENAI_API_KEY
= sk-proj-xxxxxxxxxxxxx

NEXT_PUBLIC_APP_URL
= https://hayat-ai.vercel.app (أو رابط مشروعك)

DEFAULT_CLINIC_ID
= default-clinic-id
```

---

## 🗄️ للحصول على قاعدة بيانات مجانية:

### Supabase (موصى به):
1. https://supabase.com
2. أنشئ حساب → مشروع جديد
3. Settings → Database → Connection String
4. انسخ `DATABASE_URL`

### Neon:
1. https://neon.tech
2. أنشئ حساب → مشروع جديد
3. انسخ Connection String

---

## 🚀 بعد إضافة Environment Variables:

1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. اضغط **Redeploy**

أو من Terminal:
```powershell
vercel --prod
```

---

## ✅ تم!

المشروع جاهز للانطلاق! 🎉

---

**رابط المشروع**: https://vercel.com/ubcdsg-6272s-projects/hayat-ai



