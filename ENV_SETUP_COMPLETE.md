# 🔐 إعداد Environment Variables - مكتمل

## 📋 الحالة الحالية

- ✅ `.env.example` موجود كـ template
- ✅ `scripts/check-env.ts` للتحقق من المتغيرات
- ⚠️ يحتاج إضافة Environment Variables في Vercel ومحلياً

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد قاعدة البيانات (DATABASE_URL)

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

**Format:**
```
postgresql://user:password@host:5432/database?schema=public
```

---

### الخطوة 2: إعداد Clerk Authentication

1. **إنشاء حساب Clerk:**
   - اذهب إلى https://clerk.com
   - أنشئ حساب أو سجل الدخول
   - أنشئ Application جديد

2. **الحصول على API Keys:**
   - Dashboard → API Keys
   - انسخ:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (يبدأ بـ `pk_test_...`)
     - `CLERK_SECRET_KEY` (يبدأ بـ `sk_test_...`)

**الدليل الكامل:** راجع `CLERK_SETUP_GUIDE.md`

---

### الخطوة 3: إعداد OpenAI (للـ AI Agent)

1. **إنشاء حساب OpenAI:**
   - اذهب إلى https://platform.openai.com
   - أنشئ حساب أو سجل الدخول

2. **الحصول على API Key:**
   - Dashboard → API Keys → Create new secret key
   - انسخ `OPENAI_API_KEY` (يبدأ بـ `sk-...`)

⚠️ **ملاحظة:** تأكد من وجود رصيد كافي في حساب OpenAI

---

### الخطوة 4: إعداد Twilio (للـ WhatsApp)

1. **إنشاء حساب Twilio:**
   - اذهب إلى https://www.twilio.com
   - أنشئ حساب أو سجل الدخول

2. **الحصول على Credentials:**
   - Dashboard → Account → API Keys & Tokens
   - انسخ:
     - `TWILIO_ACCOUNT_SID` (يبدأ بـ `AC...`)
     - `TWILIO_AUTH_TOKEN` (يبدأ بـ `...`)

3. **إعداد WhatsApp:**
   - Dashboard → Messaging → Try it out → Send a WhatsApp message
   - انسخ `TWILIO_WHATSAPP_FROM` (يبدأ بـ `whatsapp:+...`)

**الدليل الكامل:** راجع `WhatsApp_Integration_Status.md`

---

### الخطوة 5: إعداد DEFAULT_CLINIC_ID

بعد إنشاء قاعدة البيانات وتشغيل Migration:

1. **إنشاء Clinic:**
   ```bash
   # فتح Prisma Studio
   npm run db:studio
   # أو استخدام API
   ```

2. **نسخ Clinic ID:**
   - من Prisma Studio أو من API response
   - انسخ `id` الخاص بالـ Clinic

---

## 📝 إضافة Environment Variables في Vercel

### الطريقة 1: من Vercel Dashboard (موصى به)

1. **اذهب إلى:** https://vercel.com/dashboard
2. **اختر المشروع:** `hayat-ai` (أو اسم مشروعك)
3. **Settings → Environment Variables**
4. **أضف المتغيرات التالية:**

#### Critical (Required):
```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database?schema=public
Environment: Production, Preview, Development (اختر الكل)
```

```
Name: DEFAULT_CLINIC_ID
Value: clinic_id_here
Environment: Production, Preview, Development
```

```
Name: OPENAI_API_KEY
Value: sk-xxxxxxxxxxxxx
Environment: Production, Preview, Development
```

#### Clerk (Recommended):
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_xxxxxxxxxxxxx
Environment: Production, Preview, Development
```

```
Name: CLERK_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxx
Environment: Production, Preview, Development
```

#### Twilio (Optional - for WhatsApp):
```
Name: TWILIO_ACCOUNT_SID
Value: ACxxxxxxxxxxxxx
Environment: Production, Preview, Development
```

```
Name: TWILIO_AUTH_TOKEN
Value: xxxxxxxxxxxxx
Environment: Production, Preview, Development
```

```
Name: TWILIO_WHATSAPP_FROM
Value: whatsapp:+1234567890
Environment: Production, Preview, Development
```

5. **اضغط:** "Save" لكل متغير

6. **Redeploy المشروع:**
   - Deployments → Latest → "Redeploy"

---

### الطريقة 2: من Vercel CLI

```bash
# تثبيت Vercel CLI (إذا لم يكن مثبت)
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة Environment Variables
vercel env add DATABASE_URL
vercel env add DEFAULT_CLINIC_ID
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_WHATSAPP_FROM

# رفع التغييرات
vercel --prod
```

---

## 📝 إضافة Environment Variables محلياً

### إنشاء `.env.local`

1. **أنشئ ملف:** `.env.local` في جذر المشروع

2. **انسخ من `.env.example`:**
   ```bash
   cp .env.example .env.local
   ```

3. **املأ القيم:**

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CLERK AUTHENTICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OPENAI (AI Agent)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPENAI_API_KEY="sk-xxxxxxxxxxxxx"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TWILIO (WhatsApp)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxx"
TWILIO_WHATSAPP_FROM="whatsapp:+1234567890"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DEFAULT CLINIC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFAULT_CLINIC_ID="clinic_id_here"
WHATSAPP_DEFAULT_CLINIC_ID="clinic_id_here"
```

