# 🚀 Quick Start - إعداد قاعدة البيانات

## الخطوات السريعة (5 دقائق)

### 1. إعداد قاعدة البيانات
```
Vercel → Storage → Create Database → Postgres
أو
Supabase → New Project → Copy DATABASE_URL
```

### 2. إضافة DATABASE_URL
```
Vercel: Settings → Environment Variables
أو
محلياً: .env.local
```

### 3. تشغيل Migration
```bash
# التحقق من Schema
npm run db:validate

# توليد Prisma Client
npm run db:generate

# إنشاء Migration
npm run db:migrate
```

### 4. التحقق
```bash
# فتح Prisma Studio
npm run db:studio

# أو اختبار قاعدة البيانات
tsx scripts/check-db.ts
```

---

## ✅ النتيجة

بعد الإعداد:
- ✅ قاعدة البيانات جاهزة
- ✅ جميع Tables والعلاقات موجودة
- ✅ APIs تعمل مع قاعدة البيانات

---

**الدليل الكامل:** راجع `MIGRATION_INSTRUCTIONS.md`

















