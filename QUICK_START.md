# ⚡ البدء السريع

## 1️⃣ تثبيت Dependencies

```bash
cd hayat-ai
npm install
```

## 2️⃣ إعداد .env

أنشئ ملف `.env` في مجلد `hayat-ai/`:

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

## 3️⃣ تشغيل المشروع

```bash
npm run dev
```

افتح: http://localhost:3000

---

## ✅ التحقق من الإعداد

- [ ] `npm install` تم بنجاح
- [ ] ملف `.env` موجود مع `OPENAI_API_KEY`
- [ ] `npm run dev` يعمل بدون أخطاء
- [ ] الموقع يفتح على localhost:3000

---

## 🐛 حل المشاكل

### خطأ: OPENAI_API_KEY غير موجود
- تأكد من وجود ملف `.env` في مجلد `hayat-ai/`
- تأكد من وجود `OPENAI_API_KEY` في الملف

### خطأ: Module not found
- شغّل `npm install` مرة أخرى
- احذف `node_modules` و `package-lock.json` ثم `npm install`

### خطأ: Port 3000 already in use
- غيّر المنفذ: `npm run dev -- -p 3001`

---

**للمزيد من التفاصيل**: راجع `SETUP_GUIDE_AR.md`






