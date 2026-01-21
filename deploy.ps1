# ═══════════════════════════════════════
# سكريبت النشر التلقائي - عيادة حياة
# ═══════════════════════════════════════

Write-Host "🚀 بدء عملية النشر..." -ForegroundColor Green

# التحقق من Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI غير مثبت" -ForegroundColor Red
    Write-Host "📦 تثبيت Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# الانتقال إلى مجلد المشروع
$projectPath = "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
Set-Location $projectPath

Write-Host "📁 المجلد الحالي: $projectPath" -ForegroundColor Cyan

# التحقق من وجود .env
if (!(Test-Path ".env")) {
    Write-Host "⚠️  ملف .env غير موجود" -ForegroundColor Yellow
    Write-Host "📝 إنشاء .env من .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ تم إنشاء .env - يرجى ملء القيم المطلوبة" -ForegroundColor Green
    } else {
        Write-Host "❌ ملف .env.example غير موجود" -ForegroundColor Red
        exit 1
    }
}

# التحقق من Prisma
Write-Host "🔍 التحقق من Prisma..." -ForegroundColor Cyan
npx prisma generate

# بناء المشروع
Write-Host "🔨 بناء المشروع..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل البناء" -ForegroundColor Red
    exit 1
}

Write-Host "✅ تم البناء بنجاح" -ForegroundColor Green

# النشر على Vercel
Write-Host "🚀 النشر على Vercel..." -ForegroundColor Cyan
Write-Host "📝 سيتم فتح نافذة تسجيل الدخول..." -ForegroundColor Yellow

$deployChoice = Read-Host "هل تريد النشر الآن؟ (Y/N)"
if ($deployChoice -eq "Y" -or $deployChoice -eq "y") {
    vercel --prod
} else {
    Write-Host "📋 لاستكمال النشر يدوياً، قم بتشغيل:" -ForegroundColor Yellow
    Write-Host "   vercel --prod" -ForegroundColor Cyan
}

Write-Host "✅ اكتملت العملية!" -ForegroundColor Green



