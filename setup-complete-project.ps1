# ═════════════════════════════════════════════════════════════
# 🚀 سكريبت الإعداد الكامل للمشروع
# ═════════════════════════════════════════════════════════════

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 بدء الإعداد الكامل للمشروع" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ═════════════════════════════════════════════════════════════
# المرحلة 1: التحقق من المشروع
# ═════════════════════════════════════════════════════════════

Write-Host "المرحلة 1: التحقق من المشروع..." -ForegroundColor Yellow

if (-not (Test-Path "package.json")) {
    Write-Host "❌ المشروع غير موجود. يرجى إنشاء مشروع Next.js أولاً" -ForegroundColor Red
    Write-Host "شغّل: npx create-next-app@latest hayat-clinic-ai --typescript --tailwind --app --src-dir --import-alias `"@/*`"" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ المشروع موجود" -ForegroundColor Green
Write-Host ""

# ═════════════════════════════════════════════════════════════
# المرحلة 2: تثبيت Dependencies
# ═════════════════════════════════════════════════════════════

Write-Host "المرحلة 2: تثبيت Dependencies..." -ForegroundColor Yellow

$packages = @(
    "langchain",
    "@langchain/openai",
    "@langchain/core",
    "dotenv",
    "zod",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-avatar",
    "@radix-ui/react-tabs",
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "react-markdown",
    "remark-gfm",
    "date-fns",
    "zustand",
    "@next/third-parties",
    "mixpanel-browser",
    "react-ga4",
    "stripe",
    "@stripe/stripe-js",
    "@stripe/react-stripe-js",
    "next-auth",
    "@auth/prisma-adapter"
)

Write-Host "جاري تثبيت $($packages.Count) حزمة..." -ForegroundColor Cyan
npm install --legacy-peer-deps $packages

Write-Host "جاري تثبيت Dev Dependencies..." -ForegroundColor Cyan
npm install -D @types/node tsx

Write-Host "✅ اكتمل تثبيت Dependencies" -ForegroundColor Green
Write-Host ""

# ═════════════════════════════════════════════════════════════
# المرحلة 3: إنشاء ملف .env
# ═════════════════════════════════════════════════════════════

Write-Host "المرحلة 3: إنشاء ملف .env..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    $envContent = @"
# ═══════════════════════════════════════
# OpenAI Configuration (مطلوب)
# ═══════════════════════════════════════
OPENAI_API_KEY=sk-proj-REPLACE-WITH-YOUR-ACTUAL-KEY-HERE
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000

# ═══════════════════════════════════════
# Application URLs
# ═══════════════════════════════════════
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Hayat Beauty Clinic

# ═══════════════════════════════════════
# Contact Info
# ═══════════════════════════════════════
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ تم إنشاء ملف .env" -ForegroundColor Green
    Write-Host "⚠️ لا تنس تعديل OPENAI_API_KEY في ملف .env !" -ForegroundColor Yellow
} else {
    Write-Host "✅ ملف .env موجود بالفعل" -ForegroundColor Green
}
Write-Host ""

# ═════════════════════════════════════════════════════════════
# المرحلة 4: إنشاء هيكل المجلدات
# ═════════════════════════════════════════════════════════════

Write-Host "المرحلة 4: إنشاء هيكل المجلدات..." -ForegroundColor Yellow

$directories = @(
    "src/data/types",
    "src/lib",
    "src/store",
    "src/components/chat",
    "src/components/ui",
    "src/components/whatsapp",
    "src/components/analytics",
    "src/components/payment",
    "src/app/api/chat/stream",
    "src/app/api/checkout",
    "src/app/api/webhooks/stripe",
    "src/app/auth/signin",
    "src/app/payment/success",
    "src/app/payment/cancelled",
    "src/scripts",
    "public"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ تم إنشاء: $dir" -ForegroundColor Green
    }
}

Write-Host "✅ تم إنشاء جميع المجلدات" -ForegroundColor Green
Write-Host ""

# ═════════════════════════════════════════════════════════════
# المرحلة 5: إنشاء ملفات البيانات
# ═════════════════════════════════════════════════════════════

Write-Host "المرحلة 5: إنشاء ملفات البيانات..." -ForegroundColor Yellow

# سيتم إنشاء الملفات في الخطوات التالية
Write-Host "✅ جاهز لإنشاء ملفات البيانات" -ForegroundColor Green
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ اكتملت المراحل الأساسية!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "الخطوات التالية:" -ForegroundColor Yellow
Write-Host "1. عدّل ملف .env وأضف OPENAI_API_KEY الحقيقي" -ForegroundColor White
Write-Host "2. شغّل السكريبتات التالية لإنشاء الملفات المتبقية" -ForegroundColor White
Write-Host ""





