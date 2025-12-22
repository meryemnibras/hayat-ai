# 🗄️ إعداد قاعدة البيانات و Migration - مكتمل

## 📋 الحالة الحالية

### ✅ Schema جاهز
- ✅ جميع Models محددة في `prisma/schema.prisma`
- ✅ العلاقات بين Models مكتملة
- ✅ Indexes محددة بشكل صحيح
- ✅ Enums محددة

### ✅ الكود جاهز
- ✅ Prisma Client في `lib/prisma.ts`
- ✅ APIs تستخدم Prisma
- ✅ HayatAgent Tools متصلة بقاعدة البيانات

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد قاعدة البيانات

#### خيار 1: PostgreSQL (موصى به للإنتاج)

**استخدام Vercel Postgres:**
1. اذهب إلى Vercel Dashboard
2. Project → Storage → Create Database
3. اختر "Postgres"
4. انسخ `DATABASE_URL` من Environment Variables

**أو استخدام Supabase:**
1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. Settings → Database → Connection String
4. انسخ `DATABASE_URL`

**أو استخدام Railway/Render/Neon:**
- أي خدمة PostgreSQL ستعمل
- انسخ `DATABASE_URL` من Dashboard

#### خيار 2: SQLite (للتطوير المحلي فقط)

```env
DATABASE_URL="file:./dev.db"
```

⚠️ **ملاحظة:** SQLite غير مناسب للإنتاج على Vercel

---

### الخطوة 2: إضافة DATABASE_URL

#### في Vercel:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. أضف:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```
3. Environment: Production, Preview, Development

#### محلياً (.env.local):
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

---

### الخطوة 3: تشغيل Migration

#### للتطوير المحلي:
```bash
# 1. التحقق من Schema
npx prisma validate

# 2. توليد Prisma Client
npx prisma generate

# 3. إنشاء Migration
npx prisma migrate dev --name init

# 4. (اختياري) فتح Prisma Studio للتحقق
npx prisma studio
```

#### للإنتاج (Vercel):
```bash
# Migration سيتم تشغيله تلقائياً في build script
# أو شغّل يدوياً:
npx prisma migrate deploy
```

---

### الخطوة 4: Seed البيانات (اختياري)

```bash
# إذا كان لديك seed file
npx prisma db seed
```

---

## ✅ التحقق من الإعداد

### 1. التحقق من Schema
```bash
npx prisma validate
```

**النتيجة المتوقعة:**
```
✔ Your Prisma schema is valid
```

### 2. التحقق من قاعدة البيانات
```bash
npx prisma studio
# افتح http://localhost:5555
```

**تحقق من:**
- ✅ جميع Tables موجودة
- ✅ العلاقات صحيحة
- ✅ Indexes موجودة

### 3. اختبار Prisma Client
```bash
npm run check-env
```

### 4. اختبار API
```bash
# اختبار GET /api/doctors
curl http://localhost:3000/api/doctors

# اختبار GET /api/appointments
curl http://localhost:3000/api/appointments
```

---

## 🔧 Scripts مفيدة

### في package.json:
```json
{
  "scripts": {
    "db:validate": "prisma validate",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset"
  }
}
```

---

## ⚠️ استكشاف الأخطاء

### خطأ: "Can't reach database server"
**السبب:** DATABASE_URL غير صحيح أو قاعدة البيانات غير متاحة

**الحل:**
1. تحقق من DATABASE_URL
2. تحقق من أن قاعدة البيانات تعمل
3. تحقق من Firewall/Security Groups

---

### خطأ: "Migration failed"
**السبب:** قاعدة البيانات تحتوي على بيانات متضاربة

**الحل:**
```bash
# للتطوير فقط (سيحذف جميع البيانات!)
npx prisma migrate reset

# ثم أعد Migration
npx prisma migrate dev
```

---

### خطأ: "Prisma Client not generated"
**السبب:** Prisma Client لم يتم توليده

**الحل:**
```bash
npx prisma generate
```

---

## 📊 Models في Schema

### Core Models:
- ✅ `Clinic` - العيادات
- ✅ `User` - المستخدمين (Staff, Admin, Doctor)
- ✅ `Patient` - المرضى
- ✅ `Doctor` - الأطباء
- ✅ `Appointment` - المواعيد
- ✅ `Conversation` - المحادثات
- ✅ `Message` - الرسائل

### Billing Models:
- ✅ `Subscription` - الاشتراكات
- ✅ `UsageRecord` - سجلات الاستخدام

---

## 🔗 العلاقات المهمة

```
Clinic
  ├── users (User[])
  ├── patients (Patient[])
  ├── doctors (Doctor[])
  ├── appointments (Appointment[])
  └── conversations (Conversation[])

Doctor
  ├── clinic (Clinic?)
  └── appointments (Appointment[])

Appointment
  ├── clinic (Clinic)
  ├── patient (Patient)
  ├── provider (User?)
  └── doctor (Doctor?)

Patient
  ├── clinic (Clinic)
  ├── appointments (Appointment[])
  └── conversations (Conversation[])
```

---

## 📝 ملاحظات مهمة

### ⚠️ البيانات الموجودة
- إذا كانت لديك قاعدة بيانات موجودة، تأكد من:
  - Backup البيانات قبل Migration
  - `doctorId` و `clinicId` في Doctor اختياريين - البيانات القديمة لن تتأثر

### ✅ التوافق
- الكود يدعم `providerId` (User) و `doctorId` (Doctor)
- يمكن استخدام كليهما أو أحدهما

---

## 🎯 الخطوات التالية

بعد إكمال Migration:
1. ✅ قاعدة البيانات جاهزة
2. ✅ يمكن البدء في استخدام APIs
3. ✅ AI Agent يمكنه التفاعل مع قاعدة البيانات
4. ✅ WhatsApp Integration يعمل مع قاعدة البيانات

---

**الحالة:** ✅ Schema جاهز - يحتاج تشغيل Migration فقط

**الدليل الكامل:** راجع `MIGRATION_INSTRUCTIONS.md`

