# ═══════════════════════════════════════
# سكريبت الاختبار السريع
# ═══════════════════════════════════════

Write-Host "🔍 بدء الفحص السريع..." -ForegroundColor Cyan
Write-Host ""

# 1. فحص الملفات
Write-Host "1️⃣ فحص الملفات الأساسية..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env موجود" -ForegroundColor Green
} else {
    Write-Host "❌ .env مفقود" -ForegroundColor Red
}

if (Test-Path "package.json") {
    Write-Host "✅ package.json موجود" -ForegroundColor Green
} else {
    Write-Host "❌ package.json مفقود" -ForegroundColor Red
}

if (Test-Path "src/app") {
    Write-Host "✅ src/app موجود" -ForegroundColor Green
} else {
    Write-Host "❌ src/app مفقود" -ForegroundColor Red
}

if (Test-Path "src/components") {
    Write-Host "✅ src/components موجود" -ForegroundColor Green
} else {
    Write-Host "❌ src/components مفقود" -ForegroundColor Red
}

if (Test-Path "src/data") {
    Write-Host "✅ src/data موجود" -ForegroundColor Green
} else {
    Write-Host "❌ src/data مفقود" -ForegroundColor Red
}

if (Test-Path "src/lib") {
    Write-Host "✅ src/lib موجود" -ForegroundColor Green
} else {
    Write-Host "❌ src/lib مفقود" -ForegroundColor Red
}

if (Test-Path "src/store") {
    Write-Host "✅ src/store موجود" -ForegroundColor Green
} else {
    Write-Host "❌ src/store مفقود" -ForegroundColor Red
}

Write-Host ""

# 2. فحص Dependencies
Write-Host "2️⃣ فحص Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules موجود" -ForegroundColor Green
} else {
    Write-Host "⚠️ node_modules مفقود - جاري التثبيت..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}
Write-Host ""

# 3. فحص TypeScript
Write-Host "3️⃣ فحص TypeScript..." -ForegroundColor Yellow
try {
    $tscResult = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ لا أخطاء TypeScript" -ForegroundColor Green
    } else {
        Write-Host "❌ يوجد أخطاء TypeScript" -ForegroundColor Red
        Write-Host $tscResult
    }
} catch {
    Write-Host "⚠️ لا يمكن تشغيل TypeScript check" -ForegroundColor Yellow
}
Write-Host ""

# 4. فحص البيانات (اختياري)
Write-Host "4️⃣ فحص البيانات..." -ForegroundColor Yellow
if (Test-Path "src/scripts/check-data.ts") {
    try {
        npx tsx src/scripts/check-data.ts
    } catch {
        Write-Host "⚠️ لا يمكن تشغيل check-data.ts" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ ملف check-data.ts غير موجود (اختياري)" -ForegroundColor Yellow
}
Write-Host ""

# 5. Build
Write-Host "5️⃣ بناء المشروع..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build ناجح" -ForegroundColor Green
    } else {
        Write-Host "❌ Build فشل" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Build فشل" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ اكتمل الفحص السريع!" -ForegroundColor Green
Write-Host ""
Write-Host "للتشغيل: npm run dev" -ForegroundColor Cyan
Write-Host "ثم افتح: http://localhost:3000" -ForegroundColor Cyan





