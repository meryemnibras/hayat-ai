# 📋 تعليمات Migration - إعداد قاعدة البيانات

## ✅ الحالة الحالية

- ✅ Schema جاهز ومكتمل (`prisma/schema.prisma`)
- ✅ جميع Models والعلاقات محددة
- ✅ Indexes محددة بشكل صحيح
- ⚠️ يحتاج تشغيل Migration فقط

---

## 🚀 خطوات Migration

### الخطوة 1: إعداد قاعدة البيانات

#### خيار 1: Vercel Postgres (موصى به)

1. **Vercel Dashboard:**
   - Project → Storage → Create Database
   - اختر "Postgres"
   - انسخ `DATABASE_URL` من Environment Variables

#### خيار 2: Supabase

1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. Settings → Database → Connection String
4. انسخ `DATABASE_URL`

#### خيار 3: Railway/Render/Neon

- أي خدمة PostgreSQL ستعمل
- انسخ `DATABASE_URL` من Dashboard

---

### الخطوة 2: إضافة DATABASE_URL

#### في Vercel:
```
Vercel Dashboard → Project → Settings → Environment Variables
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database?schema=public
Environment: Production, Preview, Development
```

#### محلياً (.env.local):
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

---

### الخطوة 3: التحقق من Schema

```bash
# التحقق من صحة Schema
npm run db:validate
# أو
npx prisma validate
```

**النتيجة المتوقعة:**
```
✔ Your Prisma schema is valid
```

---

### الخطوة 4: توليد Prisma Client

```bash
# توليد Prisma Client
npm run db:generate
# أو
npx prisma generate
```

---

### الخطوة 5: إنشاء Migration

#### للتطوير المحلي (Development):

```bash
# إنشاء migration جديد
npm run db:migrate
# أو
npx prisma migrate dev --name init
```

**ما سيحدث:**
1. Prisma سيقارن Schema مع قاعدة البيانات
2. سيُنشئ ملفات Migration في `prisma/migrations/`
3. سيُطبق Migration تلقائياً على قاعدة البيانات
4. سيُولد Prisma Client تلقائياً

**إذا كانت قاعدة البيانات فارغة:**
- سيُنشئ جميع Tables والعلاقات والIndexes

**إذا كانت قاعدة البيانات تحتوي على بيانات:**
- سيحاول Prisma تطبيق Migration بدون فقدان البيانات
- ⚠️ تأكد من عمل Backup قبل Migration

---

### الخطوة 6: التحقق من Migration

```bash
# فتح Prisma Studio للتحقق
npm run db:studio
# أو
npx prisma studio
```

**افتح:** http://localhost:5555

**تحقق من:**
- ✅ جميع Tables موجودة
- ✅ العلاقات صحيحة
- ✅ Indexes موجودة

---

### الخطوة 7: اختبار قاعدة البيانات

```bash
# اختبار الاتصال والـ Schema
npm run check-env
tsx scripts/check-db.ts
```

---

## 🏭 للإنتاج (Production)

### على Vercel:

#### الطريقة 1: تلقائي (موصى به)

Migration سيتم تشغيله تلقائياً في `build` script:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

⚠️ **ملاحظة:** Vercel لا يدعم `prisma migrate deploy` في build script افتراضياً.

#### الطريقة 2: يدوي

```bash
# من Vercel CLI
vercel env pull
npx prisma migrate deploy
```

#### الطريقة 3: من Vercel Dashboard

1. اذهب إلى Vercel Dashboard
2. Project → Settings → Build & Development Settings
3. Build Command: `prisma generate && prisma migrate deploy && next build`

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

### التغييرات المطبقة:

#### Clinic Model
```prisma
model Clinic {
  doctors       Doctor[]  // ✅ Added
  // ... existing fields
}
```

#### Doctor Model
```prisma
model Doctor {
  clinicId             String?        // ✅ Added
  clinic               Clinic?        @relation(fields: [clinicId], references: [id])  // ✅ Added
  appointments         Appointment[]  // ✅ Added
  // ... existing fields
  @@index([clinicId])  // ✅ Added
}
```

#### Appointment Model
```prisma
model Appointment {
  doctorId   String?  // ✅ Added
  doctor     Doctor?  @relation(fields: [doctorId], references: [id])  // ✅ Added
  // ... existing fields
  @@index([doctorId])  // ✅ Added
}
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
    "db:reset": "prisma migrate reset",
    "db:status": "prisma migrate status"
  }
}
```

---

## ⚠️ استكشاف الأخطاء

### خطأ: "Can't reach database server"
**السبب:** DATABASE_URL غير صحيح أو قاعدة البيانات غير متاحة

**الحل:**
1. تحقق من DATABASE_URL في `.env.local` أو Vercel
2. تحقق من أن قاعدة البيانات تعمل
3. تحقق من Firewall/Security Groups

---

### خطأ: "Migration failed"
**السبب:** قاعدة البيانات تحتوي على بيانات متضاربة

**الحل (للتطوير فقط - سيحذف البيانات!):**
```bash
npm run db:reset
# ثم أعد Migration
npm run db:migrate
```

---

### خطأ: "Prisma Client not generated"
**السبب:** Prisma Client لم يتم توليده

**الحل:**
```bash
npm run db:generate
```

---

### خطأ: "Table already exists"
**السبب:** Migration تم تطبيقه مسبقاً

**الحل:**
```bash
# التحقق من حالة Migration
npm run db:status

# إذا كان Migration مكتمل، لا حاجة لإعادة تشغيله
```

---

## 📝 ملاحظات مهمة

### ⚠️ البيانات الموجودة

- **doctorId في Appointment**: اختياري (`String?`)، لذلك المواعيد الموجودة لن تتأثر
- **clinicId في Doctor**: اختياري (`String?`)، لذلك الأطباء الموجودين لن يتأثروا

### ✅ التوافق مع الكود القديم

- الكود القديم الذي يستخدم `providerId` سيعمل بشكل طبيعي
- يمكن استخدام `doctorId` أو `providerId` أو كليهما
- API يدعم كلا الحقلين

---

## ✅ التحقق من Migration

### 1. التحقق من Schema
```bash
npm run db:validate
```

### 2. التحقق من قاعدة البيانات
```bash
npm run db:studio
# افتح http://localhost:5555
# تحقق من وجود:
# - doctorId في Appointment table
# - clinicId في Doctor table
# - جميع العلاقات صحيحة
```

### 3. اختبار API
```bash
# اختبار إنشاء Appointment مع doctorId
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "clinic_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "startTime": "2024-12-25T10:00:00Z"
  }'
```

### 4. اختبار قاعدة البيانات
```bash
tsx scripts/check-db.ts
```

---

## 🎯 الخطوات التالية

بعد إكمال Migration:
1. ✅ قاعدة البيانات جاهزة
2. ✅ يمكن البدء في استخدام APIs
3. ✅ AI Agent يمكنه التفاعل مع قاعدة البيانات
4. ✅ WhatsApp Integration يعمل مع قاعدة البيانات

---

## 📚 الملفات المرجعية

- `DATABASE_SETUP_COMPLETE.md` - ملخص إعداد قاعدة البيانات
- `scripts/check-db.ts` - Script للتحقق من قاعدة البيانات
- `prisma/schema.prisma` - Schema الكامل

---

**تاريخ التحديث:** 2024-12-24
**الحالة:** ✅ Schema جاهز - يحتاج تشغيل Migration فقط
