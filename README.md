# 🏥 Hayat AI Clinic - مساعد ذكاء اصطناعي لعيادة التجميل

<div dir="rtl">

## 📋 نظرة عامة

مشروع Next.js شامل لإنشاء مساعد ذكاء اصطناعي ذكي لعيادة حياة للتجميل في إسطنبول، تركيا. المشروع مدعوم بأحدث التقنيات:

- **Next.js 16** مع App Router
- **LangChain** و **OpenAI GPT-4** للذكاء الاصطناعي
- **Zustand** لإدارة الحالة
- **Prisma** لقاعدة البيانات
- **Tailwind CSS** للتصميم
- **Radix UI** للمكونات

---

## 🚀 البدء السريع

### 1. تثبيت Dependencies

```bash
cd hayat-ai
npm install
```

### 2. إعداد ملف .env

أنشئ ملف `.env` في جذر المشروع (راجع `CREATE_ENV.md`):

```env
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Hayat Beauty Clinic
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr
```

### 3. تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 📁 هيكل المشروع

```
hayat-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Chat API
│   │   │   │   ├── route.ts   # Chat endpoint
│   │   │   │   └── stream/    # Streaming endpoint
│   │   │   └── ...
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   └── layout.tsx         # Layout
│   │
│   ├── components/             # React Components
│   │   ├── chat/              # Chat Components
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── QuickActions.tsx
│   │   └── ...
│   │
│   ├── data/                   # البيانات
│   │   ├── clinic-data.ts     # بيانات العيادة الكاملة
│   │   ├── types/             # TypeScript Types
│   │   └── ...
│   │
│   ├── lib/                    # Utilities
│   │   ├── ai-chat.ts         # AI Chat Functions
│   │   ├── langchain-enhanced.ts # System Prompt
│   │   ├── utils.ts          # Helper Functions
│   │   └── ...
│   │
│   └── store/                  # State Management
│       └── chat-store.ts      # Zustand Store
│
├── prisma/                     # Database
│   ├── schema.prisma          # Prisma Schema
│   └── seed.ts                # Seed Data
│
├── public/                     # Static Files
│   └── ...
│
├── .env                        # Environment Variables (لا يُرفع)
├── .gitignore                 # Git Ignore
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript Config
├── next.config.ts             # Next.js Config
├── vercel.json                # Vercel Config
│
├── DEPLOY.md                   # دليل النشر الكامل
├── DEPLOY_CHECKLIST.md        # Checklist النشر
├── SETUP_GUIDE_AR.md          # دليل الإعداد
├── QUICK_START.md             # البدء السريع
└── CREATE_ENV.md              # تعليمات إنشاء .env
```

---

## 🔧 الميزات الرئيسية

### 1. **Chat AI مع Streaming**
- ردود متدفقة في الوقت الفعلي
- دعم Markdown
- حفظ المحادثات في localStorage
- واجهة مستخدم حديثة

### 2. **بيانات العيادة الشاملة**
- معلومات العيادة الكاملة
- قائمة العلاجات (زراعة الشعر، تجميل الأنف، إلخ)
- الأسعار والتفاصيل
- الباقات والعروض
- الأسئلة الشائعة

### 3. **System Prompt محسّن**
- معلومات العيادة مدمجة
- تعليمات واضحة للـ AI
- دعم متعدد اللغات (عربي، تركي، إنجليزي، فرنسي)

### 4. **UI/UX حديث**
- تصميم متجاوب
- دعم RTL (العربية)
- أنيميشن سلس
- مكونات Radix UI

---

## 📚 الملفات المهمة

### `src/data/clinic-data.ts`
يحتوي على جميع بيانات العيادة: العلاجات، الأسعار، الباقات، إلخ.

### `src/lib/langchain-enhanced.ts`
System Prompt للـ AI مع معلومات العيادة.

### `src/lib/ai-chat.ts`
وظائف التواصل مع OpenAI.

### `src/store/chat-store.ts`
إدارة حالة المحادثة باستخدام Zustand.

### `src/app/api/chat/stream/route.ts`
API endpoint للردود المتدفقة.

---

## 🛠️ الأوامر المتاحة

```bash
# التطوير
npm run dev

# البناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص متغيرات البيئة
npm run check-env

# Prisma
npm run db:generate    # توليد Prisma Client
npm run db:migrate     # تشغيل Migrations
npm run db:studio      # فتح Prisma Studio
npm run db:seed        # Seed البيانات
```

---

## 🌐 النشر

### النشر على Vercel (موصى به)

1. ارفع المشروع إلى GitHub
2. اربط المشروع بـ Vercel
3. أضف متغيرات البيئة في Vercel Dashboard
4. انشر!

**للمزيد من التفاصيل**: راجع `DEPLOY.md`

---

## 🔐 الأمان

- لا ترفع ملف `.env` إلى Git
- استخدم `.env.local` للمتغيرات المحلية
- تأكد من وجود `OPENAI_API_KEY` قبل التشغيل
- استخدم Environment Variables في Vercel

---

## 📞 الدعم

للمساعدة أو الاستفسارات:
- **WhatsApp**: 00905362266054
- **Email**: info@mediai.tr

---

## 📝 الوثائق

- `SETUP_GUIDE_AR.md` - دليل الإعداد الكامل
- `QUICK_START.md` - البدء السريع
- `DEPLOY.md` - دليل النشر
- `DEPLOY_CHECKLIST.md` - Checklist النشر
- `CREATE_ENV.md` - تعليمات إنشاء .env

---

## ✅ Checklist قبل التشغيل

- [ ] تثبيت Dependencies (`npm install`)
- [ ] إنشاء ملف `.env` مع `OPENAI_API_KEY`
- [ ] تشغيل `npm run dev`
- [ ] فتح `http://localhost:3000`
- [ ] اختبار Chat AI

---

## 🎯 الميزات المستقبلية

- [ ] دعم WhatsApp Integration
- [ ] نظام الحجوزات
- [ ] Dashboard للإدارة
- [ ] Analytics متقدم
- [ ] دعم المزيد من اللغات

---

**تم إنشاء المشروع بواسطة AI Assistant** 🤖

</div>
