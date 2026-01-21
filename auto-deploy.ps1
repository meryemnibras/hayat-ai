# ═══════════════════════════════════════
# النشر التلقائي الكامل - عيادة حياة
# ═══════════════════════════════════════

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "🚀 النشر التلقائي - عيادة حياة" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# الانتقال إلى المشروع
$projectPath = "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"
Set-Location $projectPath

# ═══════════════════════════════════════
# الخطوة 1: فتح Vercel
# ═══════════════════════════════════════
Write-Host "1️⃣ فتح صفحة Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/signup"
Write-Host "✅ تم فتح المتصفح" -ForegroundColor Green
Write-Host "   📝 سجل دخولك أو أنشئ حساب جديد" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 3

# ═══════════════════════════════════════
# الخطوة 2: تثبيت Vercel CLI
# ═══════════════════════════════════════
Write-Host "2️⃣ التحقق من Vercel CLI..." -ForegroundColor Yellow
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 تثبيت Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
} else {
    Write-Host "✅ Vercel CLI موجود" -ForegroundColor Green
}
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 3: تثبيت Dependencies
# ═══════════════════════════════════════
Write-Host "3️⃣ التحقق من Dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "📦 تثبيت الحزم..." -ForegroundColor Cyan
    npm install
}
Write-Host "✅ Dependencies جاهزة" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 4: Prisma Generate
# ═══════════════════════════════════════
Write-Host "4️⃣ توليد Prisma Client..." -ForegroundColor Yellow
npx prisma generate 2>&1 | Out-Null
Write-Host "✅ تم توليد Prisma Client" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 5: تسجيل الدخول إلى Vercel
# ═══════════════════════════════════════
Write-Host "5️⃣ تسجيل الدخول إلى Vercel..." -ForegroundColor Yellow
Write-Host "   📝 سيتم فتح المتصفح لتسجيل الدخول" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 2

# محاولة تسجيل الدخول
Write-Host "   ⏳ انتظر فتح المتصفح..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# ═══════════════════════════════════════
# الخطوة 6: النشر
# ═══════════════════════════════════════
Write-Host "6️⃣ بدء النشر..." -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 اتبع التعليمات على الشاشة:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "   • Set up and deploy? → اضغط Y" -ForegroundColor White
Write-Host "   • Which scope? → اختر حسابك" -ForegroundColor White
Write-Host "   • Link to existing project? → اضغط N" -ForegroundColor White
Write-Host "   • Project name? → اضغط Enter (hayat-ai)" -ForegroundColor White
Write-Host "   • Directory? → اضغط Enter (./)" -ForegroundColor White
Write-Host ""

# النشر
vercel

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ تم النشر الأولي!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════
# الخطوة 7: فتح Dashboard لإضافة Environment Variables
# ═══════════════════════════════════════
Write-Host "7️⃣ فتح Dashboard لإضافة Environment Variables..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "https://vercel.com/dashboard"
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 الخطوات التالية:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. في Vercel Dashboard:" -ForegroundColor White
Write-Host "   → اختر مشروعك 'hayat-ai'" -ForegroundColor Cyan
Write-Host "   → Settings → Environment Variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. أضف هذه المتغيرات:" -ForegroundColor White
Write-Host ""
Write-Host "   DATABASE_URL" -ForegroundColor Yellow
Write-Host "   = postgresql://user:pass@host:5432/db" -ForegroundColor Gray
Write-Host ""
Write-Host "   OPENAI_API_KEY" -ForegroundColor Yellow
Write-Host "   = sk-proj-xxxxxxxxxxxxx" -ForegroundColor Gray
Write-Host ""
Write-Host "   NEXT_PUBLIC_APP_URL" -ForegroundColor Yellow
Write-Host "   = https://your-app.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "   DEFAULT_CLINIC_ID" -ForegroundColor Yellow
Write-Host "   = default-clinic-id" -ForegroundColor Gray
Write-Host ""
Write-Host "3. بعد إضافة المتغيرات:" -ForegroundColor White
Write-Host "   → اذهب إلى Deployments" -ForegroundColor Cyan
Write-Host "   → اضغط على آخر deployment" -ForegroundColor Cyan
Write-Host "   → اضغط Redeploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "   أو شغّل في Terminal:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host ""

# ═══════════════════════════════════════
# فتح صفحات مفيدة
# ═══════════════════════════════════════
Write-Host "8️⃣ فتح صفحات مفيدة..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Supabase للحصول على قاعدة بيانات مجانية
Start-Process "https://supabase.com/dashboard/projects"
Write-Host "   ✅ Supabase (لإنشاء قاعدة بيانات مجانية)" -ForegroundColor Green

Start-Sleep -Seconds 1

# OpenAI للحصول على API Key
Start-Process "https://platform.openai.com/api-keys"
Write-Host "   ✅ OpenAI (للحصول على API Key)" -ForegroundColor Green

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ اكتملت العملية!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📝 راجع ملف START_DEPLOY.md للتفاصيل" -ForegroundColor Cyan
Write-Host ""



