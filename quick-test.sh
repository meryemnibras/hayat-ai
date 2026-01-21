#!/bin/bash

echo "🔍 بدء الفحص السريع..."
echo ""

# 1. فحص الملفات
echo "1️⃣ فحص الملفات الأساسية..."
[ -f ".env" ] && echo "✅ .env موجود" || echo "❌ .env مفقود"
[ -f "package.json" ] && echo "✅ package.json موجود" || echo "❌ package.json مفقود"
[ -d "src/app" ] && echo "✅ src/app موجود" || echo "❌ src/app مفقود"
[ -d "src/components" ] && echo "✅ src/components موجود" || echo "❌ src/components مفقود"
[ -d "src/data" ] && echo "✅ src/data موجود" || echo "❌ src/data مفقود"
[ -d "src/lib" ] && echo "✅ src/lib موجود" || echo "❌ src/lib مفقود"
[ -d "src/store" ] && echo "✅ src/store موجود" || echo "❌ src/store مفقود"
echo ""

# 2. فحص Dependencies
echo "2️⃣ فحص Dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules موجود"
else
    echo "⚠️ node_modules مفقود - جاري التثبيت..."
    npm install --legacy-peer-deps
fi
echo ""

# 3. فحص TypeScript
echo "3️⃣ فحص TypeScript..."
if npx tsc --noEmit; then
    echo "✅ لا أخطاء TypeScript"
else
    echo "❌ يوجد أخطاء TypeScript"
fi
echo ""

# 4. فحص البيانات
echo "4️⃣ فحص قاعدة البيانات..."
if [ -f "src/scripts/check-data.ts" ]; then
    npx tsx src/scripts/check-data.ts
else
    echo "⚠️ ملف check-data.ts غير موجود (اختياري)"
fi
echo ""

# 5. Build
echo "5️⃣ بناء المشروع..."
if npm run build; then
    echo "✅ Build ناجح"
else
    echo "❌ Build فشل"
fi
echo ""

echo "✅ اكتمل الفحص السريع!"
echo ""
echo "للتشغيل: npm run dev"
echo "ثم افتح: http://localhost:3000"





