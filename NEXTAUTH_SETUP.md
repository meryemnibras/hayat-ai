# 🔐 إعداد NextAuth.js - عيادة حياة للتجميل

## ✅ المكتبات المثبتة

تم تثبيت جميع المكتبات المطلوبة:

- ✅ `next-auth@^4.24.13`
- ✅ `@auth/prisma-adapter@^2.11.1`
- ✅ `prisma@^6.19.1` (dev dependency)
- ✅ `@prisma/client@^6.19.1`

## 📁 الملفات المُنشأة

### 1. Prisma Client
**الملف:** `src/lib/prisma.ts`
- إعداد Prisma Client مع connection pooling
- مناسب للاستخدام في Next.js

### 2. NextAuth API Route
**الملف:** `src/app/api/auth/[...nextauth]/route.ts`
- إعداد NextAuth.js مع Prisma Adapter
- دعم تسجيل الدخول بالهاتف (Credentials)
- دعم تسجيل الدخول بـ Google (OAuth)

### 3. Auth Utilities
**الملف:** `src/lib/auth.ts`
- دوال مساعدة للحصول على Session والمستخدم الحالي
- للاستخدام في Server Components

## 🔧 متغيرات البيئة المطلوبة

أضف هذه المتغيرات إلى ملف `.env`:

```env
# ═══════════════════════════════════════
# NextAuth.js Configuration
# ═══════════════════════════════════════

# Secret Key (مطلوب)
# يمكن توليده باستخدام: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# Base URL (مطلوب)
NEXTAUTH_URL=http://localhost:3000

# ═══════════════════════════════════════
# Google OAuth (اختياري)
# ═══════════════════════════════════════
# للحصول على هذه القيم:
# 1. اذهب إلى: https://console.cloud.google.com
# 2. أنشئ مشروع جديد
# 3. اذهب إلى APIs & Services > Credentials
# 4. أنشئ OAuth 2.0 Client ID
# 5. أضف Authorized redirect URIs: http://localhost:3000/api/auth/callback/google

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ═══════════════════════════════════════
# Database (مطلوب لـ Prisma)
# ═══════════════════════════════════════
DATABASE_URL=postgresql://user:password@localhost:5432/hayat_clinic
```

## 🚀 الخطوات التالية

### 1. توليد NEXTAUTH_SECRET

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Linux/Mac
openssl rand -base64 32
```

### 2. إعداد Google OAuth (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. اذهب إلى **APIs & Services** > **Credentials**
5. اضغط **Create Credentials** > **OAuth client ID**
6. اختر **Web application**
7. أضف **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
8. انسخ **Client ID** و **Client Secret**

### 3. إعداد قاعدة البيانات

```bash
# توليد Prisma Client
npx prisma generate

# إنشاء Migration
npx prisma migrate dev --name init

# أو Push مباشرة (للتطوير)
npx prisma db push
```

### 4. اختبار NextAuth.js

```bash
# شغّل السيرفر
npm run dev

# افتح المتصفح
http://localhost:3000/auth/signin
```

## 📝 ملاحظات مهمة

### تسجيل الدخول بالهاتف

حالياً، الكود يحتوي على TODO للتحقق من رمز SMS. يجب تنفيذ:

1. **خدمة SMS** (مثل Twilio, AWS SNS, أو خدمة محلية)
2. **تخزين رموز التحقق** (في قاعدة البيانات أو Redis)
3. **التحقق من الرمز** في `authorize` function

مثال:

```typescript
// في src/app/api/auth/[...nextauth]/route.ts
async authorize(credentials) {
  // التحقق من رمز SMS
  const isValid = await verifySMSCode(credentials.phone, credentials.code)
  if (!isValid) return null
  
  // باقي الكود...
}
```

### Google OAuth

إذا لم تكن تريد استخدام Google OAuth، يمكنك حذف `GoogleProvider` من `providers` array.

## 🔍 استكشاف الأخطاء

### خطأ: "NEXTAUTH_SECRET is missing"

**الحل:** أضف `NEXTAUTH_SECRET` إلى `.env`

### خطأ: "Prisma Client not generated"

**الحل:**
```bash
npx prisma generate
```

### خطأ: "Database connection failed"

**الحل:** تحقق من `DATABASE_URL` في `.env`

### خطأ: "Invalid credentials"

**الحل:** تأكد من تنفيذ منطق التحقق من رمز SMS في `authorize` function

## ✅ Checklist

- [ ] ✅ تم تثبيت المكتبات
- [ ] ✅ تم إنشاء ملفات NextAuth.js
- [ ] ✅ تم إضافة `NEXTAUTH_SECRET` إلى `.env`
- [ ] ✅ تم إضافة `NEXTAUTH_URL` إلى `.env`
- [ ] ✅ تم إعداد قاعدة البيانات (Prisma)
- [ ] ✅ تم اختبار صفحة تسجيل الدخول
- [ ] ✅ (اختياري) تم إعداد Google OAuth
- [ ] ✅ (مستقبلاً) تم تنفيذ خدمة SMS للتحقق

---

**آخر تحديث:** 2024












