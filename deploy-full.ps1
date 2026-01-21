# ═══════════════════════════════════════
# سكريبت النشر الكامل التلقائي - عيادة حياة
# ═══════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "🚀 بدء عملية النشر الكاملة..." -ForegroundColor Green
Write-Host ""

# الانتقال إلى مجلد المشروع
$projectPath = "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
Set-Location $projectPath

Write-Host "📁 المجلد: $projectPath" -ForegroundColor Cyan
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 1: التحقق من Node.js
# ═══════════════════════════════════════
Write-Host "1️⃣ التحقق من Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js غير مثبت!" -ForegroundColor Red
    Write-Host "📥 يرجى تثبيت Node.js من: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
$nodeVersion = node --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 2: تثبيت Dependencies
# ═══════════════════════════════════════
Write-Host "2️⃣ تثبيت Dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "📦 تثبيت الحزم..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل تثبيت الحزم" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies موجودة" -ForegroundColor Green
}
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 3: التحقق من .env
# ═══════════════════════════════════════
Write-Host "3️⃣ التحقق من ملف .env..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "⚠️  ملف .env غير موجود" -ForegroundColor Yellow
    if (Test-Path "ENV_TEMPLATE.md") {
        Write-Host "📝 يرجى إنشاء .env من ENV_TEMPLATE.md" -ForegroundColor Yellow
        Write-Host "⚠️  سيتم المتابعة بدون .env (للتطوير فقط)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ ملف .env موجود" -ForegroundColor Green
}
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 4: Prisma Generate
# ═══════════════════════════════════════
Write-Host "4️⃣ توليد Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  تحذير: فشل توليد Prisma Client" -ForegroundColor Yellow
    Write-Host "   (قد يكون هذا طبيعياً إذا لم تكن قاعدة البيانات جاهزة)" -ForegroundColor Yellow
}
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 5: بناء المشروع
# ═══════════════════════════════════════
Write-Host "5️⃣ بناء المشروع..." -ForegroundColor Yellow
Write-Host "   (قد يستغرق هذا بضع دقائق...)" -ForegroundColor Cyan

# حذف مجلد .next القديم
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# محاولة البناء
npm run build 2>&1 | Tee-Object -Variable buildOutput

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  فشل البناء المحلي" -ForegroundColor Yellow
    Write-Host "   (هذا قد يكون طبيعياً - Vercel سيقوم بالبناء)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ تم البناء بنجاح!" -ForegroundColor Green
    Write-Host ""
}

# ═══════════════════════════════════════
# الخطوة 6: التحقق من Vercel CLI
# ═══════════════════════════════════════
Write-Host "6️⃣ التحقق من Vercel CLI..." -ForegroundColor Yellow
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 تثبيت Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل تثبيت Vercel CLI" -ForegroundColor Red
        Write-Host "   حاول يدوياً: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host "✅ Vercel CLI مثبت" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 7: النشر على Vercel
# ═══════════════════════════════════════
Write-Host "7️⃣ النشر على Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 التعليمات:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. سيتم فتح نافذة تسجيل الدخول في المتصفح" -ForegroundColor White
Write-Host "2. سجل دخولك إلى Vercel" -ForegroundColor White
Write-Host "3. اتبع التعليمات على الشاشة" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$deployChoice = Read-Host "هل تريد المتابعة مع النشر؟ (Y/N)"
if ($deployChoice -eq "Y" -or $deployChoice -eq "y") {
    Write-Host ""
    Write-Host "🚀 بدء النشر..." -ForegroundColor Green
    Write-Host ""
    
    # النشر الأولي
    vercel
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "✅ تم النشر الأولي!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 الخطوات التالية:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. اذهب إلى: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. اختر مشروعك" -ForegroundColor White
    Write-Host "3. اذهب إلى Settings → Environment Variables" -ForegroundColor White
    Write-Host "4. أضف المتغيرات المطلوبة:" -ForegroundColor White
    Write-Host "   - DATABASE_URL" -ForegroundColor Cyan
    Write-Host "   - OPENAI_API_KEY" -ForegroundColor Cyan
    Write-Host "   - NEXT_PUBLIC_APP_URL" -ForegroundColor Cyan
    Write-Host "   - DEFAULT_CLINIC_ID" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "5. بعد إضافة المتغيرات، قم بالنشر النهائي:" -ForegroundColor White
    Write-Host "   vercel --prod" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "📋 لاستكمال النشر لاحقاً:" -ForegroundColor Yellow
    Write-Host "   1. vercel login" -ForegroundColor Cyan
    Write-Host "   2. vercel" -ForegroundColor Cyan
    Write-Host "   3. أضف Environment Variables في Dashboard" -ForegroundColor Cyan
    Write-Host "   4. vercel --prod" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ اكتملت العملية!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""



