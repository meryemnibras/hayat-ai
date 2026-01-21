# 🔐 إعداد Vercel Secrets - عيادة حياة للتجميل

## ✅ ملف `vercel.json` جاهز

تم تحديث `vercel.json` مع الإعدادات التالية:

- ✅ Build commands
- ✅ Framework: Next.js
- ✅ Region: fra1 (Frankfurt)
- ✅ Environment variables (using Vercel Secrets)
- ✅ Security headers
- ✅ WhatsApp redirect

## 🔧 إضافة Secrets في Vercel

### الطريقة 1: عبر Vercel Dashboard (موصى به)

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Settings** > **Environment Variables**
4. أضف المتغيرات التالية:

#### Secrets (مخفية):
```
openai-api-key = sk-proj-your-actual-key-here
```

#### Environment Variables:
```
OPENAI_MODEL = gpt-4-turbo-preview
TEMPERATURE = 0.7
MAX_TOKENS = 2000
NEXTAUTH_SECRET = your-secret-key-here
NEXTAUTH_URL = https://your-domain.vercel.app
DATABASE_URL = postgresql://user:password@host:5432/database
GOOGLE_CLIENT_ID = your-google-client-id (optional)
GOOGLE_CLIENT_SECRET = your-google-client-secret (optional)
```

#### Build Environment Variables:
```
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

### الطريقة 2: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة Secret
vercel secrets add openai-api-key

# إضافة Environment Variable
vercel env add OPENAI_MODEL production
vercel env add TEMPERATURE production
vercel env add MAX_TOKENS production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add DATABASE_URL production

# إضافة Build Environment Variable
vercel env add NEXT_PUBLIC_APP_URL production
```

## 📋 Checklist قبل النشر

- [ ] تم إضافة `openai-api-key` كـ Secret في Vercel
- [ ] تم تحديث `NEXT_PUBLIC_APP_URL` في `vercel.json` برابط النطاق الحقيقي
- [ ] تم إضافة جميع Environment Variables عبر Vercel Dashboard
- [ ] تم إعداد قاعدة البيانات (PostgreSQL)
- [ ] تم إضافة `DATABASE_URL` في Vercel
- [ ] (اختياري) تم إعداد Google OAuth وإضافة credentials

## 🔍 ملاحظات مهمة

### 1. Secrets vs Environment Variables

- **Secrets**: للمعلومات الحساسة (مثل API keys)
  - يتم إضافتها عبر `vercel secrets add`
  - يتم استخدامها في `vercel.json` كـ `@secret-name`

- **Environment Variables**: للمتغيرات العادية
  - يتم إضافتها عبر Vercel Dashboard أو CLI
  - يمكن رؤيتها في الكود (لكن لا تضع معلومات حساسة)

### 2. NEXT_PUBLIC_APP_URL

قم بتحديث هذا المتغير في `vercel.json` بعد النشر:

```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://your-actual-domain.vercel.app"
    }
  }
}
```

### 3. Environment Variables في vercel.json

المتغيرات في `vercel.json` تستخدم Secrets:
- `@openai-api-key` يشير إلى Secret باسم `openai-api-key`
- يجب إضافة هذا Secret في Vercel Dashboard أولاً

## 🚀 النشر

بعد إضافة جميع المتغيرات:

```bash
# النشر
vercel --prod

# أو عبر Git (إذا كان المشروع مربوط بـ GitHub)
# Vercel سينشر تلقائياً عند push
```

## 🔐 الأمان

- ✅ لا تضع Secrets مباشرة في `vercel.json`
- ✅ استخدم Vercel Secrets للمعلومات الحساسة
- ✅ استخدم Environment Variables للمتغيرات العامة
- ✅ لا ترفع ملف `.env` إلى Git

---

**آخر تحديث:** 2024











