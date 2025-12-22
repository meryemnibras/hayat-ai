# 📋 تعليمات Migration - ربط Doctor Model

## التغييرات المطبقة

### 1. تحديث Schema.prisma

تم إضافة العلاقات التالية:

#### Clinic Model
```prisma
model Clinic {
  // ... existing fields
  doctors       Doctor[]  // ✅ Added
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
  // ... existing fields
  doctorId   String?  // ✅ Added
  doctor     Doctor?  @relation(fields: [doctorId], references: [id])  // ✅ Added
  // ... existing fields
  @@index([doctorId])  // ✅ Added
}
```

---

## خطوات Migration

### للتطوير المحلي (Development)

```bash
# 1. إنشاء migration جديد
npx prisma migrate dev --name add_doctor_relations

# 2. سيطلب منك Prisma تأكيد التغييرات
# اضغط Enter للموافقة

# 3. سيتم تطبيق Migration تلقائياً على قاعدة البيانات المحلية
```

### للإنتاج (Production)

```bash
# 1. توليد Prisma Client (يتم تلقائياً في build)
npx prisma generate

# 2. تطبيق Migrations على قاعدة البيانات الإنتاج
npx prisma migrate deploy
```

### على Vercel

1. **تأكد من وجود DATABASE_URL** في Environment Variables
2. **أضف إلى package.json** (إذا لم يكن موجوداً):
   ```json
   {
     "scripts": {
       "build": "prisma generate && prisma migrate deploy && next build"
     }
   }
   ```
3. **أو شغّل يدوياً** من Vercel CLI:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

---

## التحقق من Migration

### 1. التحقق من Schema
```bash
npx prisma validate
```

### 2. التحقق من قاعدة البيانات
```bash
npx prisma studio
# افتح http://localhost:5555
# تحقق من وجود:
# - doctorId في Appointment table
# - clinicId في Doctor table
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

---

## ملاحظات مهمة

### ⚠️ البيانات الموجودة

- **doctorId في Appointment**: اختياري (`String?`)، لذلك المواعيد الموجودة لن تتأثر
- **clinicId في Doctor**: اختياري (`String?`)، لذلك الأطباء الموجودين لن يتأثروا

### ✅ التوافق مع الكود القديم

- الكود القديم الذي يستخدم `providerId` سيعمل بشكل طبيعي
- يمكن استخدام `doctorId` أو `providerId` أو كليهما
- API يدعم كلا الحقلين

---

## التغييرات في الكود

### 1. Appointment API
- ✅ إضافة دعم `doctorId` في GET (query parameter)
- ✅ إضافة دعم `doctorId` في POST (request body)
- ✅ إرجاع `doctor` في response

### 2. HayatAgent Tools
- ✅ `ScheduleAppointmentTool` يدعم `doctorId`
- ✅ `GetPatientInfoTool` يجلب بيانات من قاعدة البيانات
- ✅ `EscalateToHumanTool` ينشئ conversation/message

### 3. WhatsApp Integration
- ✅ إصلاح import prisma
- ✅ إرسال الرسائل يعمل بشكل صحيح

---

## الخطوات التالية

1. ✅ ربط Doctor Model - **مكتمل**
2. ✅ ربط HayatAgent Tools - **مكتمل**
3. ⚠️ إكمال Authentication - **قيد العمل**
4. ✅ WhatsApp Integration - **مكتمل**

---

**تاريخ التحديث:** 2024-12-24

