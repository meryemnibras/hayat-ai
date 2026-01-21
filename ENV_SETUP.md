# 🔧 إعداد متغيرات البيئة - NextAuth.js

## ✅ إضافة المتغيرات إلى `.env`

### الطريقة 1: استخدام السكريبت (موصى به)

```powershell
# في PowerShell
cd hayat-ai
.\scripts\add-env-vars.ps1
```

### الطريقة 2: يدوياً

انسخ هذا المحتوى إلى ملف `.env`:

```env
# ═══════════════════════════════════════
# NextAuth Configuration
# ═══════════════════════════════════════
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters

# ═══════════════════════════════════════
# Database
# ═══════════════════════════════════════
DATABASE_URL=postgresql://user:password@localhost:5432/hayat_clinic

# ═══════════════════════════════════════
# Google OAuth (optional)
# ═══════════════════════════════════════
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🔑 توليد NEXTAUTH_SECRET

### Windows PowerShell:
```powershell
# توليد 48 حرف عشوائي
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

### Linux/Mac:
```bash
openssl rand -base64 32
```

### أو استخدم السكريبت:
```powershell
.\scripts\add-env-vars.ps1
```

## 📋 Checklist

- [ ] تم إضافة `NEXTAUTH_URL` إلى `.env`
- [ ] تم إضافة `NEXTAUTH_SECRET` إلى `.env` (32+ حرف)
- [ ] تم تحديث `DATABASE_URL` بقيم قاعدة البيانات الحقيقية
- [ ] (اختياري) تم إضافة `GOOGLE_CLIENT_ID`
- [ ] (اختياري) تم إضافة `GOOGLE_CLIENT_SECRET`

## ⚠️ ملاحظات مهمة

1. **NEXTAUTH_SECRET**: يجب أن يكون على الأقل 32 حرفاً. استخدم قيمة قوية وآمنة.
2. **DATABASE_URL**: قم بتحديثها بقيم قاعدة البيانات الحقيقية.
3. **NEXTAUTH_URL**: في الإنتاج، قم بتغييرها إلى رابط النطاق الخاص بك.
4. **Google OAuth**: اختياري. إذا لم تكن تريد استخدامه، يمكنك حذف المتغيرين.

## 🚀 الخطوات التالية

بعد إضافة المتغيرات:

```bash
# 1. توليد Prisma Client
npx prisma generate

# 2. إنشاء Migration
npx prisma migrate dev --name init

# 3. تشغيل السيرفر
npm run dev
```

---

**آخر تحديث:** 2024











