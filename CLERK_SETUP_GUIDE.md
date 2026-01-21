# 🔐 دليل إعداد Clerk Authentication - خطوة بخطوة

## ✅ الحالة الحالية

- ✅ الكود جاهز ومكتمل
- ✅ `ClerkProvider` مضاف في `app/layout.tsx`
- ✅ Login/Register APIs محدثة
- ✅ Middleware محدث
- ⚠️ يحتاج إعداد Clerk Dashboard فقط

---

## 📋 الخطوات التفصيلية

### الخطوة 1: إنشاء حساب Clerk

1. **اذهب إلى:** https://clerk.com
2. **اضغط:** "Sign Up" أو "Get Started"
3. **اختر طريقة التسجيل:**
   - Google Account (موصى به)
   - GitHub Account
   - Email

---

### الخطوة 2: إنشاء Application

1. **بعد تسجيل الدخول:**
   - اضغط "Create Application" أو "New Application"

2. **املأ البيانات:**
   - **Application Name:** `Hayat AI Clinic`
   - **Authentication Methods:** اختر:
     - ✅ Email
     - ✅ Phone (اختياري)
     - ✅ Social (Google, GitHub - اختياري)

3. **اضغط:** "Create Application"

---

### الخطوة 3: الحصول على API Keys

1. **من Dashboard:**
   - اذهب إلى "API Keys" في القائمة الجانبية
   - أو اذهب إلى: `https://dashboard.clerk.com/apps/[YOUR_APP_ID]/api-keys`

2. **ستجد:**
   - **Publishable Key:** يبدأ بـ `pk_test_...` أو `pk_live_...`
   - **Secret Key:** يبدأ بـ `sk_test_...` أو `sk_live_...`

3. **انسخ المفاتيح:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```

---

### الخطوة 4: إضافة Environment Variables في Vercel

#### الطريقة 1: من Vercel Dashboard (موصى به)

1. **اذهب إلى:** https://vercel.com/dashboard
2. **اختر المشروع:** `hayat-ai` (أو اسم مشروعك)
3. **Settings → Environment Variables**
4. **أضف المتغيرات التالية:**

   ```
   Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   Value: pk_test_xxxxxxxxxxxxx
   Environment: Production, Preview, Development (اختر الكل)
   
   Name: CLERK_SECRET_KEY
   Value: sk_test_xxxxxxxxxxxxx
   Environment: Production, Preview, Development (اختر الكل)
   ```

5. **اضغط:** "Save"

#### الطريقة 2: من Vercel CLI

```bash
# تثبيت Vercel CLI (إذا لم يكن مثبت)
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة Environment Variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY

# رفع التغييرات
vercel --prod
```

---

### الخطوة 5: إضافة Environment Variables محلياً

1. **أنشئ ملف:** `.env.local` في جذر المشروع

2. **أضف:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```

3. **ملاحظة:** `.env.local` موجود في `.gitignore` ولن يتم رفعه إلى Git

---

### الخطوة 6: إعداد Allowed URLs في Clerk

1. **من Clerk Dashboard:**
   - اذهب إلى "Settings" → "Paths"
   - أو "Settings" → "Domains"

2. **أضف Domains:**
   - `mediai.tr`
   - `app.mediai.tr`
   - `portal.mediai.tr`
   - `localhost:3000` (للتطوير)

3. **أضف Redirect URLs:**
   - `https://app.mediai.tr/dashboard`
   - `https://portal.mediai.tr/portal`
   - `http://localhost:3000/dashboard` (للتطوير)

---

### الخطوة 7: اختبار الإعداد

#### محلياً:
```bash
# 1. أضف Environment Variables في .env.local
# 2. شغّل المشروع
npm run dev

# 3. افتح http://localhost:3000/portal/login
# 4. جرب تسجيل الدخول
```

#### على Vercel:
1. **انتظر حتى يكتمل Deployment**
2. **افتح:** `https://app.mediai.tr/dashboard`
3. **يجب أن يطلب تسجيل الدخول**

---

## 🔍 التحقق من الإعداد

### اختبار 1: التحقق من Environment Variables

```bash
# في Terminal
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# أو في Node.js
console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
console.log(process.env.CLERK_SECRET_KEY)
```

### اختبار 2: اختبار Login API

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**النتيجة المتوقعة:**
- ✅ إذا كان Clerk مُعد: يعيد بيانات المستخدم
- ⚠️ إذا لم يكن مُعد: يعيد mock response

---

## ⚠️ استكشاف الأخطاء

### خطأ: "Clerk not configured"
**السبب:** Environment Variables غير موجودة

**الحل:**
1. تحقق من `.env.local` (محلياً)
2. تحقق من Vercel Environment Variables (للإنتاج)
3. أعد تشغيل المشروع بعد إضافة المتغيرات

---

### خطأ: "Invalid API key"
**السبب:** API Key غير صحيح

**الحل:**
1. تحقق من نسخ المفتاح بشكل صحيح
2. تأكد من استخدام المفتاح الصحيح (test vs live)
3. تحقق من أن المفتاح لم ينتهِ صلاحيته

---

### خطأ: "Redirect URL not allowed"
**السبب:** Domain غير مسموح في Clerk

**الحل:**
1. اذهب إلى Clerk Dashboard → Settings → Paths
2. أضف Domain إلى Allowed URLs

---

## 📝 ملاحظات مهمة

### Test vs Production Keys

- **Test Keys:** تبدأ بـ `pk_test_` و `sk_test_`
  - للاستخدام في التطوير
  - مجانية
  - محدودة بـ 10,000 MAU

- **Production Keys:** تبدأ بـ `pk_live_` و `sk_live_`
  - للاستخدام في الإنتاج
  - تتطلب خطة مدفوعة
  - غير محدودة

### Security Best Practices

1. **لا ترفع `.env.local` إلى Git**
2. **استخدم Production Keys فقط في الإنتاج**
3. **لا تشارك Secret Keys**
4. **استخدم Environment Variables في Vercel**

---

## ✅ قائمة التحقق

- [ ] إنشاء حساب Clerk
- [ ] إنشاء Application
- [ ] نسخ API Keys
- [ ] إضافة Environment Variables في Vercel
- [ ] إضافة Environment Variables محلياً (.env.local)
- [ ] إعداد Allowed URLs في Clerk
- [ ] اختبار Login محلياً
- [ ] اختبار Login على Vercel
- [ ] التحقق من أن Authentication يعمل

---

## 🚀 بعد الإعداد

بعد إكمال الإعداد:
1. ✅ Authentication سيعمل تلقائياً
2. ✅ Route Protection سيعمل
3. ✅ User sync مع قاعدة البيانات سيعمل
4. ✅ يمكنك استخدام `useUser()` hook في Components

---

**تاريخ الإنشاء:** 2024-12-24
**آخر تحديث:** 2024-12-24

















