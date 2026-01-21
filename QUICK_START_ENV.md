# 🚀 Quick Start - Environment Variables

## الخطوات السريعة (10 دقائق)

### 1. إعداد قاعدة البيانات
```
Vercel → Storage → Create Database → Postgres
انسخ DATABASE_URL
```

### 2. إعداد Clerk
```
https://clerk.com → Create Application
انسخ:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
```

### 3. إعداد OpenAI
```
https://platform.openai.com → API Keys
انسخ OPENAI_API_KEY
```

### 4. إعداد Twilio (اختياري)
```
https://www.twilio.com → Dashboard
انسخ:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_FROM
```

### 5. إضافة في Vercel
```
Vercel Dashboard → Project → Settings → Environment Variables
أضف جميع المتغيرات
Redeploy
```

### 6. إضافة محلياً
```bash
cp .env.example .env.local
# املأ القيم في .env.local
```

### 7. التحقق
```bash
npm run check-env
```

---

## ✅ النتيجة

بعد الإعداد:
- ✅ جميع Environment Variables جاهزة
- ✅ التطبيق يعمل بشكل كامل

---

**الدليل الكامل:** راجع `ENV_SETUP_COMPLETE.md`

















