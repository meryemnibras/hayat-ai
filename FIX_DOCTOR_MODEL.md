# حل مشكلة Doctor Model - الخطوات الكاملة

## المشكلة
Prisma Client لا يتعرف على `prisma.doctor` لأن:
1. Prisma Client لم يتم توليده بعد (`prisma generate`)
2. أو الـ migrations لم يتم تشغيلها (`prisma migrate`)

## الحل النهائي - خطوات التنفيذ

### ✳️ الخطوة 1: التحقق من Doctor Model في schema.prisma

النموذج الحالي في `prisma/schema.prisma`:
```prisma
model Doctor {
  id                   String   @id @default(cuid())
  fullName             String
  specialization       String
  email                String   @unique
  phoneNumber          String
  licenseNumber        String   @unique
  yearsExperience      Int
  hospitalAffiliation  String?
  availabilitySchedule Json?
  languagesSpoken      String[] @default([])
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([specialization])
  @@index([email])
}
```

**ملاحظة:** النموذج الحالي أكثر تفصيلاً من النموذج المبسط المطلوب. سنحافظ على النموذج الحالي لأنه مستخدم في الكود.

### ✳️ الخطوة 2: تشغيل Prisma Generate و Migrate

```bash
# 1. توليد Prisma Client
npx prisma generate

# 2. إنشاء migration جديد (إذا لم يتم إنشاؤه من قبل)
npx prisma migrate dev --name add_doctor_model

# 3. أو تطبيق migrations الموجودة على قاعدة البيانات
npx prisma migrate deploy
```

**⚠️ ملاحظة مهمة:**
- `migrate dev` يستخدم في التطوير المحلي فقط
- `migrate deploy` يستخدم في الإنتاج (Vercel)
- تأكد من وجود `DATABASE_URL` في `.env`

### ✳️ الخطوة 3: التحقق من Prisma Client

بعد تشغيل `prisma generate`، تحقق من أن `prisma.doctor` موجود:

```typescript
import { prisma } from "@/lib/prisma";

// طباعة جميع الـ models المتاحة
console.log(Object.keys(prisma));
// يجب أن يحتوي على: 'doctor', 'patient', 'appointment', إلخ
```

### ✳️ الخطوة 4: تحديث Build Script

تم إضافة `prisma generate` إلى `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

هذا يضمن أن Prisma Client يتم توليده تلقائياً عند:
- البناء (`npm run build`)
- تثبيت الحزم (`npm install`)

### ✳️ الخطوة 5: التحقق من الكود

الكود الحالي في `app/api/doctors/route.ts` يستخدم:
```typescript
const doctors = await prisma.doctor.findMany({
  where: {},
  orderBy: {
    yearsExperience: "desc",
  },
});
```

هذا صحيح ويجب أن يعمل بعد تشغيل `prisma generate`.

## خطوات التنفيذ على Vercel

### 1. التأكد من Environment Variables
- تأكد من وجود `DATABASE_URL` في Vercel Dashboard
- Settings → Environment Variables

### 2. إعادة Deployment
- بعد إضافة `prisma generate` إلى build script
- Vercel سيقوم تلقائياً بتشغيل `prisma generate` قبل البناء

### 3. التحقق من Build Logs
- في Vercel Dashboard → Deployments
- تحقق من أن `prisma generate` يعمل بنجاح
- تحقق من عدم وجود أخطاء TypeScript

## استكشاف الأخطاء

### خطأ: "Property 'doctor' does not exist"
**الحل:**
```bash
npx prisma generate
```

### خطأ: "Table 'Doctor' does not exist"
**الحل:**
```bash
npx prisma migrate dev --name add_doctor_model
# أو في الإنتاج:
npx prisma migrate deploy
```

### خطأ: "Can't reach database"
**الحل:**
- تحقق من `DATABASE_URL` في `.env`
- تأكد من أن قاعدة البيانات متاحة

## ملاحظات إضافية

1. **النموذج المبسط vs النموذج الكامل:**
   - النموذج الحالي (fullName, specialization) مستخدم في الكود
   - إذا أردت التبسيط، ستحتاج لتحديث جميع الملفات التي تستخدم Doctor

2. **Migrations:**
   - في التطوير: `prisma migrate dev`
   - في الإنتاج: `prisma migrate deploy`
   - Vercel يقوم تلقائياً بتشغيل `prisma generate` إذا كان في build script

3. **Prisma Client:**
   - يتم توليده في `node_modules/.prisma/client`
   - يجب إعادة توليده بعد أي تغيير في `schema.prisma`


