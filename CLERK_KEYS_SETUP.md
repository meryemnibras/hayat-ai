# 🔐 إضافة Clerk API Keys - خطوة بخطوة

## 📋 المفاتيح المطلوبة

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## 🚀 الخطوة 1: الحصول على المفاتيح من Clerk

### إذا كان لديك المفاتيح بالفعل:
- ✅ تخطى هذه الخطوة

### إذا لم يكن لديك المفاتيح:

1. **اذهب إلى:** https://clerk.com
2. **سجل الدخول** أو أنشئ حساب
3. **Dashboard → Applications → اختر Application**
4. **API Keys** في القائمة الجانبية
5. **انسخ المفاتيح:**
   - `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret Key` → `CLERK_SECRET_KEY`

---

## 🌐 الخطوة 2: إضافة في Vercel

### الطريقة 1: من Vercel Dashboard (موصى به)

1. **اذهب إلى:** https://vercel.com/dashboard

2. **اختر المشروع:** `hayat-ai` (أو اسم مشروعك)

3. **Settings → Environment Variables**

4. **أضف المتغير الأول:**
   - **Name:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value:** `pk_test_xxxxxxxxxxxxx` (الصق المفتاح هنا)
   - **Environment:** اختر الكل (Production, Preview, Development)
   - **اضغط:** "Save"

5. **أضف المتغير الثاني:**
   - **Name:** `CLERK_SECRET_KEY`
   - **Value:** `sk_test_xxxxxxxxxxxxx` (الصق المفتاح هنا)
   - **Environment:** اختر الكل (Production, Preview, Development)
   - **اضغط:** "Save"

6. **Redeploy المشروع:**
   - **Deployments** → Latest Deployment → **"Redeploy"**
   - أو انتظر حتى Deployment التالي

---

### الطريقة 2: من Vercel CLI

```bash
# تثبيت Vercel CLI (إذا لم يكن مثبت)
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة Publishable Key
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# عندما يطلب القيمة، الصق: pk_test_xxxxxxxxxxxxx
# اختر: Production, Preview, Development

# إضافة Secret Key
vercel env add CLERK_SECRET_KEY
# عندما يطلب القيمة، الصق: sk_test_xxxxxxxxxxxxx
# اختر: Production, Preview, Development

# رفع التغييرات
vercel --prod
```

---

## 💻 الخطوة 3: إضافة محلياً (للتطوير)

### إنشاء `.env.local`

1. **أنشئ ملف:** `.env.local` في جذر المشروع
   ```bash
   # في Terminal
   cd hayat-ai
   touch .env.local
   ```

2. **افتح الملف** في محرر النصوص

3. **أضف المفاتيح:**
   ```env
   # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   # CLERK AUTHENTICATION
   # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```

4. **احفظ الملف**

⚠️ **ملاحظة:** `.env.local` موجود في `.gitignore` ولن يتم رفعه إلى Git

---

## ✅ الخطوة 4: التحقق من الإعداد

### 1. التحقق من Environment Variables

```bash
# في Terminal
cd hayat-ai
npm run check-env
```

**النتيجة المتوقعة:**
```
🔍 Checking Environment Variables...

📋 Required Variables:
  ✅ DATABASE_URL: postgresql://...
  ✅ DEFAULT_CLINIC_ID: clinic_id_here
  ✅ OPENAI_API_KEY: sk-...
  ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_test_...
  ✅ CLERK_SECRET_KEY: sk_test_...

✅ All required environment variables are set!
   🎉 Your environment is properly configured!
```

---

### 2. التحقق من Clerk Configuration

#### محلياً:
```bash
# شغّل المشروع
npm run dev

# افتح http://localhost:3000/portal/login
# يجب أن تعمل صفحة Login بدون أخطاء
```

#### على Vercel:
1. **انتظر حتى يكتمل Deployment**
2. **افتح:** `https://app.mediai.tr/dashboard`
3. **يجب أن يطلب تسجيل الدخول** (إذا كان Clerk مُعد بشكل صحيح)

---

### 3. اختبار Authentication

#### اختبار Login API:
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
2. أضف Domain إلى Allowed URLs:
   - `mediai.tr`
   - `app.mediai.tr`
   - `portal.mediai.tr`
   - `localhost:3000` (للتطوير)

---

## 📝 قائمة التحقق

### Vercel:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` مضاف في Vercel
- [ ] `CLERK_SECRET_KEY` مضاف في Vercel
- [ ] تم اختيار جميع Environments (Production, Preview, Development)
- [ ] تم Redeploy المشروع

### محلياً:
- [ ] `.env.local` موجود
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` مضاف في `.env.local`
- [ ] `CLERK_SECRET_KEY` مضاف في `.env.local`

### التحقق:
- [ ] `npm run check-env` يعمل بدون أخطاء
- [ ] المشروع يعمل محلياً (`npm run dev`)
- [ ] صفحة Login تعمل بدون أخطاء
- [ ] Authentication يعمل على Vercel

---

## 🎯 بعد الإكمال

بعد إضافة المفاتيح والتحقق:
- ✅ Authentication سيعمل تلقائياً
- ✅ Route Protection سيعمل
- ✅ User sync مع قاعدة البيانات سيعمل
- ✅ Login/Register Pages ستعمل بشكل كامل

---

## 📚 الملفات المرجعية

- `CLERK_SETUP_GUIDE.md` - الدليل الكامل لإعداد Clerk
- `CLERK_SETUP_COMPLETE.md` - ملخص إعداد Clerk
- `ENV_SETUP_COMPLETE.md` - دليل Environment Variables الكامل

---

**تاريخ الإنشاء:** 2024-12-24

















