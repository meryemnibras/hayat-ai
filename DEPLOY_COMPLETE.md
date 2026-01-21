# 🚀 دليل النشر الكامل - عيادة حياة للتجميل

## ✅ حالة المشروع

- ✅ **Next.js 16** - جاهز
- ✅ **Prisma** - جاهز
- ✅ **TypeScript** - جاهز
- ✅ **API Routes** - جاهز
- ✅ **AI Integration** - جاهز
- ✅ **Stripe Payments** - جاهز
- ✅ **WhatsApp Integration** - جاهز
- ✅ **Analytics** - جاهز

---

## 📋 الطريقة 1: النشر على Vercel (موصى به)

### الخطوة 1: تثبيت Vercel CLI

```powershell
npm install -g vercel
```

### الخطوة 2: تسجيل الدخول

```powershell
vercel login
```

### الخطوة 3: الانتقال إلى مجلد المشروع

```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
```

### الخطوة 4: النشر الأولي

```powershell
vercel
```

سيطلب منك:
- **Set up and deploy?** → اضغط `Y`
- **Which scope?** → اختر حسابك
- **Link to existing project?** → `N` (للمرة الأولى)
- **What's your project's name?** → `hayat-ai`
- **In which directory is your code located?** → اضغط Enter

### الخطوة 5: إضافة Environment Variables

#### عبر Vercel Dashboard:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك `hayat-ai`
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

#### المتغيرات المطلوبة:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# OpenAI (مطلوب)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Hayat Beauty Clinic

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr

# Default Clinic
DEFAULT_CLINIC_ID=default-clinic-id
```

#### المتغيرات الاختيارية:

```env
# Clerk (إذا كنت تستخدمه)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe (إذا كنت تستخدمه)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxx
NEXT_PUBLIC_POSTHOG_KEY=xxxxx

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_DEFAULT_CLINIC_ID=default-clinic-id
```

### الخطوة 6: إعداد قاعدة البيانات

#### خيار 1: استخدام Vercel Postgres (موصى به)

1. في Vercel Dashboard → **Storage** → **Create Database**
2. اختر **Postgres**
3. انسخ `DATABASE_URL` وأضفه إلى Environment Variables

#### خيار 2: استخدام قاعدة بيانات خارجية

- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

### الخطوة 7: تشغيل Migrations

```powershell
# في Vercel Dashboard → Deployments → اختر آخر deployment
# أو عبر CLI:
vercel env pull .env.production
npx prisma migrate deploy
```

### الخطوة 8: النشر النهائي

```powershell
vercel --prod
```

---

## 📋 الطريقة 2: النشر عبر GitHub + Vercel

### الخطوة 1: إنشاء Repository على GitHub

```powershell
cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hayat-ai.git
git push -u origin main
```

### الخطوة 2: ربط Vercel بـ GitHub

1. اذهب إلى: https://vercel.com/new
2. اختر **Import Git Repository**
3. اختر `hayat-ai`
4. أضف Environment Variables (كما في الطريقة 1)
5. اضغط **Deploy**

---

## 📋 الطريقة 3: النشر على سيرفر خاص (VPS/Dedicated)

### المتطلبات:

- Node.js 20+
- PostgreSQL 14+
- PM2 أو systemd
- Nginx (اختياري)

### الخطوة 1: رفع الملفات

```bash
# عبر SCP
scp -r hayat-ai/* user@your-server:/var/www/hayat-ai/

# أو عبر Git
git clone https://github.com/YOUR_USERNAME/hayat-ai.git
cd hayat-ai
```

### الخطوة 2: تثبيت Dependencies

```bash
npm install
```

### الخطوة 3: إعداد Environment Variables

```bash
cp .env.example .env
nano .env  # أضف القيم المطلوبة
```

### الخطوة 4: إعداد قاعدة البيانات

```bash
npx prisma migrate deploy
npx prisma generate
```

### الخطوة 5: بناء المشروع

```bash
npm run build
```

### الخطوة 6: تشغيل المشروع

#### باستخدام PM2:

```bash
npm install -g pm2
pm2 start npm --name "hayat-ai" -- start
pm2 save
pm2 startup
```

#### باستخدام systemd:

```bash
# إنشاء ملف service
sudo nano /etc/systemd/system/hayat-ai.service
```

```ini
[Unit]
Description=Hayat AI Clinic
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hayat-ai
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable hayat-ai
sudo systemctl start hayat-ai
```

### الخطوة 7: إعداد Nginx (اختياري)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔍 التحقق من النشر

### 1. فحص الصفحة الرئيسية

```
https://your-domain.vercel.app
```

### 2. فحص API Health

```
https://your-domain.vercel.app/api/health
```

### 3. فحص قاعدة البيانات

```bash
npx prisma studio
# أو
npx prisma db pull
```

---

## 🐛 حل المشاكل الشائعة

### خطأ: "DATABASE_URL is not set"

**الحل**: تأكد من إضافة `DATABASE_URL` في Environment Variables

### خطأ: "Prisma Client not generated"

**الحل**: 
```bash
npx prisma generate
```

### خطأ: "Migration failed"

**الحل**:
```bash
npx prisma migrate deploy
```

### خطأ: "OpenAI API Key invalid"

**الحل**: تأكد من صحة `OPENAI_API_KEY` في Environment Variables

---

## 📞 الدعم

- **Email**: info@mediai.tr
- **WhatsApp**: 00905362266054

---

## ✅ قائمة التحقق النهائية

- [ ] تم إعداد قاعدة البيانات
- [ ] تم إضافة جميع Environment Variables
- [ ] تم تشغيل Migrations
- [ ] تم بناء المشروع بنجاح
- [ ] تم النشر على Vercel/Server
- [ ] تم اختبار الصفحة الرئيسية
- [ ] تم اختبار API Routes
- [ ] تم اختبار Chat AI
- [ ] تم اختبار Payments (إذا كان مفعلاً)
- [ ] تم اختبار WhatsApp (إذا كان مفعلاً)

---

**🎉 تهانينا! المشروع جاهز للانطلاق!**



