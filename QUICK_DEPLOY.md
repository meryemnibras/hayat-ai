# ⚡ نشر سريع - عيادة حياة

## 🚀 النشر على Vercel (5 دقائق)

### 1. تثبيت Vercel CLI
```powershell
npm install -g vercel
```

### 2. تسجيل الدخول
```powershell
vercel login
```

### 3. النشر
```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
vercel
```

### 4. إضافة Environment Variables

اذهب إلى: https://vercel.com/dashboard → مشروعك → Settings → Environment Variables

#### المتغيرات المطلوبة:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEFAULT_CLINIC_ID=default-clinic-id
```

### 5. النشر النهائي
```powershell
vercel --prod
```

---

## 📋 أو عبر GitHub

1. ارفع الكود على GitHub
2. اذهب إلى https://vercel.com/new
3. اختر Import Git Repository
4. أضف Environment Variables
5. اضغط Deploy

---

## ✅ التحقق

- الصفحة الرئيسية: `https://your-app.vercel.app`
- Health Check: `https://your-app.vercel.app/api/health`

---

**🎉 جاهز!**
