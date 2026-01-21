# ⚡ دليل النشر السريع - Vercel

## 🚀 النشر في 5 دقائق

### الطريقة السريعة (موصى بها):

1. **اذهب إلى:** [https://vercel.com](https://vercel.com)
2. **اضغط:** "New Project"
3. **اربط:** Git Repository (GitHub/GitLab/Bitbucket)
4. **أضف Environment Variables:**

```
OPENAI_API_KEY=sk-proj-xxx
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr
```

5. **اضغط:** "Deploy"
6. **✅ تم!** ستحصل على رابط مثل: `https://hayat-ai.vercel.app`

---

## 📋 بعد النشر:

1. **حدّث `NEXT_PUBLIC_APP_URL`** في Environment Variables بالرابط الفعلي
2. **اختبر الموقع:** افتح الرابط وتأكد من عمل المحادثة
3. **ربط Domain:** (اختياري) Settings → Domains

---

## 📖 للتفاصيل الكاملة:

راجع `VERCEL_DEPLOY.md` للتعليمات التفصيلية

---

## ✅ التحقق من الجاهزية:

```bash
npx tsx scripts/check-deploy-ready.ts
```

---

**جاهز للنشر! 🎉**












