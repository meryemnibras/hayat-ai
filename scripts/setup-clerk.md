# 🚀 إعداد Clerk - Quick Start

## الخطوات السريعة

### 1. إنشاء حساب Clerk
```
https://clerk.com → Sign Up
```

### 2. إنشاء Application
```
Dashboard → Create Application
Name: "Hayat AI Clinic"
```

### 3. نسخ API Keys
```
Dashboard → API Keys
انسخ:
- Publishable Key (pk_test_...)
- Secret Key (sk_test_...)
```

### 4. إضافة في Vercel
```
Vercel Dashboard → Project → Settings → Environment Variables

أضف:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 5. إضافة محلياً
```bash
# أنشئ .env.local
cp .env.example .env.local

# أضف المفاتيح
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 6. التحقق
```bash
npm run check-env
```

---

## ✅ النتيجة

بعد الإعداد:
- ✅ Authentication يعمل تلقائياً
- ✅ Route Protection يعمل
- ✅ User sync مع قاعدة البيانات

---

**الدليل الكامل:** راجع `CLERK_SETUP_GUIDE.md`

















