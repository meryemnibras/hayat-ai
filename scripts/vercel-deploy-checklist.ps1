# Vercel Deployment Checklist Script

Write-Host "`n=== Vercel Deployment Checklist ===" -ForegroundColor Cyan
Write-Host ""

# Check if vercel.json exists
Write-Host "[1/8] Checking vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "   [OK] vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] vercel.json not found" -ForegroundColor Red
    exit 1
}

# Check if .env.example exists
Write-Host "`n[2/8] Checking .env.example..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "   [OK] .env.example exists" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] .env.example not found" -ForegroundColor Yellow
}

# Check package.json
Write-Host "`n[3/8] Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    if ($package.scripts.build) {
        Write-Host "   [OK] Build script found: $($package.scripts.build)" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Build script not found" -ForegroundColor Red
    }
} else {
    Write-Host "   [ERROR] package.json not found" -ForegroundColor Red
    exit 1
}

# Check Prisma schema
Write-Host "`n[4/8] Checking Prisma schema..." -ForegroundColor Yellow
if (Test-Path "prisma\schema.prisma") {
    Write-Host "   [OK] Prisma schema exists" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Prisma schema not found" -ForegroundColor Yellow
}

# Check Next.js config
Write-Host "`n[5/8] Checking Next.js config..." -ForegroundColor Yellow
if (Test-Path "next.config.ts") {
    Write-Host "   [OK] next.config.ts exists" -ForegroundColor Green
} elseif (Test-Path "next.config.js") {
    Write-Host "   [OK] next.config.js exists" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Next.js config not found" -ForegroundColor Yellow
}

# Check if Vercel CLI is installed
Write-Host "`n[6/8] Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if ($vercelInstalled) {
    Write-Host "   [OK] Vercel CLI is installed" -ForegroundColor Green
    $vercelVersion = vercel --version 2>&1
    Write-Host "   Version: $vercelVersion" -ForegroundColor Gray
} else {
    Write-Host "   [INFO] Vercel CLI not installed" -ForegroundColor Yellow
    Write-Host "   Install with: npm install -g vercel" -ForegroundColor Gray
}

# Check .gitignore
Write-Host "`n[7/8] Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Host "   [OK] .env files are ignored" -ForegroundColor Green
    } else {
        Write-Host "   [WARNING] .env files might not be ignored" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [WARNING] .gitignore not found" -ForegroundColor Yellow
}

# Summary
Write-Host "`n[8/8] Summary..." -ForegroundColor Yellow
Write-Host "`n=== Required Environment Variables ===" -ForegroundColor Cyan
Write-Host "  - OPENAI_API_KEY (Secret)" -ForegroundColor White
Write-Host "  - OPENAI_MODEL" -ForegroundColor White
Write-Host "  - TEMPERATURE" -ForegroundColor White
Write-Host "  - MAX_TOKENS" -ForegroundColor White
Write-Host "  - NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "  - NEXTAUTH_URL" -ForegroundColor White
Write-Host "  - DATABASE_URL" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_APP_URL" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_APP_NAME" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_WHATSAPP_NUMBER" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_PHONE_NUMBER" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_EMAIL" -ForegroundColor White

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "  1. Review DEPLOY_TO_VERCEL.md" -ForegroundColor White
Write-Host "  2. Add Environment Variables in Vercel Dashboard" -ForegroundColor White
Write-Host "  3. Deploy using: vercel --prod" -ForegroundColor White
Write-Host "  4. Or use Vercel Dashboard (easier)" -ForegroundColor White

Write-Host "`nStatus: Ready for deployment" -ForegroundColor Green
Write-Host ""











