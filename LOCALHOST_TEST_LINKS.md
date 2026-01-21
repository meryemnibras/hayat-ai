# 🔗 روابط الاختبار - Localhost (http://localhost:3000)

## 🌐 الصفحات الرئيسية

### Landing Page
- **الصفحة الرئيسية:** http://localhost:3000/
- **صفحة التسعير:** http://localhost:3000/pricing

---

## 🏥 Portal (Patient Portal)

### الصفحات العامة
- **Portal الرئيسي:** http://localhost:3000/portal
- **تسجيل الدخول:** http://localhost:3000/portal/login
- **التسجيل:** http://localhost:3000/portal/register
- **التسجيل المبسط:** http://localhost:3000/portal/register-simple

---

## 📊 Dashboard (Admin/Staff)

### الصفحات الرئيسية
- **Dashboard الرئيسي:** http://localhost:3000/dashboard
- **المرضى:** http://localhost:3000/dashboard/patients
- **المواعيد:** http://localhost:3000/dashboard/appointments
- **المحادثات:** http://localhost:3000/dashboard/conversations
- **التحليلات:** http://localhost:3000/dashboard/analytics
- **الإعدادات:** http://localhost:3000/dashboard/settings

---

## 🔌 API Endpoints

### Health Check
- **Health Check:** http://localhost:3000/api/health
  - **Method:** GET
  - **Expected:** `{"status": "ok"}`

---

### Authentication APIs
- **تسجيل الدخول:** http://localhost:3000/api/auth/login
  - **Method:** POST
  - **Body:** `{"email": "test@example.com", "password": "password123"}`
  
- **التسجيل:** http://localhost:3000/api/auth/register
  - **Method:** POST
  - **Body:** `{"fullName": "Test User", "email": "test@example.com", "password": "password123"}`

---

### Doctors APIs
- **جلب جميع الأطباء:** http://localhost:3000/api/doctors
  - **Method:** GET
  - **Query Params:** `?clinicId=xxx&specialization=xxx`
  
- **إنشاء طبيب:** http://localhost:3000/api/doctors
  - **Method:** POST
  - **Body:** `{"fullName": "Dr. Test", "specialization": "Cardiology", ...}`

---

### Patients APIs
- **جلب جميع المرضى:** http://localhost:3000/api/patients
  - **Method:** GET
  - **Query Params:** `?clinicId=xxx`
  
- **إنشاء مريض:** http://localhost:3000/api/patients
  - **Method:** POST
  - **Body:** `{"fullName": "Patient Name", "clinicId": "xxx", ...}`

---

### Appointments APIs
- **جلب جميع المواعيد:** http://localhost:3000/api/appointments
  - **Method:** GET
  - **Query Params:** `?clinicId=xxx&patientId=xxx&doctorId=xxx&status=SCHEDULED`
  
- **إنشاء موعد:** http://localhost:3000/api/appointments
  - **Method:** POST
  - **Body:** `{"clinicId": "xxx", "patientId": "xxx", "doctorId": "xxx", "startTime": "2024-12-25T10:00:00Z"}`

---

### Portal APIs (Public)
- **جلب الأطباء (Portal):** http://localhost:3000/api/portal/doctors
  - **Method:** GET
  - **Query Params:** `?specialization=xxx`
  
- **جلب المواعيد (Portal):** http://localhost:3000/api/portal/appointments
  - **Method:** GET
  - **Query Params:** `?patientId=xxx`

---

### AI APIs
- **AI Chat:** http://localhost:3000/api/ai/chat
  - **Method:** POST
  - **Body:** `{"message": "أريد حجز موعد", "patientId": "xxx", "conversationId": "xxx"}`
  
- **AI Analyze:** http://localhost:3000/api/ai/analyze
  - **Method:** POST
  - **Body:** `{"text": "نص للتحليل", "type": "symptom"}`

---

### Real-time APIs
- **Polling:** http://localhost:3000/api/realtime/poll
  - **Method:** GET
  - **Query Params:** `?since=timestamp&type=messages,appointments`
  
- **Server-Sent Events:** http://localhost:3000/api/realtime/sse
  - **Method:** GET
  - **Headers:** `Accept: text/event-stream`

---

### Notifications API
- **جلب الإشعارات:** http://localhost:3000/api/notifications
  - **Method:** GET
  - **Query Params:** `?userId=xxx&unreadOnly=true`
  