4. **ملاحظة:** `.env.local` موجود في `.gitignore` ولن يتم رفعه إلى Git

---

## ✅ التحقق من الإعداد

### 1. التحقق من Environment Variables

```bash
npm run check-env
```

**النتيجة المتوقعة:**
```
✅ DATABASE_URL: postgresql://...
✅ DEFAULT_CLINIC_ID: clinic_id_here
✅ OPENAI_API_KEY: sk-...
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_test_...
✅ CLERK_SECRET_KEY: sk_test_...
⚠️  TWILIO_ACCOUNT_SID: Not set (optional but recommended)
```

### 2. التحقق من قاعدة البيانات

```bash
tsx scripts/check-db.ts
```

### 3. اختبار التطبيق

```bash
npm run dev
# افتح http://localhost:3000
```

---

## 📊 قائمة Environment Variables الكاملة

### 🔴 Critical (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DEFAULT_CLINIC_ID` | Default clinic ID | `clinic_xxx` |
| `OPENAI_API_KEY` | OpenAI API key for AI agent | `sk-xxx` |

### 🟡 Recommended

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_xxx` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_xxx` |

### 🟢 Optional

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `xxx` |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp number | `whatsapp:+1234567890` |
| `EMAIL_SERVICE` | Email service provider | `mock`, `sendgrid`, `resend` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxx` |
| `RESEND_API_KEY` | Resend API key | `re_xxx` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_xxx` |

---

## ⚠️ استكشاف الأخطاء

### خطأ: "Environment variable not found"
**السبب:** المتغير غير موجود في Vercel أو `.env.local`

**الحل:**
1. تحقق من Vercel Environment Variables
2. تحقق من `.env.local` محلياً
3. أعد تشغيل المشروع بعد إضافة المتغيرات

---

### خطأ: "Invalid DATABASE_URL"
**السبب:** DATABASE_URL غير صحيح

**الحل:**
1. تحقق من صحة Connection String
2. تحقق من أن قاعدة البيانات تعمل
3. تحقق من Firewall/Security Groups

---

### خطأ: "Clerk not configured"
**السبب:** Clerk API Keys غير موجودة

**الحل:**
1. أضف `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` و `CLERK_SECRET_KEY`
2. راجع `CLERK_SETUP_GUIDE.md`

---

### خطأ: "OpenAI API key invalid"
**السبب:** OPENAI_API_KEY غير صحيح أو منتهي الصلاحية

**الحل:**
1. تحقق من API Key من OpenAI Dashboard
2. تحقق من وجود رصيد كافي

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ استخدم Environment Variables دائماً
- ✅ لا ترفع `.env.local` إلى Git
- ✅ استخدم Production Keys في الإنتاج فقط
- ✅ راجع Environment Variables بانتظام

### ❌ DON'T:
- ❌ لا تضع Secrets في الكود
- ❌ لا تشارك API Keys
- ❌ لا تستخدم Test Keys في الإنتاج
- ❌ لا ترفع `.env` إلى Git

---

## 📚 الملفات المرجعية

- `.env.example` - Template للـ Environment Variables
- `scripts/check-env.ts` - Script للتحقق من المتغيرات
- `CLERK_SETUP_GUIDE.md` - دليل إعداد Clerk
- `DATABASE_SETUP_COMPLETE.md` - دليل إعداد قاعدة البيانات
- `WhatsApp_Integration_Status.md` - دليل إعداد WhatsApp

---

## ✅ قائمة التحقق

### Critical:
- [ ] `DATABASE_URL` مضاف في Vercel
- [ ] `DATABASE_URL` مضاف في `.env.local`
- [ ] `DEFAULT_CLINIC_ID` مضاف في Vercel
- [ ] `DEFAULT_CLINIC_ID` مضاف في `.env.local`
- [ ] `OPENAI_API_KEY` مضاف في Vercel
- [ ] `OPENAI_API_KEY` مضاف في `.env.local`

### Recommended:
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` مضاف
- [ ] `CLERK_SECRET_KEY` مضاف

### Optional:
- [ ] `TWILIO_ACCOUNT_SID` مضاف
- [ ] `TWILIO_AUTH_TOKEN` مضاف
- [ ] `TWILIO_WHATSAPP_FROM` مضاف

### Verification:
- [ ] `npm run check-env` يعمل بدون أخطاء
- [ ] `tsx scripts/check-db.ts` يعمل بدون أخطاء
- [ ] التطبيق يعمل محلياً
- [ ] التطبيق يعمل على Vercel

---

**الحالة:** ✅ الأدلة جاهزة - يحتاج إضافة Environment Variables فقط

**تاريخ الإنشاء:** 2024-12-24

















