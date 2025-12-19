# 🔧 إصلاح أخطاء API - Doctors & Patients

## المشكلة
عند استدعاء `/api/doctors` أو `/api/patients`، يظهر الخطأ:
```json
{"success":false,"error":"Failed to fetch doctors"}
{"success":false,"error":"Failed to fetch patients"}
```

## الأسباب المحتملة

### 1️⃣ Prisma Client غير محدث
**الحل:**
```bash
cd hayat-ai
npx prisma generate
```

### 2️⃣ Migrations غير مطبقة
**الحل:**
```bash
cd hayat-ai
npx prisma migrate dev --name add_doctor_patient_models
```

### 3️⃣ قاعدة البيانات غير متصلة
**الحل:**
- تأكد من وجود `DATABASE_URL` في ملف `.env`
- تأكد من أن قاعدة البيانات تعمل

### 4️⃣ الجداول غير موجودة
**الحل:**
```bash
# تطبيق migrations
npx prisma migrate dev

# ثم seeding
npx prisma db seed
```

## الخطوات الكاملة للإصلاح

### الخطوة 1: تحديث Prisma Client
```bash
cd hayat-ai
npx prisma generate
```

### الخطوة 2: تطبيق Migrations
```bash
npx prisma migrate dev --name add_doctor_patient_models
```

إذا ظهرت رسالة تسأل عن إنشاء migration جديد، اضغط `Y` ثم Enter.

### الخطوة 3: Seeding البيانات
```bash
npx prisma db seed
```

### الخطوة 4: التحقق من الإصلاح
افتح في المتصفح:
- `http://localhost:3000/api/doctors`
- `http://localhost:3000/api/patients`

يجب أن ترى:
```json
{
  "success": true,
  "doctors": [...],
  "count": 15
}
```

أو إذا لم تكن البيانات موجودة بعد:
```json
{
  "success": true,
  "doctors": [],
  "count": 0
}
```

## رسائل الخطأ الجديدة

الآن API routes تعطي رسائل خطأ واضحة:

### إذا كان الجدول غير موجود:
```json
{
  "success": false,
  "error": "Doctor table does not exist. Please run migrations first.",
  "solution": "Run: npx prisma migrate dev --name add_doctor_patient_models",
  "details": "...",
  "code": "P2021"
}
```

### إذا كان الاتصال بقاعدة البيانات فاشل:
```json
{
  "success": false,
  "error": "Cannot connect to database. Please check DATABASE_URL in .env file",
  "solution": "Verify DATABASE_URL is set correctly in .env file",
  "details": "...",
  "code": "P1001"
}
```

### إذا كان Prisma Client غير محدث:
```json
{
  "success": false,
  "error": "Prisma Client is not up to date. Please regenerate it.",
  "solution": "Run: npx prisma generate",
  "details": "..."
}
```

## اختبار سريع

```bash
# 1. تحديث Prisma Client
npx prisma generate

# 2. تطبيق migrations
npx prisma migrate dev

# 3. Seeding
npx prisma db seed

# 4. اختبار API
curl http://localhost:3000/api/doctors
curl http://localhost:3000/api/patients
```

## إذا استمرت المشكلة

1. تحقق من ملف `.env` يحتوي على `DATABASE_URL`
2. تحقق من أن قاعدة البيانات تعمل
3. تحقق من console logs في terminal
4. افتح Prisma Studio: `npx prisma studio`