- **تحديث الإشعار:** http://localhost:3000/api/notifications
  - **Method:** PATCH
  - **Body:** `{"id": "xxx", "read": true}`

---

### Analytics API
- **التحليلات:** http://localhost:3000/api/analytics
  - **Method:** GET
  - **Query Params:** `?clinicId=xxx&startDate=xxx&endDate=xxx&type=overview,appointments,revenue`

---

### Search API
- **البحث العام:** http://localhost:3000/api/search
  - **Method:** GET
  - **Query Params:** `?q=search_term&type=patients,doctors,appointments&clinicId=xxx`

---

### Upload API
- **رفع ملف:** http://localhost:3000/api/upload
  - **Method:** POST
  - **Content-Type:** `multipart/form-data`
  - **Body:** FormData with file

---

### Reports API
- **التقارير:** http://localhost:3000/api/reports
  - **Method:** GET
  - **Query Params:** `?type=financial,administrative&clinicId=xxx&startDate=xxx&endDate=xxx`

---

### Email API
- **إرسال بريد:** http://localhost:3000/api/email/send
  - **Method:** POST
  - **Body:** `{"to": "test@example.com", "subject": "Test", "body": "Test email"}`

---

### Webhooks
- **WhatsApp Webhook:** http://localhost:3000/api/webhooks/whatsapp
  - **Method:** POST
  - **Headers:** Twilio signature verification
  
- **Stripe Webhook:** http://localhost:3000/api/webhooks/stripe
  - **Method:** POST
  - **Headers:** Stripe signature verification

---

## 🧪 أمثلة اختبار سريعة

### 1. اختبار Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. اختبار جلب الأطباء
```bash
curl http://localhost:3000/api/doctors
```

### 3. اختبار جلب المواعيد
```bash
curl http://localhost:3000/api/appointments
```

### 4. اختبار AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "أريد حجز موعد",
    "patientId": "patient_id_here"
  }'
```

### 5. اختبار إنشاء موعد
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "clinic_id_here",
    "patientId": "patient_id_here",
    "doctorId": "doctor_id_here",
    "startTime": "2024-12-25T10:00:00Z",
    "endTime": "2024-12-25T11:00:00Z"
  }'
```

---

## 🔧 أدوات مساعدة

### Prisma Studio
```bash
npm run db:studio
```
- **URL:** http://localhost:5555
- **الاستخدام:** عرض وإدارة قاعدة البيانات

---

### Environment Variables Check
```bash
npm run check-env
```

### Database Check
```bash
tsx scripts/check-db.ts
```

---

## 📋 قائمة التحقق للاختبار

### الصفحات:
- [ ] Landing Page يعمل
- [ ] Portal يعمل
- [ ] Dashboard يعمل
- [ ] Login/Register يعمل

### APIs:
- [ ] Health Check يعمل
- [ ] Doctors API يعمل
- [ ] Patients API يعمل
- [ ] Appointments API يعمل
- [ ] AI Chat API يعمل
- [ ] Real-time APIs تعمل

### قاعدة البيانات:
- [ ] Prisma Studio يعمل
- [ ] Database connection يعمل
- [ ] Migrations مطبقة

---

## ⚠️ ملاحظات مهمة

### قبل الاختبار:
1. ✅ تأكد من تشغيل `npm run dev`
2. ✅ تأكد من وجود `.env.local` مع جميع المتغيرات
3. ✅ تأكد من تشغيل Migration (`npm run db:migrate`)
4. ✅ تأكد من توليد Prisma Client (`npm run db:generate`)

### أثناء الاختبار:
- استخدم Browser DevTools (F12) لمراقبة Network requests
- تحقق من Console للأخطاء
- استخدم Postman أو curl للاختبار اليدوي

---

## 🎯 سيناريوهات الاختبار الموصى بها

### 1. اختبار Portal
```
1. افتح http://localhost:3000/portal
2. تصفح الأطباء
3. جرب تسجيل الدخول
4. جرب التسجيل
```

### 2. اختبار Dashboard
```
1. افتح http://localhost:3000/dashboard
2. تصفح المرضى
3. تصفح المواعيد
4. تصفح المحادثات
5. تصفح التحليلات
```

### 3. اختبار APIs
```
1. اختبر Health Check
2. اختبر جلب الأطباء
3. اختبر جلب المواعيد
4. اختبر AI Chat
```

---

**تاريخ الإنشاء:** 2024-12-24  
**الحالة:** ✅ جاهز للاختبار

















