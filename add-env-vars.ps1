# ═══════════════════════════════════════
# إضافة Environment Variables تلقائياً
# ═══════════════════════════════════════

$ErrorActionPreference = "Continue"

Write-Host "🔧 إضافة Environment Variables..." -ForegroundColor Green
Write-Host ""

cd "C:\Users\basel\OneDrive\Desktop\AI HAYAT CLINIC\hayat-ai"

# قراءة .env إذا كان موجوداً
$envVars = @{}
if (Test-Path ".env") {
    Write-Host "📖 قراءة ملف .env..." -ForegroundColor Cyan
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            if ($key -and $value -and !$key.StartsWith('#')) {
                $envVars[$key] = $value
            }
        }
    }
    Write-Host "✅ تم قراءة $($envVars.Count) متغير" -ForegroundColor Green
} else {
    Write-Host "⚠️  ملف .env غير موجود" -ForegroundColor Yellow
    Write-Host "📝 سيتم استخدام القيم الافتراضية" -ForegroundColor Yellow
}

# المتغيرات المطلوبة
$requiredVars = @(
    @{Key="DATABASE_URL"; Description="Database connection string"},
    @{Key="OPENAI_API_KEY"; Description="OpenAI API key"},
    @{Key="NEXT_PUBLIC_APP_URL"; Description="Application URL"},
    @{Key="DEFAULT_CLINIC_ID"; Description="Default clinic ID"}
)

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "إضافة Environment Variables إلى Vercel" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($var in $requiredVars) {
    $key = $var.Key
    $value = $envVars[$key]
    
    if (!$value) {
        Write-Host "⚠️  $key غير موجود في .env" -ForegroundColor Yellow
        Write-Host "   سيتم تخطيه - أضفه يدوياً في Dashboard" -ForegroundColor Gray
        continue
    }
    
    Write-Host "➕ إضافة $key..." -ForegroundColor Cyan
    
    # محاولة إضافة المتغير
    $result = vercel env add $key production 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ تم إضافة $key" -ForegroundColor Green
    } else {
        Write-Host "⚠️  فشل إضافة $key تلقائياً" -ForegroundColor Yellow
        Write-Host "   أضفه يدوياً في Dashboard" -ForegroundColor Gray
    }
    
    Write-Host ""
}

Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ اكتملت العملية!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "1. تحقق من Environment Variables في Dashboard" -ForegroundColor White
Write-Host "2. أضف أي متغيرات مفقودة يدوياً" -ForegroundColor White
Write-Host "3. قم بـ Redeploy المشروع" -ForegroundColor White
Write-Host ""



